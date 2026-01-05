"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTransport } from "nodemailer";
import { getBulkUploadSuccessEmailHtml } from "@/lib/email-templates";
import * as xlsx from 'xlsx';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { sendErrorNotification } from "@/lib/notifications";

function generateShortCode(): string {
    return crypto.randomBytes(4).toString('hex').slice(0, 6);
}


export async function processBulkUpload(formData: FormData) {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    // Double check premium status securely on server
    // @ts-ignore
    const dbUser = await db.findUserById(session.user.id);
    let isPremium = dbUser?.plan === 'premium';
    if (dbUser?.plan === 'freemium' && dbUser.trial_ends_at) {
        if (new Date(dbUser.trial_ends_at) > new Date()) {
            isPremium = true;
        }
    }

    if (!dbUser || !isPremium) {
        throw new Error("Upgrade to Premium to access this feature.");
    }

    const file = formData.get('file') as File;
    const dryRun = formData.get('dryRun') === 'true';

    if (!file) {
        throw new Error("No file uploaded");
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();

    // Storage Backup (Best Effort)
    try {
        const { db } = await import("@/lib/db");
        const storageConfig = await db.getStorageConfig();

        if (storageConfig.enabled) {
            const { StorageService } = await import("@/lib/storage-service");
            const provider = await StorageService.getProvider();

            await provider.upload(Buffer.from(arrayBuffer), file.name);
            console.log("File backed up successfully to storage");
        } else {
            console.log("Storage backup disabled by configuration");
        }
    } catch (e: any) {
        // Ignore "path not configured" or storage errors, just log
        console.warn("Storage backup skipped or failed:", e);
        // Notify admin if backup was explicitly enabled but failed
        try {
            const { db } = await import("@/lib/db");
            const config = await db.getStorageConfig();
            if (config.enabled) {
                await sendErrorNotification(e, `Bulk Upload Storage Backup (User: ${session.user.email})`);
            }
        } catch (ignore) { }
    }

    // Process file (Always use memory buffer for consistent performance across providers)
    let workbook;
    try {
        workbook = xlsx.read(arrayBuffer, { type: 'array' });

        if (!workbook.SheetNames || !workbook.SheetNames.length) {
            throw new Error("Excel file is empty");
        }
    } catch (e: any) {
        console.error("Excel parse error:", e);
        // Notify Admin of Parse Error if it's not a user error (like password)
        const isUserError = e.message && (e.message.indexOf("Encrypted") !== -1 || e.message.indexOf("Password") !== -1);
        if (!isUserError) {
            await sendErrorNotification(e, `Bulk Upload Excel Parsing (User: ${session.user.email})`);
        }

        if (isUserError) {
            throw new Error("Password protected files are not supported. Please upload an unprotected file.");
        }
        throw new Error("Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.");
    }

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    // Assuming first row is header or URLs start immediately. 
    // Let's assume user provides a list of URLs in the first column "A"
    // Or we scan for strings starting with http/https

    const createdUrls: { original: string, short: string, error?: string }[] = [];
    let successCount = 0;
    let failedCount = 0;

    // Skip header if present (heuristic: if first cell contains "url" or "link" case insensitive)
    let startIndex = 0;
    if (jsonData.length > 0 && typeof jsonData[0][0] === 'string' && /url|link/i.test(jsonData[0][0])) {
        startIndex = 1;
    }

    // DRY RUN: Just count valid URLs
    if (dryRun) {
        let foundCount = 0;
        for (let i = startIndex; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;
            const originalUrl = String(row[0]).trim();
            if (!originalUrl) continue;
            // Basic validation to count it as a target
            try {
                new URL(originalUrl);
                foundCount++;
            } catch (e) {
                // Ignore invalid URLs in count or maybe count them as 'invalid' if we want to warn
            }
        }
        return {
            success: true,
            dryRun: true,
            foundCount
        };
    }

    // Generate a base tag for this batch: blk{MMDDYYYY}{HHMMSS}
    const today = new Date();
    const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}${today.getFullYear()}`;
    const timeStr = `${String(today.getHours()).padStart(2, '0')}${String(today.getMinutes()).padStart(2, '0')}${String(today.getSeconds()).padStart(2, '0')}`;
    const bulkTag = `blk${dateStr}${timeStr}`;

    for (let i = startIndex; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        const originalUrl = String(row[0]).trim();
        if (!originalUrl) continue;

        try {
            // Validate URL format
            new URL(originalUrl);

            const shortCode = generateShortCode();
            const newUrl = await db.createUrl({
                short_code: shortCode,
                original_url: originalUrl,
                user_id: dbUser.id,
                tags: [bulkTag], // Same tag for all URLs in this batch
            });

            createdUrls.push({
                original: originalUrl,
                short: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${shortCode}`
            });
            successCount++;

        } catch (e: any) {
            console.error(`Failed to process URL: ${originalUrl}`, e);
            createdUrls.push({
                original: originalUrl,
                short: '',
                error: e.message || "Invalid URL"
            });
            failedCount++;
        }
    }

    // Send Email
    try {
        const transporter = createTransport({
            service: 'gmail', // Or use env vars for specific SMTP
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"URL Shortener" <noreply@example.com>',
            to: dbUser.email,
            subject: 'Bulk Upload Processed Successfully',
            html: getBulkUploadSuccessEmailHtml(dbUser.username, successCount + failedCount, successCount, failedCount),
        });

    } catch (emailError) {
        console.error("Failed to send bulk upload email:", emailError);
        await sendErrorNotification(emailError, `Bulk Upload Success Email (User: ${session.user.email})`);
        // Don't fail the request just because email failed
    }

    return {
        success: true,
        dryRun: false,
        total: successCount + failedCount,
        successCount,
        failedCount,
        logs: createdUrls,
        tag: bulkTag
    };
}

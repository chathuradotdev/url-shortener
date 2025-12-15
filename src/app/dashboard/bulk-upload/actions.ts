"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTransport } from "nodemailer";
import { getBulkUploadSuccessEmailHtml } from "@/lib/email-templates";
import * as xlsx from 'xlsx';
import crypto from 'crypto';

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
    if (!dbUser || dbUser.plan !== 'premium') {
        throw new Error("Upgrade to Premium to access this feature.");
    }

    const file = formData.get('file') as File;
    if (!file) {
        throw new Error("No file uploaded");
    }

    // Read file buffer
    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();

    // Parse Excel with error handling
    let workbook;
    try {
        workbook = xlsx.read(arrayBuffer, { type: 'array' });
    } catch (e: any) {
        console.error("Excel parse error:", e);
        if (e.message && (e.message.indexOf("Encrypted") !== -1 || e.message.indexOf("Password") !== -1)) {
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
        // Don't fail the request just because email failed
    }

    return {
        success: true,
        total: successCount + failedCount,
        successCount,
        failedCount,
        logs: createdUrls,
        tag: bulkTag
    };
}

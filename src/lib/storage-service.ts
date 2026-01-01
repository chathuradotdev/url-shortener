import { db } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { BlobServiceClient } from "@azure/storage-blob";
import { Readable } from "stream";

export interface IStorageProvider {
    upload(fileBuffer: Buffer, fileName: string): Promise<string>;
    download(location: string): Promise<Buffer>;
}

export class LocalStorageProvider implements IStorageProvider {
    constructor(private basePath: string) { }

    async upload(fileBuffer: Buffer, fileName: string): Promise<string> {
        if (!this.basePath) throw new Error("Local storage path is not configured");

        // Ensure directory exists
        await fs.mkdir(this.basePath, { recursive: true });

        // Create timestamped filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = path.join(this.basePath, `${timestamp}_${safeName}`);

        await fs.writeFile(filePath, fileBuffer);
        return filePath;
    }

    async download(location: string): Promise<Buffer> {
        return fs.readFile(location);
    }
}

export class S3StorageProvider implements IStorageProvider {
    private client: S3Client;
    private bucket: string;

    constructor(config: { region: string; accessKey: string; secretKey: string; bucket: string; endpoint?: string }) {
        this.client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretKey
            },
            endpoint: config.endpoint || undefined
        });
        this.bucket = config.bucket;
    }

    async upload(fileBuffer: Buffer, fileName: string): Promise<string> {
        const key = `uploads/${Date.now()}-${fileName}`;
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: fileBuffer
        });

        await this.client.send(command);
        return key;
    }

    async download(key: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        const response = await this.client.send(command);
        if (!response.Body) {
            throw new Error("Empty response body from S3");
        }

        // Convert stream to buffer
        const stream = response.Body as Readable;
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
    }
}

export class AzureStorageProvider implements IStorageProvider {
    private client: BlobServiceClient;
    private container: string;

    constructor(connectionString: string, containerName: string) {
        this.client = BlobServiceClient.fromConnectionString(connectionString);
        this.container = containerName;
    }

    async upload(fileBuffer: Buffer, fileName: string): Promise<string> {
        const containerClient = this.client.getContainerClient(this.container);

        // Ensure container exists
        await containerClient.createIfNotExists();

        const blobName = `uploads/${Date.now()}-${fileName}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(fileBuffer);
        return blobName;
    }

    async download(blobName: string): Promise<Buffer> {
        const containerClient = this.client.getContainerClient(this.container);
        const blobClient = containerClient.getBlobClient(blobName);

        const downloadBlockBlobResponse = await blobClient.download();

        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new Error("Empty response body from Azure");
        }

        const stream = downloadBlockBlobResponse.readableStreamBody;
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
    }
}

export class StorageService {
    static async getProvider(): Promise<IStorageProvider> {
        const config = await db.getStorageConfig();

        switch (config.provider) {
            case 's3':
                if (!config.region || !config.accessKey || !config.secretKey || !config.bucket) {
                    throw new Error("Incomplete S3 configuration");
                }
                return new S3StorageProvider({
                    region: config.region,
                    accessKey: config.accessKey,
                    secretKey: config.secretKey,
                    bucket: config.bucket,
                    endpoint: config.endpoint
                });

            case 'azure':
                if (!config.connectionString || !config.bucket) {
                    throw new Error("Incomplete Azure configuration");
                }
                return new AzureStorageProvider(config.connectionString, config.bucket);

            case 'local':
            default:
                // Default to local if configured, otherwise might throw or return dummy?
                // If local path is empty, we technically can't store.
                // But let's assume if it is selected, the user wants it.
                if (!config.localPath) {
                    // Fail gracefully or just fallback to some default temp?
                    // Better to throw so user knows to configure it.
                    // But for backward compatibility with "no storage configured" logic...
                    // The old code checked "if (storagePath)".
                    // So we can return a "NullProvider" or handle check upstream.
                    // Let's return LocalStorageProvider which throws if path missing.
                }
                return new LocalStorageProvider(config.localPath);
        }
    }
}

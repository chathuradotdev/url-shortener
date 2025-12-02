import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const URLS_FILE = path.join(DATA_DIR, 'urls.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Ensure files exist
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(URLS_FILE)) {
    fs.writeFileSync(URLS_FILE, JSON.stringify([]));
}

export interface User {
    id: string;
    username: string;
    email: string;
    password_hash?: string;
    created_at: string;
    image?: string;
}

export interface Url {
    id: string;
    short_code: string;
    original_url: string;
    user_id: string | null; // null for guest
    clicks: number;
    created_at: string;
}

class JsonDB {
    private read<T>(file: string): T[] {
        try {
            const data = fs.readFileSync(file, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    private write<T>(file: string, data: T[]) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    }

    // User methods
    createUser(user: Omit<User, 'id' | 'created_at'>): User {
        const users = this.read<User>(USERS_FILE);
        const newUser: User = {
            ...user,
            id: randomUUID(),
            created_at: new Date().toISOString(),
        };
        users.push(newUser);
        this.write(USERS_FILE, users);
        return newUser;
    }

    findUserByEmail(email: string): User | undefined {
        const users = this.read<User>(USERS_FILE);
        return users.find((u) => u.email === email);
    }

    findUserById(id: string): User | undefined {
        const users = this.read<User>(USERS_FILE);
        return users.find((u) => u.id === id);
    }

    // URL methods
    createUrl(url: Omit<Url, 'id' | 'created_at' | 'clicks'>): Url {
        const urls = this.read<Url>(URLS_FILE);
        const newUrl: Url = {
            ...url,
            id: randomUUID(),
            clicks: 0,
            created_at: new Date().toISOString(),
        };
        urls.push(newUrl);
        this.write(URLS_FILE, urls);
        return newUrl;
    }

    findUrlByShortCode(shortCode: string): Url | undefined {
        const urls = this.read<Url>(URLS_FILE);
        return urls.find((u) => u.short_code === shortCode);
    }

    incrementUrlClicks(shortCode: string) {
        const urls = this.read<Url>(URLS_FILE);
        const urlIndex = urls.findIndex((u) => u.short_code === shortCode);
        if (urlIndex !== -1) {
            urls[urlIndex].clicks += 1;
            this.write(URLS_FILE, urls);
        }
    }

    getUserUrls(userId: string): Url[] {
        const urls = this.read<Url>(URLS_FILE);
        return urls.filter((u) => u.user_id === userId);
    }
}

export const db = new JsonDB();

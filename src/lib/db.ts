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
    role: 'admin' | 'user';
    status: 'active' | 'banned';
    plan: 'freemium' | 'premium';
    reset_token?: string | null;
    reset_token_expiry?: string | null;
}

export interface Url {
    id: string;
    short_code: string;
    original_url: string;
    user_id: string | null; // null for guest
    clicks: number;
    created_at: string;
    status: 'active' | 'removed';
    expires_at?: string | null;
    tags?: string[];
}

export interface AnalyticsEvent {
    id: string;
    url_id: string;
    timestamp: string;
    user_agent: string;
    ip?: string;
    country?: string;
    city?: string;
    device?: string;
    browser?: string;
    os?: string;
    referrer?: string;
}

const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Ensure analytics file exists
if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify([]));
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
    createUser(user: Omit<User, 'id' | 'created_at' | 'role' | 'status' | 'plan'>): User {
        const users = this.read<User>(USERS_FILE);
        const newUser: User = {
            ...user,
            id: randomUUID(),
            created_at: new Date().toISOString(),
            role: 'user',
            status: 'active',
            plan: 'freemium'
        };
        users.push(newUser);
        this.write(USERS_FILE, users);
        return newUser;
    }

    findUserByEmail(email: string): User | undefined {
        const users = this.read<User>(USERS_FILE);
        const normalizedEmail = email.toLowerCase().trim();
        return users.find((u) => u.email.toLowerCase().trim() === normalizedEmail);
    }

    findUserById(id: string): User | undefined {
        const users = this.read<User>(USERS_FILE);
        return users.find((u) => u.id === id);
    }

    findUserByResetToken(token: string): User | undefined {
        const users = this.read<User>(USERS_FILE);
        return users.find((u) => u.reset_token === token && u.reset_token_expiry && new Date(u.reset_token_expiry) > new Date());
    }

    getAllUsers(): User[] {
        return this.read<User>(USERS_FILE);
    }

    updateUserStatus(userId: string, status: 'active' | 'banned') {
        const users = this.read<User>(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex].status = status;
            this.write(USERS_FILE, users);
        }
    }

    setUserResetToken(userId: string, token: string, expiry: string) {
        const users = this.read<User>(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex].reset_token = token;
            users[userIndex].reset_token_expiry = expiry;
            this.write(USERS_FILE, users);
        }
    }

    updateUserPassword(userId: string, passwordHash: string) {
        const users = this.read<User>(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex].password_hash = passwordHash;
            users[userIndex].reset_token = null;
            users[userIndex].reset_token_expiry = null;
            this.write(USERS_FILE, users);
        }
    }

    // URL methods
    createUrl(url: Omit<Url, 'id' | 'created_at' | 'clicks' | 'status'>): Url {
        const urls = this.read<Url>(URLS_FILE);
        const newUrl: Url = {
            ...url,
            id: randomUUID(),
            clicks: 0,
            created_at: new Date().toISOString(),
            status: 'active'
        };
        urls.push(newUrl);
        this.write(URLS_FILE, urls);
        return newUrl;
    }

    findUrlByShortCode(shortCode: string): Url | undefined {
        const urls = this.read<Url>(URLS_FILE);
        return urls.find((u) => u.short_code === shortCode && u.status !== 'removed');
    }

    getAllUrls(): Url[] {
        return this.read<Url>(URLS_FILE);
    }

    updateUrlStatus(urlId: string, status: 'active' | 'removed') {
        const urls = this.read<Url>(URLS_FILE);
        const urlIndex = urls.findIndex(u => u.id === urlId);
        if (urlIndex !== -1) {
            urls[urlIndex].status = status;
            this.write(URLS_FILE, urls);
        }
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
        return urls.filter((u) => u.user_id === userId && u.status !== 'removed');
    }

    // Analytics methods
    trackUrlVisit(shortCode: string, data: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'url_id'>) {
        const url = this.findUrlByShortCode(shortCode);
        if (!url) return;

        const events = this.read<AnalyticsEvent>(ANALYTICS_FILE);
        const newEvent: AnalyticsEvent = {
            ...data,
            id: randomUUID(),
            url_id: url.id,
            timestamp: new Date().toISOString(),
        };
        events.push(newEvent);
        this.write(ANALYTICS_FILE, events);
    }

    getUrlAnalytics(shortCode: string): AnalyticsEvent[] {
        const url = this.findUrlByShortCode(shortCode);
        if (!url) return [];

        const events = this.read<AnalyticsEvent>(ANALYTICS_FILE);
        return events.filter((e) => e.url_id === url.id);
    }

    getAllAnalytics(): AnalyticsEvent[] {
        return this.read<AnalyticsEvent>(ANALYTICS_FILE);
    }

    getSystemStats() {
        const users = this.read<User>(USERS_FILE);
        const urls = this.read<Url>(URLS_FILE);
        const activeUrls = urls.filter(u => u.status !== 'removed');
        const totalClicks = activeUrls.reduce((sum, url) => sum + url.clicks, 0);

        return {
            totalUsers: users.length,
            totalUrls: activeUrls.length,
            totalClicks
        };
    }
}

export const db = new JsonDB();


import { createClient, SupabaseClient } from '@supabase/supabase-js';

// User Interface
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

// Url Interface
export interface Url {
    id: string;
    short_code: string;
    original_url: string;
    user_id: string | null;
    clicks: number;
    created_at: string;
    status: 'active' | 'removed';
    expires_at?: string | null;
    tags?: string[];
    password?: string;
    cloaked?: boolean;
}

// Analytics Interface
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseDB {

    // --- User Methods ---

    async createUser(user: Omit<User, 'id' | 'created_at' | 'role' | 'status' | 'plan'>): Promise<User> {
        const { data, error } = await supabase
            .from('users')
            .insert([{
                ...user,
                role: 'user',
                status: 'active',
                plan: 'freemium'
            }])
            .select()
            .single();

        if (error) throw error;
        return data as User;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle(); // maybeSingle returns null if not found instead of error
        return data as User | null;
    }

    async findUserById(id: string): Promise<User | null> {
        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        return data as User | null;
    }

    async findUserByResetToken(token: string): Promise<User | null> {
        // We filter by token AND expiry in the query for efficiency
        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('reset_token', token)
            .gt('reset_token_expiry', new Date().toISOString())
            .maybeSingle();
        return data as User | null;
    }

    async getAllUsers(): Promise<User[]> {
        const { data } = await supabase
            .from('users')
            .select('*');
        return (data || []) as User[];
    }

    async updateUserStatus(userId: string, status: 'active' | 'banned'): Promise<void> {
        await supabase
            .from('users')
            .update({ status })
            .eq('id', userId);
    }

    async setUserResetToken(userId: string, token: string, expiry: string): Promise<void> {
        await supabase
            .from('users')
            .update({ reset_token: token, reset_token_expiry: expiry })
            .eq('id', userId);
    }

    async updateUserPassword(userId: string, passwordHash: string): Promise<void> {
        await supabase
            .from('users')
            .update({
                password_hash: passwordHash,
                reset_token: null,
                reset_token_expiry: null
            })
            .eq('id', userId);
    }

    // --- URL Methods ---

    async createUrl(url: Omit<Url, 'id' | 'created_at' | 'clicks' | 'status'>): Promise<Url> {
        const { data, error } = await supabase
            .from('urls')
            .insert([{
                ...url,
                clicks: 0,
                status: 'active'
            }])
            .select()
            .single();

        if (error) throw error;
        return data as Url;
    }

    async findUrlByShortCode(shortCode: string): Promise<Url | null> {
        // Ensure we don't return removed URLs? original logic: u.status !== 'removed'
        const { data } = await supabase
            .from('urls')
            .select('*')
            .eq('short_code', shortCode)
            .neq('status', 'removed')
            .maybeSingle();
        return data as Url | null;
    }

    async getAllUrls(): Promise<Url[]> {
        const { data } = await supabase
            .from('urls')
            .select('*');
        return (data || []) as Url[];
    }

    async updateUrlStatus(urlId: string, status: 'active' | 'removed'): Promise<void> {
        await supabase
            .from('urls')
            .update({ status })
            .eq('id', urlId);
    }

    async incrementUrlClicks(shortCode: string): Promise<void> {
        // RPC is better for atomic increment, but for now we read-modify-write or just use rpc if available.
        // Or cleaner: invoke a sql function.
        // But to keep it simple without adding custom SQL functions unless necessary, we can try:
        // .update({ clicks: 0 }) ... wait, we need atomic increment.
        // Supabase/PostgREST doesn't support 'clicks + 1' in simple update without rpc.
        // Plan B: Fetch, then update. (Not atomic but matches JsonDB concurrency level).

        const url = await this.findUrlByShortCode(shortCode);
        if (url) {
            await supabase
                .from('urls')
                .update({ clicks: url.clicks + 1 })
                .eq('id', url.id);
        }
    }

    async getUserUrls(userId: string): Promise<Url[]> {
        const { data } = await supabase
            .from('urls')
            .select('*')
            .eq('user_id', userId)
            .neq('status', 'removed');
        return (data || []) as Url[];
    }

    async removeUrlPassword(urlId: string): Promise<void> {
        await supabase
            .from('urls')
            .update({ password: null })
            .eq('id', urlId);
    }

    // --- Analytics Methods ---

    async trackUrlVisit(shortCode: string, analyticsData: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'url_id'>): Promise<void> {
        const url = await this.findUrlByShortCode(shortCode);
        if (!url) return;

        await supabase
            .from('analytics')
            .insert([{
                ...analyticsData,
                url_id: url.id,
                // timestamp is auto-defaulted in DB schema, or we can send it
                timestamp: new Date().toISOString()
            }]);
    }

    async getUrlAnalytics(shortCode: string): Promise<AnalyticsEvent[]> {
        const url = await this.findUrlByShortCode(shortCode);
        if (!url) return [];

        const { data } = await supabase
            .from('analytics')
            .select('*')
            .eq('url_id', url.id);
        return (data || []) as AnalyticsEvent[];
    }

    async getAllAnalytics(): Promise<AnalyticsEvent[]> {
        const { data } = await supabase
            .from('analytics')
            .select('*');
        return (data || []) as AnalyticsEvent[];
    }

    async getSystemStats(): Promise<{ totalUsers: number, totalUrls: number, totalClicks: number }> {
        // This acts as a rough "count"
        // For accurate counts in Supabase, we use count='exact' and head=true

        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });

        // For URLs, filter by active
        const { count: urlCount } = await supabase
            .from('urls')
            .select('*', { count: 'exact', head: true })
            .neq('status', 'removed');

        // Total clicks is harder without aggregation queries.
        // We can either fetch all (expensive) or create a Postgres view / RPC.
        // For parity with old code: fetch all active urls and sum.
        // WARNING: This is bad for scale, but matches original implementation logic.
        // Optimization: Create an RPC function `get_system_stats` later.

        const { data: urls } = await supabase
            .from('urls')
            .select('clicks')
            .neq('status', 'removed');

        const totalClicks = (urls || []).reduce((sum, u) => sum + (u.clicks || 0), 0);

        return {
            totalUsers: userCount || 0,
            totalUrls: urlCount || 0,
            totalClicks
        };
    }
}

export const db = new SupabaseDB();

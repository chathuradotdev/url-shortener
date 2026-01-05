
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
    last_login?: string | null;
    trial_ends_at?: string | null;
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
    android_deep_link?: string | null;
    ios_deep_link?: string | null;
    permanent_redirect?: boolean; // 301 Redirect
    interim_page_enabled?: boolean;
    interim_message?: string;
    interim_duration?: number;
    interim_visit_limit?: number; // How many visitors see the message
    interim_visit_count?: number; // How many have seen it so far
    targeting_enabled?: boolean;
    geo_targeting?: Record<string, string>; // { "US": "https://...", "GB": "https://..." }
    time_targeting?: {
        startTime: string; // "09:00"
        endTime: string;   // "17:00"
        days: string[];    // ["Mon", "Tue"]
        url: string;
    }[];
    burn_after_reading?: boolean;
    burn_visit_limit?: number; // Default 1
    social_title?: string | null;
    social_description?: string | null;
    social_image?: string | null;
    rotation_enabled?: boolean;
    rotation_mode?: 'weighted' | 'sequential'; // 'weighted' = random based on %, 'sequential' = round robin
    rotation_rules?: {
        url: string;
        weight: number; // percentage (0-100)
    }[];
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

// Login History Interface
export interface LoginRecord {
    id: string;
    user_id: string;
    timestamp: string;
    ip?: string;
    user_agent?: string;
}

// System Alert Interface
export interface SystemAlert {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success' | 'promo';
    is_active: boolean;
    audience: 'all' | 'guest' | 'user';
    start_date?: string | null;
    end_date?: string | null;
    action_label?: string | null;
    action_url?: string | null;
    created_at: string;
}

// Bio Page Interface
export interface BioPage {
    id: string;
    user_id: string;
    slug: string;
    title?: string;
    description?: string;
    avatar_url?: string;
    theme?: any;
    created_at: string;
}

// Bio Link Interface
export interface BioLink {
    id: string;
    bio_page_id: string;
    title: string;
    url: string;
    icon?: string;
    position: number;
    is_active: boolean;
    created_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.");
}

// Create a dummy client or validation proxy if tokens are missing to prevent crash during import
export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : createClient('https://placeholder.supabase.co', 'placeholder'); // This will fail on use but pass import


class SupabaseDB {

    // --- Bio Page Methods ---

    async getBioPageByUserId(userId: string): Promise<BioPage | null> {
        const { data } = await supabase
            .from('bio_pages')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        return data as BioPage | null;
    }

    async getBioPageBySlug(slug: string): Promise<BioPage | null> {
        const { data } = await supabase
            .from('bio_pages')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();
        return data as BioPage | null;
    }

    async createBioPage(bioPage: Omit<BioPage, 'id' | 'created_at'>): Promise<BioPage> {
        const { data, error } = await supabase
            .from('bio_pages')
            .insert([bioPage])
            .select()
            .single();

        if (error) throw error;
        return data as BioPage;
    }

    async updateBioPage(userId: string, updates: Partial<BioPage>): Promise<BioPage> {
        const { data, error } = await supabase
            .from('bio_pages')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as BioPage;
    }

    // --- Bio Link Methods ---

    async getBioLinks(bioPageId: string): Promise<BioLink[]> {
        const { data } = await supabase
            .from('bio_links')
            .select('*')
            .eq('bio_page_id', bioPageId)
            .order('position', { ascending: true });
        return (data || []) as BioLink[];
    }

    async addBioLink(link: Omit<BioLink, 'id' | 'created_at'>): Promise<BioLink> {
        // Get current max position to append to end
        // Optimization: handled by client or separate query. For now, we trust input or 0.
        // Actually, let's find the max position if position is not provided?
        // Let's assume the caller handles position logic or we default to 0.

        const { data, error } = await supabase
            .from('bio_links')
            .insert([link])
            .select()
            .single();

        if (error) throw error;
        return data as BioLink;
    }

    async updateBioLink(id: string, updates: Partial<BioLink>): Promise<BioLink> {
        const { data, error } = await supabase
            .from('bio_links')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as BioLink;
    }

    async deleteBioLink(id: string): Promise<void> {
        const { error } = await supabase
            .from('bio_links')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }

    // --- User Methods ---

    async createUser(user: Omit<User, 'id' | 'created_at' | 'role' | 'status' | 'plan'>): Promise<User> {
        const { data, error } = await supabase
            .from('users')
            .insert([{
                ...user,
                role: 'user',
                status: 'active',
                plan: 'freemium',
                // Default logic can be overridden by passed user object properties if I used spread ...user AFTER defaults, 
                // but here ...user comes first. 
                // Since user argument Omit excludes 'plan', we are good.
                // However, I need to make sure trial_ends_at is PASSED in the user argument or I default it here?
                // The interface Omit doesn't exclude trial_ends_at, so it can be passed in 'user'.
                // So I don't strictly need to change the body if I pass it in.
                // But I'll leave the function body as is, just reliant on the interface change above.
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

    // Updates user plan directly
    async updateUserPlan(userId: string, plan: 'freemium' | 'premium'): Promise<void> {
        await supabase
            .from('users')
            .update({ plan })
            .eq('id', userId);
    }

    async updateLastLogin(userId: string, ip?: string, userAgent?: string): Promise<void> {
        const now = new Date().toISOString();

        // Update user's last_login field
        await supabase
            .from('users')
            .update({ last_login: now })
            .eq('id', userId);

        // Record in history
        await this.recordLoginHistory(userId, now, ip, userAgent);
    }

    async recordLoginHistory(userId: string, timestamp: string, ip?: string, userAgent?: string): Promise<void> {
        await supabase
            .from('login_history')
            .insert([{
                user_id: userId,
                timestamp: timestamp,
                ip: ip,
                user_agent: userAgent
            }]);
    }

    async getLoginHistory(userId: string): Promise<LoginRecord[]> {
        // Get records from last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const { data } = await supabase
            .from('login_history')
            .select('*')
            .eq('user_id', userId)
            .gte('timestamp', sixMonthsAgo.toISOString())
            .order('timestamp', { ascending: false });

        return (data || []) as LoginRecord[];
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
        const url = await this.findUrlByShortCode(shortCode);
        if (url) {
            await supabase
                .from('urls')
                .update({ clicks: url.clicks + 1 })
                .eq('id', url.id);
        }
    }

    async incrementInterimVisitCount(urlId: string): Promise<void> {
        // Fallback: This is not race-condition safe but works for low traffic
        const { data } = await supabase.from('urls').select('interim_visit_count').eq('id', urlId).single();
        if (data) {
            await supabase.from('urls').update({
                interim_visit_count: (data.interim_visit_count || 0) + 1
            }).eq('id', urlId);
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

    async getSystemStats(): Promise<{ totalUsers: number, totalUrls: number, totalClicks: number, guestUrls: number, memberUrls: number }> {
        // This acts as a rough "count"
        // For accurate counts in Supabase, we use count='exact' and head=true

        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });

        // For URLs, filter by active
        const { count: urlCount } = await supabase
            .from('urls')
            .select('*', { count: 'exact', head: true })
            .neq('status', 'removed');

        const { count: guestUrlCount } = await supabase
            .from('urls')
            .select('*', { count: 'exact', head: true })
            .neq('status', 'removed')
            .is('user_id', null);

        const { count: memberUrlCount } = await supabase
            .from('urls')
            .select('*', { count: 'exact', head: true })
            .neq('status', 'removed')
            .not('user_id', 'is', null);

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
            totalClicks,
            guestUrls: guestUrlCount || 0,
            memberUrls: memberUrlCount || 0
        };
    }

    async getMaintenanceMode(): Promise<boolean> {
        const { data } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'maintenance_mode')
            .maybeSingle();
        return data?.value === 'true';
    }

    async getAdminNotificationEmails(): Promise<string[]> {
        const { data } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'admin_notification_emails')
            .maybeSingle();

        if (!data?.value) return [];
        return data.value.split(',').map((e: string) => e.trim()).filter(Boolean);
    }

    async getStorageConfig() {
        // Fetch all storage related keys
        const keys = [
            'storage_provider',
            'storage_enabled',
            'storage_path', // Local path
            'storage_bucket', // S3 Bucket or Azure Container
            'storage_region',
            'storage_access_key',
            'storage_secret_key',
            'storage_endpoint',
            'storage_connection_string'
        ];

        const { data } = await supabase
            .from('settings')
            .select('key, value')
            .in('key', keys);

        const config: Record<string, string> = {};
        data?.forEach(item => {
            config[item.key] = item.value;
        });

        return {
            enabled: config['storage_enabled'] === 'true',
            provider: config['storage_provider'] || 'local',
            localPath: config['storage_path'] || config['file_storage_path'] || '', // Fallback to old key
            bucket: config['storage_bucket'] || '',
            region: config['storage_region'] || '',
            accessKey: config['storage_access_key'] || '',
            secretKey: config['storage_secret_key'] || '',
            endpoint: config['storage_endpoint'] || '',
            connectionString: config['storage_connection_string'] || ''
        };
    }

    // Deprecated but kept for backward compatibility if needed, aliased to setStorageConfig logic
    async getFileStoragePath(): Promise<string | null> {
        const config = await this.getStorageConfig();
        return config.localPath || null;
    }


    // System Alerts
    async getSystemAlerts(activeOnly: boolean = false, targetAudience?: 'guest' | 'user'): Promise<SystemAlert[]> {
        let query = supabase
            .from('system_alerts')
            .select('*')
            .order('created_at', { ascending: false });

        if (activeOnly) {
            const now = new Date().toISOString();
            query = query
                .eq('is_active', true)
                .or(`start_date.is.null,start_date.lte.${now}`)
                .or(`end_date.is.null,end_date.gte.${now}`);

            if (targetAudience) {
                // Filter for 'all' OR specific audience
                query = query.in('audience', ['all', targetAudience]);
            }
        }

        const { data, error } = await query;
        if (error) {
            console.error("Error fetching system alerts:", error);
            return [];
        }
        return data as SystemAlert[];
    }

    async createSystemAlert(alert: Omit<SystemAlert, 'id' | 'created_at'>): Promise<SystemAlert | null> {
        const { data, error } = await supabase
            .from('system_alerts')
            .insert(alert)
            .select()
            .single();

        if (error) {
            console.error("Error creating system alert:", error);
            return null;
        }
        return data as SystemAlert;
    }

    async updateSystemAlert(id: string, updates: Partial<SystemAlert>): Promise<SystemAlert | null> {
        const { data, error } = await supabase
            .from('system_alerts')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating system alert:", error);
            return null;
        }
        return data as SystemAlert;
    }

    async deleteSystemAlert(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('system_alerts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting system alert:", error);
            return false;
        }
        return true;
    }

    async setMaintenanceMode(enabled: boolean): Promise<void> {
        const { error } = await supabase
            .from('settings')
            .upsert({
                key: 'maintenance_mode',
                value: String(enabled),
                updated_at: new Date().toISOString()
            });

        if (error) console.error("Error setting maintenance mode:", error);
    }

    async setAdminNotificationEmails(emails: string): Promise<void> {
        const { error } = await supabase
            .from('settings')
            .upsert({
                key: 'admin_notification_emails',
                value: emails,
                updated_at: new Date().toISOString()
            });

        if (error) console.error("Error setting admin notification emails:", error);
    }

    async setStorageConfig(config: {
        enabled: boolean,
        provider: string,
        localPath?: string,
        bucket?: string,
        region?: string,
        accessKey?: string,
        secretKey?: string,
        endpoint?: string,
        connectionString?: string
    }): Promise<void> {
        const updates = [
            { key: 'storage_enabled', value: String(config.enabled) },
            { key: 'storage_provider', value: config.provider },
            { key: 'storage_path', value: config.localPath },
            { key: 'storage_bucket', value: config.bucket },
            { key: 'storage_region', value: config.region },
            { key: 'storage_access_key', value: config.accessKey },
            { key: 'storage_secret_key', value: config.secretKey },
            { key: 'storage_endpoint', value: config.endpoint },
            { key: 'storage_connection_string', value: config.connectionString },
        ].filter(u => u.value !== undefined); // Only update defined values

        const { error } = await supabase
            .from('settings')
            .upsert(updates.map(u => ({
                key: u.key,
                value: u.value,
                updated_at: new Date().toISOString()
            })));

        if (error) console.error("Error setting storage config:", error);
    }

    async setFileStoragePath(path: string): Promise<void> {
        // Alias to new config
        return this.setStorageConfig({ enabled: !!path, provider: 'local', localPath: path });
    }
}

export const db = new SupabaseDB();

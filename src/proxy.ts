import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
// Note: We're using the anon key here, so we can only read public data or data allowed by RLS.
// For maintenance mode, the settings table should be readable by public (or we create a specific function)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function proxy(req: NextRequest) {
    // Check if we are already on the maintenance page to avoid loops
    if (req.nextUrl.pathname === '/maintenance') {
        const { data } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'maintenance_mode')
            .maybeSingle();

        const isMaintenanceMode = data?.value === 'true';

        // If maintenance is OFF, redirect back to home
        if (!isMaintenanceMode) {
            return NextResponse.redirect(new URL('/', req.url));
        }
        return NextResponse.next();
    }

    // Paths that should always be accessible even in maintenance mode
    const publicPaths = [
        '/maintenance',
        '/admin', // Admins need to be able to login and turn it off
        '/login',
        '/api/auth', // NextAuth routes
        '/_next', // Next.js assets
        '/favicon.ico',
        '/api/health' // Health checks
    ];

    if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Check maintenance mode status
    try {
        const { data } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'maintenance_mode')
            .maybeSingle();

        const isMaintenanceMode = data?.value === 'true';

        if (isMaintenanceMode) {
            return NextResponse.redirect(new URL('/maintenance', req.url));
        }
    } catch (e) {
        // Fallback to allowing traffic if DB fails
        console.error("Middleware DB check failed", e);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes, except auth)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

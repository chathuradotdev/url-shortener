import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { slug } = await request.json();

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Validate slug format (alphanumeric, hyphens, underscores only)
        const slugRegex = /^[a-z0-9_-]+$/i;
        if (!slugRegex.test(slug)) {
            return NextResponse.json({
                available: false,
                error: 'Invalid format. Use only letters, numbers, hyphens, and underscores.'
            }, { status: 400 });
        }

        // Check minimum length
        if (slug.length < 3) {
            return NextResponse.json({
                available: false,
                error: 'Slug must be at least 3 characters long.'
            }, { status: 400 });
        }

        // Check maximum length
        if (slug.length > 30) {
            return NextResponse.json({
                available: false,
                error: 'Slug must be 30 characters or less.'
            }, { status: 400 });
        }

        // Check if slug is already taken
        const { data, error } = await supabase
            .from('bio_pages')
            .select('slug')
            .eq('slug', slug.toLowerCase())
            .maybeSingle();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        const available = !data;

        return NextResponse.json({
            available,
            slug: slug.toLowerCase(),
            message: available
                ? `Great! "${slug}" is available!`
                : `Sorry, "${slug}" is already taken.`
        });

    } catch (error) {
        console.error('Error checking bio slug availability:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

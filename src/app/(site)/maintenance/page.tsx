import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Site Maintenance - URL Shortener',
    description: 'We will be back shortly.',
    robots: 'noindex, nofollow',
};

export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
                <h1 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                    We'll be back soon!
                </h1>
                <p className="mt-4 text-lg text-gray-500">
                    Sorry for the inconvenience but we're performing some scheduled maintenance at the moment. We'll be back online shortly!
                </p>
                <div className="mt-6">
                    <p className="text-sm text-gray-400">
                        &mdash; The URL Shortener Team
                    </p>
                </div>
            </div>
        </div>
    );
}

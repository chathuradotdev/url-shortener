import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import DomainManager from "@/components/DomainManager";
import Link from "next/link";

export default async function DomainsPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/login");
    }

    // @ts-ignore
    let userPlan = session.user?.plan || 'freemium';

    // @ts-ignore
    if (session?.user?.id) {
        try {
            // @ts-ignore
            const user = await db.findUserById(session.user.id);
            if (user) {
                userPlan = user.plan;
                // trial check
                if (userPlan === 'freemium' && user.trial_ends_at && new Date(user.trial_ends_at) > new Date()) {
                    userPlan = 'premium';
                }
            }
        } catch (e) { }
    }

    const isEnabled = await db.getBrandedDomainsEnabled();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Custom Domains</h1>
                        <p className="mt-2 text-gray-600">Connect your own domains to create branded short links.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        &larr; Back to Dashboard
                    </Link>
                </div>

                <DomainManager userPlan={userPlan} isEnabled={isEnabled} />
            </div>
        </div>
    );
}

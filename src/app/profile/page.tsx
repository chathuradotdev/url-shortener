import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import LoginHistory from "./LoginHistory";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session?.user?.id) {
        redirect("/login");
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        // @ts-ignore
        .eq("id", session.user.id)
        .single();

    if (error || !user) {
        console.error("Error fetching user profile:", error);
        // Handle error gracefully, maybe show a toast or redirect
        return <div className="p-8 text-center text-red-500">Error loading profile. Please try again later.</div>;
    }

    // Fetch login history
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: loginHistory } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', sixMonthsAgo.toISOString())
        .order('timestamp', { ascending: false });

    // Prepare initials for avatar fallback
    const initials = user.username
        ? user.username.slice(0, 2).toUpperCase()
        : user.email.slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow rounded-2xl overflow-hidden">
                    {/* Header / Cover */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
                        <div className="absolute -bottom-16 left-8">
                            <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-xl">
                                <AvatarImage src={user.image} alt={user.username} />
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-3xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    <div className="pt-20 pb-8 px-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {user.username}
                                    {user.plan === 'premium' && (
                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 border border-yellow-200">
                                            Premium
                                        </span>
                                    )}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                                <p>Member since</p>
                                <p className="font-medium text-gray-900 dark:text-gray-200">
                                    {new Date(user.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h2>
                            <ProfileForm user={user} />
                        </div>
                    </div>
                </div>

                {user.password_hash && (
                    <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-2xl p-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security</h2>
                        <PasswordForm />
                    </div>
                )}

                <LoginHistory loginHistory={loginHistory} />

                {/* Subscription Status Card - Simple for now */}
                <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-2xl p-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Subscription Plan</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 dark:text-gray-300">
                                Current Plan: <span className="font-bold capitalize text-gray-900 dark:text-white">{user.plan}</span>
                            </p>
                            {user.plan === 'freemium' && (
                                <p className="text-sm text-gray-500 mt-1">Upgrade to Premium to unlock unlimited links and analytics.</p>
                            )}
                        </div>
                        {user.plan === 'freemium' ? (
                            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105 shadow-md">
                                Upgrade Now
                            </button>
                        ) : (
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white underline text-sm">
                                Manage Subscription
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

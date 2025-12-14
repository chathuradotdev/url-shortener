"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
    user: any;
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const [username, setUsername] = useState(user.username || "");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            setMessage({ type: 'success', text: "Profile updated successfully!" });
            router.refresh();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500"
                />
                <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
            </div>

            {user.last_login && (
                <div className="space-y-2">
                    <Label htmlFor="last_login">Last Login</Label>
                    <Input
                        id="last_login"
                        value={new Date(user.last_login).toLocaleString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })}
                        disabled
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500"
                    />
                    <p className="text-xs text-muted-foreground">The last time you logged in.</p>
                </div>
            )}


            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    minLength={3}
                />
                <p className="text-xs text-muted-foreground">This is your public display name.</p>
            </div>

            {message && (
                <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={isLoading || username === user.username}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

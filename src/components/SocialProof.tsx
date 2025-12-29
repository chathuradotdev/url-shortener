import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const users = [
    {
        id: 1,
        name: "User 1",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&fit=crop&crop=faces",
    },
    {
        id: 2,
        name: "User 2",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&q=80&fit=crop&crop=faces",
    },
    {
        id: 3,
        name: "User 3",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&q=80&fit=crop&crop=faces",
    },
    {
        id: 4,
        name: "User 4",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&fit=crop&crop=faces",
    },
    {
        id: 5,
        name: "User 5",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&q=80&fit=crop&crop=faces",
    },
];

export default function SocialProof() {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            <div className="flex items-center -space-x-3">
                {users.map((user, i) => (
                    <Avatar
                        key={user.id}
                        className="border-2 border-white dark:border-gray-900 w-10 h-10 hover:transition-transform hover:-translate-y-1 duration-300"
                        style={{ zIndex: users.length - i }}
                    >
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            className="w-4 h-4 text-yellow-500 fill-current"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">
                    Trusted by <span className="font-bold text-gray-900 dark:text-white">20,000+</span> Marketers & Agencies
                </p>
            </div>
        </div>
    );
}

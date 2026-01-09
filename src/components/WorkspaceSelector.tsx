"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, User, ChevronDown, Check, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WorkspaceSelector() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const activeTeamId = searchParams.get("teamId") || "";

    useEffect(() => {
        if (session) {
            fetch("/api/teams")
                .then((res) => (res.ok ? res.json() : []))
                .then((data) => {
                    setTeams(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [session]);

    const handleSelectWorkspace = (teamId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (teamId) {
            params.set("teamId", teamId);
        } else {
            params.delete("teamId");
        }

        // Use router to push new URL
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    if (!session) return null;

    const activeTeam = teams.find((t) => t.id === activeTeamId);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors outline-none border border-transparent focus:border-blue-500">
                <div className="flex items-center gap-2">
                    {activeTeamId ? (
                        <Building2 className="w-4 h-4 text-blue-600" />
                    ) : (
                        <User className="w-4 h-4 text-purple-600" />
                    )}
                    <span className="text-sm font-semibold truncate max-w-[120px]">
                        {activeTeamId ? activeTeam?.name || "Team Workspace" : "Personal"}
                    </span>
                    {loading ? (
                        <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                    ) : (
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 py-1.5">
                    Switch Workspace
                </DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => handleSelectWorkspace("")}
                    className="flex items-center justify-between cursor-pointer rounded-md p-2"
                >
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">Personal</span>
                    </div>
                    {!activeTeamId && <Check className="w-4 h-4 text-blue-600" />}
                </DropdownMenuItem>

                {teams.length > 0 && <DropdownMenuSeparator className="my-1" />}

                {teams.map((team) => (
                    <DropdownMenuItem
                        key={team.id}
                        onClick={() => handleSelectWorkspace(team.id)}
                        className="flex items-center justify-between cursor-pointer rounded-md p-2"
                    >
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{team.name}</span>
                        </div>
                        {activeTeamId === team.id && <Check className="w-4 h-4 text-blue-600" />}
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                    onClick={() => router.push("/dashboard/teams")}
                    className="flex items-center gap-2 cursor-pointer rounded-md p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                    <Building2 className="w-4 h-4" />
                    <span className="font-semibold">Manage Teams</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

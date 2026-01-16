
"use client";

import { useEffect, useState } from "react";
import { BioLead } from "@/lib/db";
import { Mail, Loader2, Calendar, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface BioLeadsListProps {
    bioPageId: string;
}

export default function BioLeadsList({ bioPageId }: BioLeadsListProps) {
    const [leads, setLeads] = useState<BioLead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (bioPageId) fetchLeads();
    }, [bioPageId]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/bio/leads?pageId=${bioPageId}`);
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            } else {
                toast.error("Failed to fetch messages");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error loading messages");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-xs">Loading messages...</p>
            </div>
        );
    }

    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
                    <Mail className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">No messages yet</h3>
                <p className="text-xs max-w-[200px] text-center">Form submissions from your bio page will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 p-4">
            <h3 className="font-bold text-sm px-1">Inbox ({leads.length})</h3>
            <div className="space-y-3">
                {leads.map((lead) => (
                    <div key={lead.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
                                    <User className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-900 dark:text-white">{lead.name || 'Anonymous'}</div>
                                    <div className="text-[10px] text-gray-500">{lead.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                                <Calendar className="w-3 h-3" />
                                {new Date(lead.created_at).toLocaleDateString()}
                            </div>
                        </div>

                        {lead.message && (
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-xs text-gray-600 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-800/50">
                                {lead.message}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

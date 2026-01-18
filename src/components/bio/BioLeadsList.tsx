
"use client";

import { useEffect, useState } from "react";
import { BioLead } from "@/lib/db";
import { Mail, Loader2, Calendar, User, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BioLeadsListProps {
    bioPageId: string;
}

export default function BioLeadsList({ bioPageId }: BioLeadsListProps) {
    const [leads, setLeads] = useState<BioLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const deleteLead = async (id: string) => {
        const toastId = toast.loading("Deleting message...");
        try {
            const res = await fetch(`/api/bio/leads?leadId=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLeads(leads.filter(l => l.id !== id));
                toast.success("Message deleted");
            } else {
                toast.error("Failed to delete message");
            }
        } catch (e) {
            toast.error("Error occurred");
        } finally {
            toast.dismiss(toastId);
            setDeletingId(null);
        }
    };

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
                {leads.map((lead) => {
                    const isUnread = lead.status === 'unread';
                    return (
                        <div
                            key={lead.id}
                            className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-all border ${isUnread
                                ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-xs font-bold text-gray-900 dark:text-white">{lead.name || 'Anonymous'}</div>
                                            {isUnread && <span className="bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">NEW</span>}
                                        </div>
                                        <div className="text-[10px] text-gray-500">{lead.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(lead.created_at).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={() => setDeletingId(lead.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {lead.message && (
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-xs text-gray-600 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-800/50">
                                    {lead.message}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this message from your inbox.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletingId && deleteLead(deletingId)} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

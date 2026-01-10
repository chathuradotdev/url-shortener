"use client";

import { useState } from "react";
import { SystemAlert } from "@/lib/db"; // Ensure this import matches where interface is exported
import { createAlert, deleteAlert, toggleAlertStatus } from "./settings-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Plus, Bell, CalendarIcon, AlertTriangle, CheckCircle, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertsManagerProps {
    alerts: SystemAlert[];
}

export function AlertsManager({ alerts }: AlertsManagerProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">System Alerts</h2>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="w-4 h-4" /> Add Alert
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create System Alert</DialogTitle>
                            <DialogDescription>
                                Configure a new system-wide alert or announcement.
                            </DialogDescription>
                        </DialogHeader>
                        <form action={async (formData) => {
                            await createAlert(formData);
                            setIsCreateOpen(false);
                        }} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Input id="message" name="message" required placeholder="Enter alert message..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <select
                                        id="type"
                                        name="type"
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        defaultValue="info"
                                    >
                                        <option value="info">Info</option>
                                        <option value="warning">Warning</option>
                                        <option value="error">Error</option>
                                        <option value="success">Success</option>
                                        <option value="promo">Promo (Gradient)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="audience">Audience</Label>
                                    <select
                                        id="audience"
                                        name="audience"
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        defaultValue="all"
                                    >
                                        <option value="all">All Users</option>
                                        <option value="guest">Guests Only</option>
                                        <option value="user">Registered Only</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2 flex items-center gap-2">
                                <input type="checkbox" id="is_active" name="is_active" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                                <Label htmlFor="is_active" className="pb-0 mb-0 cursor-pointer">Active Immediately</Label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date (Optional)</Label>
                                    <Input id="start_date" name="start_date" type="datetime-local" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date (Optional)</Label>
                                    <Input id="end_date" name="end_date" type="datetime-local" />
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h4 className="text-sm font-medium mb-3">Action Button (Optional)</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="action_label">Button Label</Label>
                                        <Input id="action_label" name="action_label" placeholder="e.g. Learn More" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="action_url">Button URL</Label>
                                        <Input id="action_url" name="action_url" placeholder="e.g. /pricing" />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit">Create Alert</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="divide-y divide-gray-200 user-select-none">
                {alerts.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">No alerts configured.</div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert.id} className="p-6 flex items-start justify-between group hover:bg-gray-50 transition-colors">
                            <div className="flex gap-4">
                                <div className={cn(
                                    "p-2 rounded-full h-fit flex-shrink-0",
                                    alert.type === 'promo' ? "bg-purple-100 text-purple-600" :
                                        alert.type === 'warning' ? "bg-yellow-100 text-yellow-600" :
                                            alert.type === 'error' ? "bg-red-100 text-red-600" :
                                                alert.type === 'success' ? "bg-green-100 text-green-600" :
                                                    "bg-blue-100 text-blue-600"
                                )}>
                                    {alert.type === 'promo' && <Sparkles className="w-5 h-5" />}
                                    {alert.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                                    {alert.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                                    {alert.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                    {alert.type === 'info' && <Info className="w-5 h-5" />}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 flex items-center gap-2 flex-wrap">
                                        <span className={cn(!alert.is_active && "text-gray-400 line-through")}>{alert.message}</span>
                                        {!alert.is_active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>}
                                        {alert.type === 'promo' && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">PROMO</span>}
                                        {alert.audience && alert.audience !== 'all' && (
                                            <span className="text-xs border border-blue-200 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full uppercase font-semibold text-[10px] tracking-wide">
                                                {alert.audience} ONLY
                                            </span>
                                        )}
                                        {alert.action_label && alert.action_url && (
                                            <span className="text-xs border border-gray-200 px-2 py-0.5 rounded-md text-gray-600 flex items-center gap-1">
                                                config: [{alert.action_label}] &rarr; {alert.action_url}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                                        {(alert.start_date || alert.end_date) ? (
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon className="w-3 h-3" />
                                                {alert.start_date ? new Date(alert.start_date).toLocaleDateString() : 'Now'}
                                                {' - '}
                                                {alert.end_date ? new Date(alert.end_date).toLocaleDateString() : 'Forever'}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">Always active when enabled</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <form action={toggleAlertStatus.bind(null, alert.id, alert.is_active)}>
                                    <Button variant="ghost" size="sm" className={cn("text-gray-500", alert.is_active ? "hover:text-amber-600" : "hover:text-green-600")}>
                                        {alert.is_active ? "Disable" : "Enable"}
                                    </Button>
                                </form>
                                <form action={deleteAlert.bind(null, alert.id)}>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

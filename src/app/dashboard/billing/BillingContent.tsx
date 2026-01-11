"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Calendar,
    Download,
    CheckCircle2,
    Clock,
    ExternalLink,
    ShieldCheck,
    History,
    ChevronRight,
    ArrowUpRight,
    MapPin,
    AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getBillingData } from './actions';
import { toast } from 'sonner';

export default function BillingContent() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ user: any, history: any[] } | null>(null);

    useEffect(() => {
        async function fetchBilling() {
            try {
                const billingData = await getBillingData();
                setData(billingData);
            } catch (error) {
                toast.error("Failed to load billing information");
            } finally {
                setLoading(false);
            }
        }
        fetchBilling();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col gap-6 animate-pulse">
                <div className="h-48 bg-gray-100 rounded-2xl" />
                <div className="h-96 bg-gray-100 rounded-2xl" />
            </div>
        );
    }

    if (!data?.user) return <div>No user data found</div>;

    const { user, history } = data;
    const isPremium = user.plan === 'premium';
    const isTrial = isPremium && !user.subscription_id;

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Billing & Subscription</h1>
                <p className="text-gray-500 mt-2">Manage your plan, payment methods, and view your billing history.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Plan Card */}
                <Card className="lg:col-span-2 overflow-hidden border-2 border-blue-50 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl font-bold">Current Plan: {isPremium ? 'Pro' : 'Free'}</CardTitle>
                                <CardDescription className="text-blue-100 mt-1">
                                    {isTrial ? 'You are currently on a 7-day free trial' : isPremium ? 'Premium monthly subscription' : 'Basic individual account'}
                                </CardDescription>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status</p>
                                        <Badge variant={user.subscription_status === 'active' ? 'default' : 'secondary'} className="mt-1">
                                            {user.subscription_status || (isTrial ? 'Trial Active' : 'Free')}
                                        </Badge>
                                    </div>
                                </div>

                                {isPremium && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Clock className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                {user.subscription_ends_at ? 'Terminates On' : 'Next Renewal'}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.subscription_renews_at || user.subscription_ends_at || user.trial_ends_at
                                                    ? format(new Date(user.subscription_renews_at || user.subscription_ends_at || user.trial_ends_at), 'MMM dd, yyyy')
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Payment Method</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-medium text-gray-900">
                                                {user.card_brand ? `${user.card_brand} •••• ${user.card_last_four}` : 'None'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 rounded-lg">
                                        <MapPin className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Billing Region</p>
                                        <p className="text-sm font-medium text-gray-900">{user.billing_country || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4 flex justify-end gap-3 border-t">
                        {!isPremium && <Button className="bg-blue-600 hover:bg-blue-700">Upgrade to Pro</Button>}
                        {isPremium && <Button variant="outline">Manage Subscription</Button>}
                    </CardFooter>
                </Card>

                {/* Quick Stats/Alert Card */}
                <Card className="border-2 border-gray-50 shadow-sm flex flex-col justify-center p-6 bg-gradient-to-br from-white to-gray-50">
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Lifetime Spend</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                                {user.subscription_currency || '$'} {((history.reduce((acc, curr) => acc + (curr.amount || 0), 0)) / 100).toFixed(2)}
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                Premium Features
                            </p>
                            <ul className="text-xs text-gray-600 space-y-2 pl-6">
                                <li>• Unlimited Short Links</li>
                                <li>• Custom Branded Domains</li>
                                <li>• Advanced Geo-Targeting</li>
                                <li>• Priority Support</li>
                            </ul>
                        </div>

                        <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 group">
                            Contact Support <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Billing History Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 rounded-xl">
                            <History className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Billing History</h2>
                    </div>
                    <Badge variant="outline" className="text-gray-500 font-medium px-3 py-1">
                        {history.length} {history.length === 1 ? 'Transaction' : 'Transactions'}
                    </Badge>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50">
                                <TableHead className="w-[150px]">Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Invoice</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center text-gray-400 italic">
                                        No billing history found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                history.map((record, index) => (
                                    <TableRow key={record.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="font-medium text-gray-700">
                                            {format(new Date(record.created_at), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900">
                                                    {record.event_name === 'subscription_created' ? 'Initial Subscription' : 'Monthly Renewal'}
                                                </span>
                                                <span className="text-xs text-gray-500 font-mono">{record.subscription_id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-gray-900 text-lg">
                                            {record.currency} {(record.amount / 100).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={record.status === 'active' || record.status === 'paid' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none' : 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-none'}>
                                                {record.status === 'active' || record.status === 'paid' ? 'Paid' : record.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[10px] font-extrabold uppercase overflow-hidden border">
                                                    {record.card_brand || 'LS'}
                                                </div>
                                                <span className="text-sm">•• {record.card_last_four || '0000'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                <Download className="w-4 h-4 mr-2" /> PDF
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Promo / Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl border border-blue-200 flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <ArrowUpRight className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-indigo-900">Need a specialized plan?</h4>
                        <p className="text-sm text-indigo-700 mt-1">For enterprises and large teams, we offer custom packages with dedicated support and volume discounts.</p>
                        <Button variant="link" className="p-0 h-auto text-indigo-600 font-bold mt-2 hover:no-underline">Talk to Sales</Button>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-gray-100 flex items-start gap-4 shadow-sm">
                    <div className="p-3 bg-amber-50 rounded-xl">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">Security & Compliance</h4>
                        <p className="text-sm text-gray-600 mt-1">We take your payment security seriously. All transactions are processed via bank-level AES-256 encryption.</p>
                        <Button variant="link" className="p-0 h-auto text-amber-600 font-bold mt-2 hover:no-underline">Security Policy</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

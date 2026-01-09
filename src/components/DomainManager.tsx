'use client';

import { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CustomDomain {
    id: string;
    domain: string;
    verified: boolean;
    created_at: string;
    team_id?: string | null;
}

export default function DomainManager({ userPlan, isEnabled }: { userPlan: string, isEnabled: boolean }) {
    const [domains, setDomains] = useState<CustomDomain[]>([]);
    const [newDomain, setNewDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');
    const [host, setHost] = useState('your-app-domain.com');
    const [userTeams, setUserTeams] = useState<any[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState("");

    useEffect(() => {
        setHost(window.location.host);
    }, []);

    useEffect(() => {
        if (userPlan === 'premium' && isEnabled) {
            fetchDomains();
            fetchTeams();
        }
    }, [userPlan, isEnabled]);

    const fetchTeams = async () => {
        try {
            const res = await fetch('/api/teams');
            if (res.ok) {
                const data = await res.json();
                setUserTeams(data);
            }
        } catch (e) {
            console.error("Failed to fetch teams", e);
        }
    };

    const fetchDomains = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/domains');
            if (res.ok) {
                const data = await res.json();
                setDomains(data);
            }
        } catch (e) {
            console.error("Failed to fetch domains", e);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setAdding(true);

        try {
            const res = await fetch('/api/domains', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    domain: newDomain,
                    teamId: selectedTeamId || null
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to add domain");
            } else {
                setDomains([data, ...domains]);
                setNewDomain('');
            }
        } catch (e) {
            setError("Something went wrong");
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        // Confirmation is now handled by the AlertDialog UI


        try {
            const res = await fetch(`/api/domains/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDomains(domains.filter(d => d.id !== id));
            }
        } catch (e) {
            alert("Failed to delete domain");
        }
    };

    const handleVerify = async (id: string) => {
        try {
            const res = await fetch(`/api/domains/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verify' })
            });
            const data = await res.json();
            if (res.ok) {
                // Update local state
                setDomains(domains.map(d => d.id === id ? { ...d, verified: true, status: 'active' } : d));
                alert("Domain verified successfully!");
            } else {
                alert(data.message || "Verification failed");
            }
        } catch (e) {
            alert("Verification failed");
        }
    };

    if (!isEnabled) {
        return (
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 text-center">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">Feature Disabled</h3>
                <p className="text-yellow-700">Custom branded domains are currently disabled by the system administrator.</p>
            </div>
        );
    }

    if (userPlan !== 'premium') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Branded Domains</h3>
                <p className="text-gray-600 mb-4">Upgrade to Premium to connect your own domain (e.g. links.myband.com).</p>
                <button disabled className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed">
                    Upgrade Logic Here
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-black">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add Custom Domain</h2>

                {userTeams.length > 0 && (
                    <div className="mb-4 flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm animate-in fade-in slide-in-from-left-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Workspace:
                        </div>
                        <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-blue-600 cursor-pointer p-0 pr-8"
                        >
                            <option value="">Personal</option>
                            {userTeams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <form onSubmit={handleAdd} className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="domain" className="sr-only">Domain</label>
                        <input
                            type="text"
                            id="domain"
                            placeholder="e.g. link.mybrand.com"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={adding}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg disabled:opacity-50 transition-colors"
                    >
                        {adding ? 'Adding...' : 'Add Domain'}
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-800 mb-2">DNS Configuration</h4>
                    <p className="text-sm text-blue-700 mb-2">
                        To verify your domain, add a <strong>CNAME</strong> record in your DNS provider:
                    </p>
                    <div className="bg-white p-3 rounded border border-blue-200 font-mono text-sm text-gray-700">
                        Type: CNAME<br />
                        Name: {newDomain.split('.')[0] || "subdomain"} (e.g. 'link')<br />
                        Value: {host}
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Domains</h3>

                {loading && <p className="text-gray-500">Loading domains...</p>}

                {!loading && domains.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No custom domains added yet.</p>
                )}

                <div className="space-y-4">
                    {domains.map(domain => (
                        <div key={domain.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <h4 className="font-semibold text-gray-900">{domain.domain}</h4>
                                <div className="flex items-center mt-1 space-x-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${domain.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {domain.verified ? 'Verified' : 'Pending Verification'}
                                    </span>
                                    {domain.team_id && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            Team Owned
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-400">Added on {new Date(domain.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-3 sm:mt-0">
                                {!domain.verified && (
                                    <button
                                        onClick={() => handleVerify(domain.id)}
                                        className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Check DNS
                                    </button>
                                )}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                All the created domains will be deleted with this process and process cannot be undone. URLs created with this domain will be disabled.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(domain.id)} className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white">
                                                Delete Domain
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

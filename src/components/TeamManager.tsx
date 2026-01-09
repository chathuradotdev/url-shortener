"use client";

import { useState, useEffect } from "react";
import { Team, TeamMember } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Users, UserPlus, Shield, XCircle, Loader2, Building2 } from "lucide-react";

export default function TeamManager() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchingMembers, setFetchingMembers] = useState(false);

    // Form states
    const [newTeamName, setNewTeamName] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("member");
    const [creatingTeam, setCreatingTeam] = useState(false);
    const [invitingMember, setInvitingMember] = useState(false);

    useEffect(() => {
        fetchTeams();
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            fetchMembers(selectedTeam.id);
        }
    }, [selectedTeam]);

    const fetchTeams = async () => {
        try {
            const res = await fetch("/api/teams");
            if (res.ok) {
                const data = await res.json();
                setTeams(data);
                if (data.length > 0 && !selectedTeam) {
                    setSelectedTeam(data[0]);
                }
            }
        } catch (error) {
            toast.error("Failed to fetch teams");
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async (teamId: string) => {
        setFetchingMembers(true);
        try {
            const res = await fetch(`/api/teams/${teamId}/members`);
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
        } catch (error) {
            toast.error("Failed to fetch members");
        } finally {
            setFetchingMembers(false);
        }
    };

    const handleCreateTeam = async () => {
        if (!newTeamName.trim()) return;
        setCreatingTeam(true);
        try {
            const res = await fetch("/api/teams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newTeamName })
            });
            if (res.ok) {
                const team = await res.json();
                setTeams([team, ...teams]);
                setSelectedTeam(team);
                setNewTeamName("");
                toast.success("Team created successfully!");
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to create team");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setCreatingTeam(false);
        }
    };

    const handleInviteMember = async () => {
        if (!selectedTeam || !inviteEmail.trim()) return;
        setInvitingMember(true);
        try {
            const res = await fetch(`/api/teams/${selectedTeam.id}/members`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            });
            if (res.ok) {
                toast.success("Member added!");
                fetchMembers(selectedTeam.id);
                setInviteEmail("");
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to add member. Make sure the user exists.");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setInvitingMember(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!selectedTeam) return;
        if (!confirm("Are you sure you want to remove this member?")) return;

        try {
            const res = await fetch(`/api/teams/${selectedTeam.id}/members/${userId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setMembers(members.filter(m => m.user_id !== userId));
                toast.success("Member removed");
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to remove member");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Team Selector & Create Team */}
                <Card className="lg:col-span-1 shadow-md border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            Your Teams
                        </CardTitle>
                        <CardDescription>Select a team to manage or create a new one.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            {teams.map((team) => (
                                <button
                                    key={team.id}
                                    onClick={() => setSelectedTeam(team)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${selectedTeam?.id === team.id
                                            ? "bg-blue-600 text-white shadow-lg active"
                                            : "bg-white hover:bg-blue-50 text-gray-700 border border-gray-100 hover:border-blue-200"
                                        }`}
                                >
                                    <span className="font-semibold truncate">{team.name}</span>
                                    {selectedTeam?.id === team.id && <Shield className="w-4 h-4" />}
                                </button>
                            ))}
                            {teams.length === 0 && (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    No teams yet.
                                </div>
                            )}
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl py-6 font-bold shadow-md transform hover:-translate-y-0.5 transition-all">
                                    <PlusCircle className="mr-2 h-5 w-5" />
                                    New Team
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Team</DialogTitle>
                                    <DialogDescription>
                                        Create a workspace to collaborate with your partners or team members.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Team Name
                                    </label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Marketing Dept"
                                        value={newTeamName}
                                        onChange={(e) => setNewTeamName(e.target.value)}
                                        className="rounded-lg"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateTeam} disabled={creatingTeam || !newTeamName.trim()} className="rounded-lg px-8">
                                        {creatingTeam ? "Creating..." : "Create Team"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                {/* Team Members Management */}
                <Card className="lg:col-span-2 shadow-md border-gray-200">
                    {selectedTeam ? (
                        <>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                        <Users className="w-6 h-6 text-indigo-600" />
                                        {selectedTeam.name}
                                    </CardTitle>
                                    <CardDescription>Manage members and roles in this team.</CardDescription>
                                </div>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="rounded-xl border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                                            <UserPlus className="mr-2 h-4 w-4 text-indigo-600" />
                                            Add Member
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Add Team Member</DialogTitle>
                                            <DialogDescription>
                                                Send an invitation to join your team. Note: Users must have an existing account.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">User Email</label>
                                                <Input
                                                    placeholder="colleague@company.com"
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Role</label>
                                                <Select value={inviteRole} onValueChange={setInviteRole}>
                                                    <SelectTrigger className="rounded-lg">
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="member">Member (Can create/edit)</SelectItem>
                                                        <SelectItem value="admin">Admin (Can manage members)</SelectItem>
                                                        <SelectItem value="viewer">Viewer (Read-only)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleInviteMember} disabled={invitingMember || !inviteEmail.trim()} className="bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                                                {invitingMember ? "Adding..." : "Add to Team"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Joined</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="bg-white">
                                            {fetchingMembers ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-10">
                                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : members.map((member) => (
                                                <TableRow key={member.id} className="hover:bg-gray-50 transition-colors group">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                                {member.user?.username?.charAt(0).toUpperCase() || "U"}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-900">{member.user?.username || "Unknown"}</div>
                                                                <div className="text-xs text-gray-500">{member.user?.email}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.role === 'owner' ? "bg-purple-100 text-purple-700" :
                                                                member.role === 'admin' ? "bg-blue-100 text-blue-700" :
                                                                    "bg-gray-100 text-gray-600"
                                                            }`}>
                                                            {member.role}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-500">
                                                        {new Date(member.joined_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {member.role !== 'owner' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemoveMember(member.user_id)}
                                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg group-hover:opacity-100"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No Team Selected</h3>
                            <p className="text-gray-500 max-w-xs">Select or create a team to start collaborating on your branded links.</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Info Section */}
            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 text-indigo-900">
                <div className="flex gap-4">
                    <Shield className="w-6 h-6 text-indigo-600 shrink-0" />
                    <div>
                        <h4 className="font-bold mb-1">Collaboration Basics</h4>
                        <p className="text-sm text-indigo-800 leading-relaxed">
                            Teams allow multiple users to manage the same set of links and custom domains.
                            Owners can manage everyone, Admins can add/remove members, and Viewers can only see analytics.
                            Coming soon: Shared workspaces to organize your team links separately from your personal ones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
function PlusCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
        </svg>
    )
}

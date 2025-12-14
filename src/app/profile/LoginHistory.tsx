"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface LoginRecord {
    id: string;
    timestamp: string;
    ip?: string;
    user_agent?: string;
}

interface LoginHistoryProps {
    loginHistory: LoginRecord[];
}

export default function LoginHistory({ loginHistory }: LoginHistoryProps) {
    if (!loginHistory || loginHistory.length === 0) {
        return null;
    }

    return (
        <Card className="mt-8 bg-white dark:bg-gray-800 shadow rounded-2xl border-none">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Login History</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recent login activity from the last 6 months.
                </p>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead className="hidden md:table-cell">Browser / OS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loginHistory.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">
                                        {new Date(record.timestamp).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(record.timestamp).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell>
                                        {record.ip || "Unknown"}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-[200px]" title={record.user_agent}>
                                        {record.user_agent || "Unknown"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

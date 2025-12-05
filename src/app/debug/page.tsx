import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { headers, cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    const session = await getServerSession(authOptions);
    const headersList = headers();
    const cookieStore = cookies();

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Debug Info</h1>

            <div className="border p-4 rounded bg-gray-50">
                <h2 className="font-bold mb-2">Server Session</h2>
                <pre className="whitespace-pre-wrap">
                    {JSON.stringify(session, null, 2)}
                </pre>
            </div>

            <div className="border p-4 rounded bg-gray-50">
                <h2 className="font-bold mb-2">Cookies</h2>
                <pre className="whitespace-pre-wrap">
                    {cookieStore.getAll().map(c => `${c.name}: ${c.value.substring(0, 20)}...`).join('\n')}
                </pre>
            </div>

            <div className="border p-4 rounded bg-gray-50">
                <h2 className="font-bold mb-2">Environment</h2>
                <pre>
                    NEXTAUTH_URL: {process.env.NEXTAUTH_URL}
                    NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? "Set" : "Not Set"}
                </pre>
            </div>
        </div>
    );
}

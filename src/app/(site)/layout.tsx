import SystemAlertBanner from "@/components/SystemAlertBanner";
import ProUpgradeBanner from "@/components/ProUpgradeBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const audience = session?.user ? 'user' : 'guest';
    const alerts = await db.getSystemAlerts(true, audience);
    const chatWidgetEnabled = await db.getChatWidgetEnabled();

    return (
        <div className="flex flex-col min-h-screen">
            <SystemAlertBanner alerts={alerts} />
            <ProUpgradeBanner />
            <Navbar />
            <div className="flex-grow">
                {children}
            </div>
            <Footer />
            {chatWidgetEnabled && <ChatWidget />}
        </div>
    );
}

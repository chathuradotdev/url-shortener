
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GuestLinkClaimer() {
    const router = useRouter();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;

        const claimLinks = async () => {
            const guestLinks = JSON.parse(localStorage.getItem('guest_links') || '[]');

            if (guestLinks.length > 0) {
                processedRef.current = true; // Mark as processed to prevent double firing in strict mode

                try {
                    const res = await fetch('/api/urls/claim', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ shortCodes: guestLinks })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.count > 0) {
                            toast.success(`Successfully added ${data.count} guest links to your account!`);
                            router.refresh(); // Refresh to show new links
                        }
                    } else {
                        console.error("Failed to claim links:", await res.text());
                    }
                } catch (error) {
                    console.error("Failed to claim guest links", error);
                } finally {
                    // Always clear to prevent infinite loops or retries on bad data
                    localStorage.removeItem('guest_links');
                }
            }
        };

        claimLinks();
    }, [router]);

    return null;
}

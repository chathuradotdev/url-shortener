"use client";

import { useEffect, useState } from "react";
import { BioLinkClaimModal } from "@/components/BioLinkClaimModal";

export function BioClaimCheck() {
    const [savedClaim, setSavedClaim] = useState<{ slug: string } | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('pending_bio_claim');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.slug) {
                        setSavedClaim({ slug: parsed.slug });
                    }
                } catch (e) {
                    localStorage.removeItem('pending_bio_claim');
                }
            }
        }
    }, []);

    if (!savedClaim) return null;

    return (
        <BioLinkClaimModal
            defaultSlug={savedClaim.slug}
            // For forced/blocking modals, we still need onClose for internal state, 
            // but the modal itself will hide the close button based on 'forced'.
            onClose={() => {
                // Even if forced, we might need a way out if we ever let them cancel (e.g. explicitly),
                // or if the payment succeeds and redirects.
                // For now, let's keep the logic but the UI won't trigger it easily.
                setSavedClaim(null);
                localStorage.removeItem('pending_bio_claim');
            }}
            forced={true}
        />
    );
}

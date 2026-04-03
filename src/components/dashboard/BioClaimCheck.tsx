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
            onClose={() => {
                setSavedClaim(null);
                localStorage.removeItem('pending_bio_claim');
            }}
            forced={false}
        />
    );
}

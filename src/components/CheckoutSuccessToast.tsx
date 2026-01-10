
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CheckoutSuccessToast() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hasShownRef = useRef(false);

    useEffect(() => {
        if (hasShownRef.current) return;

        if (searchParams.get("checkout") === "success") {
            hasShownRef.current = true;
            toast.success("Upgrade successful! Welcome to Premium features.");

            // Remove the query param cleanly
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("checkout");
            router.replace(`/dashboard?${newParams.toString()}`);
            router.refresh(); // Refresh server data to reflect new plan status
        }
    }, [searchParams, router]);

    return null;
}

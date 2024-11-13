"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

function ErrorPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const error = searchParams.get("error");

    useEffect(() => {
        if (error) {
            if (error === "OnlyChristUniversity") {
                toast.error("Only christuniversity.in domains are allowed");
            } else {
                toast.error("Authentication failed");
            }

            // Redirect back to the login page after displaying the message
            router.push("/login");
        }
    }, [error, router]);

    return null; // This page doesn't need to render anything
}

export default function ErrorPage() {
    return (
        <Suspense fallback={null}>
            <ErrorPageContent />
        </Suspense>
    );
}

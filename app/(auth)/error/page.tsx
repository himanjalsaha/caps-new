"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ErrorPage() {
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
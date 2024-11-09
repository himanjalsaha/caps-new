import { signIn } from "next-auth/react";
import { toast } from "sonner";

export const handleGoogleAuth = async () => {
    try {
        const result = await signIn('google', { callbackUrl: '/home' });
        if (result?.error) {
            if (result.error === 'OnlyChristUniversity') {
                toast.error('Only christuniversity.in domains are allowed');
            } else {
                toast.error('Authentication failed');
            }
            return;
        }
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        toast.error(`An unexpected error occurred: ${error}`);
    }
};
"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { handleGoogleAuth } from "@/lib/googleAuthHandler";
import { signIn } from "next-auth/react";

export function LoginFormDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const promise = signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      toast.promise(promise, {
        loading: "Logging in...",
        success: "Logged in successfully!",
        error: "Invalid email or password"
      });

      const result = await promise;

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully!");
        router.push("/home"); // Redirect to home page after successful login
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await handleGoogleAuth();
  };

  return ( 
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Log In
        </h2>
        <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-300">
          Welcome back! Please log in to your account
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" placeholder="youremail@example.com" type="email" required />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" placeholder="••••••••" type="password" required />
          </LabelInputContainer>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md mt-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center text-neutral-800 dark:text-neutral-200 py-2 rounded-md mb-4 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Sign in with Google
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:text-blue-700"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
"use client";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export function LoginFormDemo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return ( 
    <div className=" flex justify-center  items-center h-screen">
         <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Log In
      </h2>
      <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-300">
        Welcome back! Please log in to your account
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* Email Field */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="youremail@example.com" type="email" />
        </LabelInputContainer>

        {/* Password Field */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        {/* Submit Button */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md mt-4 font-medium"
          type="submit"
        >
          Log In
        </button>
      </form>

      {/* Sign Up Link */}
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

"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { signIn } from "next-auth/react";

const campusOptions = [
  { value: "Bangalore Central Campus", label: "Bangalore Central Campus" },
  { value: "Bangalore Bannerghatta Road Campus", label: "Bangalore Bannerghatta Road Campus" },
  { value: "Bangalore Kengeri Campus", label: "Bangalore Kengeri Campus" },
  { value: "Pune Lavasa Campus", label: "Pune Lavasa Campus" },
  { value: "Delhi NCR Campus", label: "Delhi NCR Campus" },
];

const departmentOptions = [
  { value: "School of Sciences", label: "School of Sciences" },
  { value: "School of Management", label: "School of Management" },
  { value: "School of Commerce", label: "School of Commerce" },
  { value: "School of Law", label: "School of Law" },
  { value: "School of Humanities and Social Sciences", label: "School of Humanities and Social Sciences" },
  { value: "School of Engineering and Technology", label: "School of Engineering and Technology" },
  { value: "School of Business and Entrepreneurship", label: "School of Business and Entrepreneurship" },
  { value: "School of Education", label: "School of Education" },
  { value: "School of Architecture", label: "School of Architecture" },
  { value: "School of Arts and Humanities", label: "School of Arts and Humanities" },
  { value: "School of Social Sciences", label: "School of Social Sciences" },
  { value: "School of Data Science and Analytics", label: "School of Data Science and Analytics" },
  { value: "School of Finance and Business", label: "School of Finance and Business" },
  { value: "School of Hotel Management", label: "School of Hotel Management" },
  { value: "School of Media Studies", label: "School of Media Studies" },
  { value: "School of Performing Arts", label: "School of Performing Arts" },
];

const courseOptions = [
  { value: "Bachelor of Arts", label: "Bachelor of Arts" },
  { value: "BBA", label: "Bachelor of Business Administration" },
  { value: "Bachelor of Commerce", label: "Bachelor of Commerce" },
  { value: "Bachelor of Science", label: "Bachelor of Science" },
  { value: "BCA", label: "Bachelor of Computer Applications" },
  { value: "Bachelor of Law (LLB)", label: "Bachelor of Law (LLB)" },
  { value: "Bachelor of Psychology", label: "Bachelor of Psychology" },
  { value: "Master of Science", label: "Master of Science" },
  { value: "Master of Arts", label: "Master of Arts" },
  { value: "MBA", label: "Master of Business Administration" },
  { value: "Master of Law (LLM)", label: "Master of Law (LLM)" },
  { value: "PhD", label: "PhD" },
];

const semesterOptions = [
  { value: "Semester 1", label: "Semester 1" },
  { value: "Semester 2", label: "Semester 2" },
  { value: "Semester 3", label: "Semester 3" },
  { value: "Semester 4", label: "Semester 4" },
  { value: "Semester 5", label: "Semester 5" },
  { value: "Semester 6", label: "Semester 6" },
  { value: "Semester 7", label: "Semester 7" },
  { value: "Semester 8", label: "Semester 8" },
];

export function SignupFormDemo() {

  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      department: formData.get("department"),
      semester: formData.get("semester"),
      campus: formData.get("campus"),
      course: formData.get("course")
    };

    try {
      console.log(data);
      const response = await axios.post("/api/signup", data);
      

      if (response.status === 201) {
        const result = await signIn("credentials", {
          callbackUrl: "/home",
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (!result?.error) {
          toast.success("Account created successfully!");
          router.push("/home");
        } else {
          toast.error("Login failed after signup.");
        }
      }
    } catch (error: any) {
      if (error.response) {
        // Handle specific error messages from the backend
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);

        // Handle validation errors if they exist
        if (error.response.data.errors) {
          error.response.data.errors.forEach((err: { message: string }) => {
            toast.error(err.message);
          });
        }
      } else {
        toast.error("An unexpected error occurred during signup");
      }
      setError(error.response?.data?.message || "An unexpected error occurred");
    } finally {
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Sign Up
      </h2>
      <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-300">
        Create a new account to get started
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* Email Field */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" placeholder="youremail@example.com" type="email" />
        </LabelInputContainer>

        {/* Password Field */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        {/* Department Field (Select) */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="department" >Department</Label>
          <select
            id="department"
            name="department"
            aria-label="Select department"
            className="border rounded px-2 py-2 bg-[#27272A] text-gray-200 dark:text-white"
          >
            {departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </LabelInputContainer>

        {/* Semester Field (Select) */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="semester">Semester</Label>
          <select
            id="semester"
            name="semester"
            aria-label="Select semester"
            className="border rounded px-2 py-2 bg-[#27272A] text-gray-200 dark:text-white"
          >
            {semesterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </LabelInputContainer>

        {/* Campus Field (Select) */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="campus">Campus</Label>
          <select
            id="campus"
            name="campus"
            aria-label="Select campus"
            className="border rounded px-2 py-2 bg-[#27272A] text-gray-200 dark:text-white"
          >
            {campusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </LabelInputContainer>

        {/* Course Field (Select) */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="course">Course</Label>
          <select
            id="course"
            name="course"
            aria-label="Select course"
            className="border rounded px-2 py-2 bg-[#27272A] text-gray-200 dark:text-white"
          >
            {courseOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </LabelInputContainer>

        {/* Submit Button */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md mt-4 font-medium"
          type="submit"
        >
          Sign Up
        </button>
      </form>
      <Toaster />

      {/* Log In Link */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700"
          >
            Log In
          </a>
        </p>
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

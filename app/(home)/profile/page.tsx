"use client";
import { useSession } from "next-auth/react";

function UserProfile() {
    const { data: session } = useSession();

    if (!session) {
        return <p className="text-center text-gray-400 mt-10">You are not logged in.</p>;
    }

    return (
        <div className="min-h-screen pt-20 bg-[#18191A] text-gray-100 flex items-center justify-center">
            <div className="bg-[#242526] p-8 rounded-lg shadow-lg max-w-sm w-full">
                <div className="flex flex-col items-center">
                    {/* Profile Image */}
                    {session.user.image && (
                        <img
                            src={session.user.image}
                            alt={session.user.name}
                            className="w-24 h-24 rounded-full mb-4 border-4 border-[#3A3B3C]"
                        />
                    )}
                    
                    {/* User Name */}
                    <h1 className="text-2xl font-semibold text-white mb-2">
                        {session.user.name || "User"}
                    </h1>
                    
                    {/* User Email */}
                    <p className="text-gray-400 mb-4">{session.user.email}</p>

                    {/* Additional User Info */}
                    <div className="mt-4 text-sm space-y-2 text-gray-300">
                        <p>User ID: {session.user.id || "N/A"}</p>
                        <p>Role: {session.user.email || "User"}</p>
                        <p>Department: {session.user.department || "Not specified"}</p>
                        <p>Campus: {session.user.campus || "Not specified"}</p>
                        <p>Course: {session.user.course || "Not specified"}</p>
                        <p>Semester: {session.user.semester || "Not specified"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
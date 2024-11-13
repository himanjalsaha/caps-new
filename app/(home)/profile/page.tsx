'use client'

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { Post } from "@/types/next-auth"
import FeedItem from "@/app/components/common/Feeditem"
import { useAuth } from "@/app/contexts/AuthContext"


export default function UserProfile() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()


  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      const data = await response.json()
      setPosts(data.posts || [])
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#18191A]">
        <div className="bg-[#242526] p-8 rounded-lg shadow-md">
          <p className="text-center text-gray-400">You are not logged in.</p>
        </div>
      </div>
    )
  }

  const filteredPosts = posts.filter((post) => post.userId === session?.user.id)

  

  return (
    <div className="min-h-screen bg-[#18191A] text-gray-100">
      <div className="max-w-3xl mx-auto pt-20 px-4">
        <div className="bg-[#242526] rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-[#3A3B3C]">
            <div className="flex items-center space-x-4">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-24 h-24 rounded-full border-4 border-[#3A3B3C] shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#3A3B3C] flex items-center justify-center text-3xl font-bold">
                  {session.user.name?.[0] || 'U'}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-100">{user?.name || "User"}</h1>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-[#3A3B3C]">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Profile Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <p className="text-gray-300">
                  <span className="text-gray-400 font-medium">User ID: </span>
                  {session.user.id || "N/A"}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400 font-medium">Role: </span>
                  {user?.role || "User"}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400 font-medium">Department: </span>
                  {session.user.department || "Not specified"}
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-300">
                  <span className="text-gray-400 font-medium">Campus: </span>
                  {session.user.campus || "Not specified"}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400 font-medium">Course: </span>
                  {session.user.course || "Not specified"}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400 font-medium">Semester: </span>
                  {session.user.semester || "Not specified"}
                </p>
              </div>
              <button
              onClick={() => signOut()}
              className="w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-md transition duration-300 ease-in-out"
            >
              Log Out
            </button>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Your Posts</h2>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No posts found for you.</p>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <FeedItem key={post.id} post={post}    />
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-[#3A3B3C]">
        
          </div>
        </div>
      </div>
    </div>
  )
}
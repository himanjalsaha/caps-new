'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ChevronUp, ChevronDown, MessageCircle, Share2, Bookmark, User } from 'lucide-react'

type Post = {
  id: string;
  title: string;
  description: string;
  subject: string;
  tags: string[];
  imgUrl: string[];
  userId: string;
  userName: string;
  userRole: string;
  upvotes: number;
  downvotes: number;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

async function getPost(id: string): Promise<{ post: Post }> {
  const res = await fetch(`api/posts?id=${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch post')
  }
  return res.json()
}

export default function PostDetailPage() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPost() {
      if (typeof params.id !== 'string') {
        setError('Invalid post ID')
        setIsLoading(false)
        return
      }

      try {
        const data = await getPost(params.id)
        setPost(data.post)
      } catch (err) {
        setError('Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  if (isLoading) {
    return <div className="min-h-screen bg-[#18191A] text-gray-100 flex items-center justify-center">Loading...</div>
  }

  if (error || !post) {
    return <div className="min-h-screen bg-[#18191A] text-gray-100 flex items-center justify-center">{error || 'Post not found'}</div>
  }

  return (
    <div className="min-h-screen md:pt-20 bg-[#18191A] text-gray-100 py-12">
      <article className="max-w-3xl mx-auto bg-[#242526] rounded-xl shadow-lg overflow-hidden">
        <header className="p-6 border-b border-[#3E4042]">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-semibold mr-4">
                {post.userName[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-lg">{post.userName}</p>
                <p className="text-sm text-gray-400">{post.userRole}</p>
              </div>
            </div>
            <time className="text-sm text-gray-400" dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        <div className="p-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6 leading-relaxed">{post.description}</p>
          </div>

          {post.imgUrl && post.imgUrl.length > 0 && (
            <div className="my-8 space-y-4">
              {post.imgUrl.map((url, index) => (
                <Image
                  key={index} 
                  src={url} 
                  alt={`Image ${index + 1} for ${post.title}`} 
                  width={800} 
                  height={600} 
                  className="rounded-lg w-full h-auto"
                />
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 my-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-3 py-1 rounded-full bg-[#3A3B3C] text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <footer className="p-6 border-t border-[#3E4042]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <button className="p-2 hover:bg-[#3A3B3C] rounded-full transition-colors" aria-label="Upvote">
                  <ChevronUp className="w-6 h-6" />
                </button>
                <span className="mx-2 font-medium text-lg">{post.upvotes - post.downvotes}</span>
                <button className="p-2 hover:bg-[#3A3B3C] rounded-full transition-colors" aria-label="Downvote">
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>Comment</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors">
                <Bookmark className="w-5 h-5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}
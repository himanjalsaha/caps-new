'use client'

import { useState } from 'react'
import { X, ChevronDown, Globe2, Image, Link2, FileText, Users, BookOpen } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'question' | 'post'>('question')
  const [postText, setPostText] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [visibility, setVisibility] = useState('Everyone')
  const [postType, setPostType] = useState('Question')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: session } = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      alert('You must be logged in to create a post')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/posts?action=create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postType,
          description: postText,
          tags: [selectedCourse],
          imgUrl: [],
          userId: session.user?.id,
          userName: session.user.name || 'Anonymous',
          userRole: 'Student', // You might want to get this from the user's profile
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const newPost = await response.json()
      console.log('New post created:', newPost)

      // Refresh the posts list
      router.refresh()

      // Close the modal
      onClose()
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#242526] rounded-xl w-full max-w-2xl shadow-xl" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="border-b border-[#3E4042] p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="hover:bg-[#3A3B3C] p-2 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex gap-8">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'question'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('question')}
            >
              Ask Question
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'post'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('post')}
            >
              Create Post
            </button>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {session?.user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{session?.user?.name || 'Anonymous'}</h3>
              <button className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1">
                Computer Science Student
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Course Selection */}
          <div className="mb-4">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-[#3A3B3C] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Course</option>
              <option value="CS101">CS101 - Introduction to Programming</option>
              <option value="CS201">CS201 - Data Structures</option>
              <option value="CS301">CS301 - Algorithms</option>
              <option value="MATH201">MATH201 - Linear Algebra</option>
            </select>
          </div>

          {/* Post Type Selection */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <PostTypeButton
              icon={<BookOpen className="w-4 h-4" />}
              label="Question"
              active={postType === 'Question'}
              onClick={() => setPostType('Question')}
            />
            <PostTypeButton
              icon={<FileText className="w-4 h-4" />}
              label="Study Material"
              active={postType === 'Study Material'}
              onClick={() => setPostType('Study Material')}
            />
            <PostTypeButton
              icon={<Users className="w-4 h-4" />}
              label="Project Collaboration"
              active={postType === 'Project Collaboration'}
              onClick={() => setPostType('Project Collaboration')}
            />
          </div>

          {/* Text Input */}
          <div className="mb-4">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={
                activeTab === 'question'
                  ? "What's your question? Be specific to help others give you better answers..."
                  : "Share your knowledge, resources, or start a discussion..."
              }
              className="w-full min-h-[200px] bg-transparent text-white placeholder-gray-400 text-lg resize-none focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-[#3E4042] pt-4">
            <div className="flex gap-2">
              <button
                type="button"
                className="p-2 hover:bg-[#3A3B3C] rounded-full transition-colors"
                aria-label="Add image"
              >
                <Image className="w-5 h-5 text-gray-400" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-[#3A3B3C] rounded-full transition-colors"
                aria-label="Add link"
              >
                <Link2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:bg-[#3A3B3C] rounded-full transition-colors"
              >
                <Globe2 className="w-4 h-4" />
                {visibility}
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !postText.trim() || !selectedCourse}
              >
                {isSubmitting ? 'Posting...' : activeTab === 'question' ? 'Post Question' : 'Share Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function PostTypeButton({ icon, label, active, onClick }: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : 'text-gray-300 hover:bg-[#3A3B3C]'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
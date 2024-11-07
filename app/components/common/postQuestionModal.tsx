'use client'

import { useState } from 'react'
import { X, ChevronDown, Globe2, Image, Link2, FileText, Users, BookOpen } from 'lucide-react'

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'question' | 'post'>('question')
  const [postText, setPostText] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [visibility, setVisibility] = useState('Everyone')
  const [postType, setPostType] = useState('Question')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle submission logic here
    onClose()
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
              A
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Alex Johnson</h3>
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
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full font-medium transition-colors"
              >
                {activeTab === 'question' ? 'Post Question' : 'Share Post'}
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
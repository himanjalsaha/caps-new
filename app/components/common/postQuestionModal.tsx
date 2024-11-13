'use client'

import { useState, useRef } from 'react'
import { X, ChevronDown, Globe2, Image, Link2, FileText, Users, BookOpen, Upload } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { storage } from '../../firebase' // Ensure this path is correct
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

type ImagePreview = {
  file: File;
  preview: string;
};

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'question' | 'post'>('question')
  const [postText, setPostText] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [visibility, setVisibility] = useState('Everyone')
  const [postType, setPostType] = useState('Question')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index].preview)
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const uploadImages = async () => {
    const uploadPromises = imagePreviews.map(async (preview) => {
      const storageRef = ref(storage, `posts/${Date.now()}_${preview.file.name}`)
      await uploadBytes(storageRef, preview.file)
      return getDownloadURL(storageRef)
    })
    return Promise.all(uploadPromises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      alert('You must be logged in to create a post')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const imageUrls = await uploadImages()

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postType,
          description: postText,
          subject: selectedCourse,
          tags: [selectedCourse],
          imgUrl: imageUrls,
          userId: session.user.id,
          visibility: visibility.toLowerCase(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const newPost = await response.json()
      console.log('New post created:', newPost)

      router.refresh()
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating post:', error.message)
        setError(`Failed to create post: ${error.message}`)
      } else {
        console.error('Unknown error:', error)
        setError('An unknown error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#242526] rounded-xl w-full max-w-2xl shadow-xl" role="dialog" aria-modal="true">
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
          <div className="w-10" />
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {session?.user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{session?.user?.email || 'User'}</h3>
              <button className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1">
                {session?.user?.role || 'Student'}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

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

          {imagePreviews.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview.preview} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex items-center justify-between border-t border-[#3E4042] pt-4">
            <div className="flex gap-2">
              <button
                type="button"
                className="p-2 hover:bg-[#3A3B3C] rounded-full transition-colors"
                aria-label="Add images"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="w-5 h-5 text-gray-400" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden"
              />
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
                onClick={() => {
                  setVisibility(prev => 
                    prev === 'Everyone' ? 'Course' : 
                    prev === 'Course' ? 'Private' : 'Everyone'
                  )
                }}
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
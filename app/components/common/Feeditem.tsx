'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronUp, MessageCircle, Share2, ThumbsUp } from 'lucide-react'
import { Post, Answer } from '@/types/next-auth'
import Image from 'next/image'
import Component from './corousal'

interface FeedItemProps {
  post: Post
  onVote: (postId: string, voteType: "upvote" | "downvote") => Promise<void>
  onAnswerSubmit?: (postId: string, content: string) => Promise<void>
}

function AnswerItem({ answer }: { answer: Answer }) {
  return (
    <div className="bg-[#3A3B3C] rounded-lg p-4 mt-2">
      <p className="text-gray-300 mb-2">{answer.content}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-semibold text-xs">
            {answer.user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <p className="font-medium text-gray-400">{answer.user?.name || 'Anonymous'}</p>
        </div>
        <span className="text-gray-500">{new Date(answer.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

export default function FeedItem({ post, onVote, onAnswerSubmit }: FeedItemProps) {
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [answerContent, setAnswerContent] = useState('')
  const [showAnswers, setShowAnswers] = useState(false)
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)
  const [answerError, setAnswerError] = useState<string | null>(null)
  const [isUpvoted, setIsUpvoted] = useState(post.userVote === 'upvote')

  const handleShare = async () => {
    try {
      const postLink = `${window?.location.origin}/home/${post.id}`
      await navigator.clipboard.writeText(postLink)
      alert('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleSubmitAnswer = async () => {
    if (onAnswerSubmit && answerContent.trim()) {
      setIsSubmittingAnswer(true)
      setAnswerError(null)
      try {
        await onAnswerSubmit(post.id, answerContent)
        setAnswerContent('')
        setShowAnswerForm(false)
        setShowAnswers(true)
      } catch (error) {
        setAnswerError('Failed to submit answer. Please try again.')
      } finally {
        setIsSubmittingAnswer(false)
      }
    }
  }
  const handleUpvote = () => {
    if (onVote) {
      // Toggle the upvote state
      const newUpvoteState = !isUpvoted;
    
      // Update the local upvote state
      setIsUpvoted(newUpvoteState);
    
      // Call the onVote function to update the backend or global state
      onVote(post.id, newUpvoteState ? 'upvote' : 'downvote'); // Send 'downvote' when removing an upvote
    
      // Update the post upvotes count locally
      const updatedUpvotes = newUpvoteState ? post.upvotes + 1 : post.upvotes - 1;
      post.upvotes = updatedUpvotes;
    }
  }
  

  return (
    <div className="bg-[#242526] rounded-xl p-6 mb-4 hover:bg-[#2D2E2F] transition-colors shadow-lg">
      <div className="flex items-start gap-4">
      

        <div className="flex-1">
          <Link href={`/home/${post.id}`} className="block">
            <h2 className="text-xl font-semibold mb-3 hover:text-purple-400 cursor-pointer transition-colors">
              {post.title}
            </h2>
          </Link>
          <p className="text-gray-300 mb-4 text-base leading-relaxed">
            {post.description.length > 150 ? `${post.description.slice(0, 150)}...` : post.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-[#3A3B3C] text-gray-300 hover:bg-[#4E4F50] cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-semibold text-white">
                {post.userName[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">
                  {post.userName}
                </p>
                <p className="text-gray-400 text-xs">{post.userRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <span>{post.upvotes} likes</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {post.imgUrl.length > 0 &&     <Component post={post}/>}
   
          <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-1 flex-row items-center gap-2">
          <button
                className={`text-gray-400 hover:text-purple-500 transition-colors ${
                  isUpvoted ? 'text-purple-500' : ''
                } focus:outline-none group`}
                onClick={handleUpvote}
                aria-label="Upvote"
              >
                <ThumbsUp className={`w-5 h-5 transform group-hover:scale-110 transition-transform ${
                  isUpvoted ? 'animate-bounce' : ''
                }`} />
              </button>
          <span className="text-lg font-bold text-purple-500">{post.upvotes} likes</span>
        </div>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 text-gray-300 hover:bg-[#3A3B3C] py-2 px-4 rounded-lg transition-colors"
              aria-label="Share post"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>

            <button
              onClick={() => setShowAnswerForm(!showAnswerForm)}
              className="flex-1 flex items-center justify-center gap-2 text-gray-300 hover:bg-[#3A3B3C] py-2 px-4 rounded-lg transition-colors"
              aria-label="Answer post"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Answer</span>
            </button>
          </div>

          {showAnswerForm && (
            <div className="mt-4">
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full bg-[#3A3B3C] text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={4}
                aria-label="Answer content"
              />
              {answerError && <p className="text-red-500 text-sm mt-2">{answerError}</p>}
              <button
                onClick={handleSubmitAnswer}
                className="mt-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmittingAnswer || !answerContent.trim()}
              >
                {isSubmittingAnswer ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>
          )}

      
        </div>
      </div>
    </div>
  )
}
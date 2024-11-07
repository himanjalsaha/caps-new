'use client'

import { ReactNode, useState } from 'react'
import { Search, Home, Book, Users, MessageCircle, Bell, ChevronUp, ChevronDown, Plus, Share2, Bookmark, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/app/components/common/header'
import CreatePostModal from '@/app/components/common/postQuestionModal'
import PostButton from '@/app/components/common/PostModalButton'
export default function Component() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-[#18191A] text-gray-100">
      {/* Top Navigation */}
      {/* <Header/>
    */}
      {/* Main Content */}
      <div className="pt-14 flex">
        {/* Left Sidebar */}
     

        {/* Feed */}
        <main className="flex-1 lg:ml-60 max-w-3xl mx-auto p-4">
          {/* Ask Question Box */}
          <div className="bg-[#242526] rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-semibold">
                A
              </div>
              <input
                type="text"
                placeholder="What do you want to ask or share?"
                className="flex-1 bg-[#3A3B3C] text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex justify-between border-t border-[#3E4042] pt-3">
              <button className="flex-1 flex items-center justify-center gap-2 text-gray-300 hover:bg-[#3A3B3C] py-1.5 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5" />
                Ask
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 text-gray-300 hover:bg-[#3A3B3C] py-1.5 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
                Answer
              </button>
              <div className="flex-1 flex items-center justify-center gap-2 text-gray-300 hover:bg-[#3A3B3C] py-1.5 rounded-lg transition-colors">
                <PostButton buttonText='post' background={false} />
              </div>
            </div>
          </div>

          {/* Feed Items */}
          <div className="space-y-4">
            <FeedItem
              question="What's the most effective way to prepare for the upcoming Advanced Algorithms exam?"
              author={{
                name: "Sarah Chen",
                credential: "Teaching Assistant, Computer Science"
              }}
              stats={{
                votes: 234,
                answers: 18,
                views: "2.4k"
              }}
              tags={["Algorithms", "Exam Prep", "CS301"]}
            />
            <FeedItem
              question="Can someone explain the practical applications of quantum computing in cryptography?"
              author={{
                name: "Dr. James Wilson",
                credential: "Professor, Quantum Computing"
              }}
              stats={{
                votes: 156,
                answers: 8,
                views: "1.2k"
              }}
              tags={["Quantum Computing", "Cryptography", "Advanced"]}
            />
               <FeedItem
              question="Can someone explain the practical applications of quantum computing in cryptography?"
              author={{
                name: "Dr. James Wilson",
                credential: "Professor, Quantum Computing"
              }}
              stats={{
                votes: 156,
                answers: 8,
                views: "1.2k"
              }}
              tags={["Quantum Computing", "Cryptography", "Advanced"]}
            />
          </div>
        </main>

    
      </div>
    </div>
  )
}




function FeedItem({ question, author, stats, tags }:any) {
  return (
    <div className="bg-[#242526] rounded-xl p-4 hover:bg-[#2D2E2F] transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1">
          <button className="text-gray-400 hover:text-purple-500 transition-colors">
            <ChevronUp className="w-6 h-6" />
          </button>
          <span className="text-sm font-medium">{stats.votes}</span>
          <button className="text-gray-400 hover:text-purple-500 transition-colors">
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2 hover:text-purple-400 cursor-pointer">
            {question}
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag:any) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-[#3A3B3C] text-gray-300 hover:bg-[#4E4F50] cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-semibold">
                {author.name[0]}
              </div>
              <div>
                <p className="font-medium hover:text-purple-400 cursor-pointer">
                  {author.name}
                </p>
                <p className="text-gray-400 text-xs">{author.credential}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <span>{stats.answers} answers</span>
              <span>{stats.views} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


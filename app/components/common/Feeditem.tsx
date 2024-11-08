"use  client"
import { Post } from '@/types/next-auth';
import { ChevronDown, ChevronUp, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

function FeedItem({ post, onVote   }: { post: Post, onVote?: (postId: string, voteType: 'upvote' | 'downvote') => void }) {
    const handleShare = async () => {
      try {
        const postLink = `${window.location.origin}/home/${post.id}`;
        await navigator.clipboard.writeText(postLink);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    };
  
    return (
      <div className={`bg-[#242526] rounded-xl p-4 hover:bg-[#2D2E2F] transition-colors`}>
        <div className="flex items-start gap-4">
          {/* Voting section */}
          <div className="flex flex-col items-center gap-1">
            <button 
              className={`text-gray-400 hover:text-purple-500 transition-colors ${post.userVote === 'upvote' ? 'text-purple-500' : ''}`}
              onClick={() => onVote?.(post.id, 'upvote')}
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <span className="text-sm font-medium">{post.upvotes - post.downvotes}</span>
            <button 
              className={`text-gray-400 hover:text-purple-500 transition-colors ${post.userVote === 'downvote' ? 'text-purple-500' : ''}`}
              onClick={() => onVote?.(post.id, 'downvote')}
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
  
          {/* Post content */}
          <div className="flex-1">
            <Link href={`/home/${post.id}`} className="block">
              <h2 className="text-lg font-semibold mb-2 hover:text-purple-400 cursor-pointer">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-300 mb-3">
              {post.description.length > 100 ? `${post.description.slice(0, 100)}...` : post.description}
            </p>
  
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-[#3A3B3C] text-gray-300 hover:bg-[#4E4F50] cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
  
            {/* User Info and Actions */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {/* User Avatar and Info */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-semibold">
                  {post.userName[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium hover:text-purple-400 cursor-pointer">
                    {post.userName}
                  </p>
                  <p className="text-gray-400 text-xs">{post.userRole}</p>
                </div>
              </div>
  
              {/* Post interaction and timestamp */}
              <div className="flex items-center gap-4 text-gray-400">
                <span>{post.likes.length} likes</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
  
            {/* Share and Answer Buttons */}
            <div className="flex items-center justify-between space-x-6 mt-3">
              <button 
                onClick={handleShare} 
                className="flex-1 flex items-center justify-center gap-2 text-gray-300 hover:bg-[#3A3B3C] py-2 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
  
              <button 
                onClick={handleShare} 
                className="flex-1 flex items-center justify-center gap-2 text-gray-300 hover:bg-[#3A3B3C] py-2 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Answer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
export default FeedItem
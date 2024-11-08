'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, ChevronUp, ChevronDown, Share2, ChartAreaIcon } from 'lucide-react'
import CreatePostModal from '@/app/components/common/postQuestionModal'
import PostButton from '@/app/components/common/PostModalButton'
import Link from 'next/link'

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
  userVote?: 'upvote' | 'downvote' | null;
  user: {
    name: string | null;
    email: string;
  };
}

export default function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isRefreshing) {
          handleRefresh();
        }
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );

    if (topRef.current) {
      observer.observe(topRef.current);
    }

    return () => {
      if (topRef.current) {
        observer.unobserve(topRef.current);
      }
    };
  }, [isRefreshing]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data.posts);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPosts();
    setIsRefreshing(false);
  };



  const handleVote = async (postId: string, voteType: 'upvote' | 'downvote') => {
    setPosts(currentPosts => currentPosts.map(post => {
      if (post.id === postId) {
        const isRemovingVote = post.userVote === voteType;
        return {
          ...post,
          upvotes: voteType === 'upvote' 
            ? (isRemovingVote ? post.upvotes - 1 : post.upvotes + 1) 
            : post.upvotes,
          downvotes: voteType === 'downvote' 
            ? (isRemovingVote ? post.downvotes - 1 : post.downvotes + 1) 
            : post.downvotes,
          userVote: isRemovingVote ? null : voteType
        };
      }
      return post;
    }));

    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voteType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update vote');
      }

      const updatedPost = await response.json();
      setPosts(currentPosts => 
        currentPosts.map(post => post.id === postId ? { ...post, ...updatedPost } : post)
      );

    } catch (err) {
      console.error('Failed to update vote:', err);
      fetchPosts();
    }
  };

  const handleAddPost = async (newPost: Post) => {
    setPosts(currentPosts => [newPost, ...currentPosts]);
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error('Failed to add post');
      }

      const addedPost = await response.json();
      setPosts(currentPosts => 
        currentPosts.map(post => post.id === newPost.id ? addedPost : post)
      );
    } catch (err) {
      console.error('Failed to add post:', err);
      setPosts(currentPosts => currentPosts.filter(post => post.id !== newPost.id));
    }
  };

  return (
    <div className="min-h-screen bg-[#18191A] text-gray-100">
      <div ref={topRef} />
      <div className="pt-14 flex">
        <main className="flex-1 lg:ml-60 max-w-3xl mx-auto p-4">
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
                <PostButton 
                  buttonText='post' 
                  background={false} 
                  onPostCreated={(newPost) => handleAddPost(newPost as Post)} 
                />
              </div>
            </div>
          </div>

          {isLoading && <p className="text-center">Loading posts...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          
          <div className="space-y-4">
            {posts.map(post => (
              <FeedItem
                key={post.id}
                post={post}
                onVote={handleVote}
            
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

 export  function FeedItem({ post, onVote   }: { post: Post, onVote?: (postId: string, voteType: 'upvote' | 'downvote') => void }) {
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


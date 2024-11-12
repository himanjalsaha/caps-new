"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Share2 } from "lucide-react";
import PostButton from "@/app/components/common/PostModalButton";
import FeedItem from "@/app/components/common/Feeditem";
import { Post, Answer } from "@/types/next-auth";
import { useSession, signIn } from "next-auth/react";

export default function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: session } = useSession();

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
      { root: null, rootMargin: "0px", threshold: 1.0 }
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
      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data.posts);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load posts. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPosts();
    setIsRefreshing(false);
  };

  const handleVote = async (
    postId: string,
    voteType: "upvote" | "downvote"
  ) => {
    if (!session?.user?.id) {
      alert("Please sign in to vote");
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id === postId) {
          const isRemovingVote = post.userVote === voteType;
          return {
            ...post,
            upvotes:
              voteType === "upvote"
                ? isRemovingVote
                  ? post.upvotes - 1
                  : post.upvotes + 1
                : post.upvotes,
            downvotes:
              voteType === "downvote"
                ? isRemovingVote
                  ? post.downvotes - 1
                  : post.downvotes + 1
                : post.downvotes,
            userVote: isRemovingVote ? null : voteType,
          };
        }
        return post;
      })
    );

    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voteType,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update vote");
      }

      const updatedPost = await response.json();
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId ? { ...post, ...updatedPost.post } : post
        )
      );
    } catch (err) {
      console.error("Failed to update vote:", err);
      fetchPosts();
    }
  };

  const handleAddPost = async (newPost: Post) => {
    if (!session?.user?.id) {
      alert("Please sign in to create a post");
      return;
    }

    setPosts((currentPosts) => [newPost, ...currentPosts]);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPost,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add post");
      }

      const addedPost = await response.json();
      setPosts((currentPosts) =>
        currentPosts.map((post) => (post.id === newPost.id ? addedPost : post))
      );
    } catch (err) {
      console.error("Failed to add post:", err);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== newPost.id)
      );
    }
  };

  const handleAnswerSubmit = async (postId: string, content: string) => {
    if (!session?.user?.id) {
      alert("Please sign in to submit an answer");
      return;
    }

    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          doubtPostId: postId,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      const newAnswer: Answer = await response.json();

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              answers: [newAnswer, ...(post.answers || [])],
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Failed to submit answer:", err);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#18191A]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Please sign in to view the feed
          </h1>
          <button
            onClick={() => signIn()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18191A] text-gray-100">
      <div ref={topRef} />
      <div className="pt-14 flex">
        <main className="flex-1 max-w-3xl mx-auto p-4 px-6 relative left-[-30px]">
          <div className="bg-[#242526] rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-semibold">
                {session.user.name?.[0] || "U"}
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
                  buttonText="post"
                  background={false}
                  onPostCreated={(newPost) => handleAddPost(newPost as Post)}
                />
              </div>
            </div>
          </div>

          {isLoading && <p className="text-center">Loading posts...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="space-y-4">
            {posts.map((post) => (
              <FeedItem
                key={post.id}
                post={post}
                onVote={handleVote}
                onAnswerSubmit={handleAnswerSubmit}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

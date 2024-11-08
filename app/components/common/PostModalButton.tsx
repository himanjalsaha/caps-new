"use client"
import { useState } from "react"
import { Plus } from "lucide-react"
import CreatePostModal from "./postQuestionModal"
import { Post } from "@/types/next-auth"
interface MainComponentProps {
  buttonText: string
  background?: boolean
  onPostCreated?: (newPost: Post) => void;
}

function PostButton({ buttonText, background = true }: MainComponentProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`${
          background
            ? "bg-[#3A3B3C] hover:bg-[#4E4F50] text-white"
            : "bg-transparent text-white"
        } rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2`}
      >
        <Plus className="w-4 h-4" />
        {buttonText}
      </button>
      {showModal && <CreatePostModal onClose={() => setShowModal(false)} />}
    </>
  )
}

export default PostButton

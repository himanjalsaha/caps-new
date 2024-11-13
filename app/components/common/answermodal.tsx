'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import axios from 'axios'
import Modal from './modal'
import { Answer } from '@/types/next-auth'
import { useQuery } from '@tanstack/react-query'

interface AnswersModalProps {
  postId: string
}

export default function AnswersModal({ postId }: AnswersModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: answers, isLoading, error } = useQuery<Answer[]>({
    queryKey: ['answers', postId],
    queryFn: async () => {
      const response = await axios.get(`/api/answers?doubtPostId=${postId}`)
      return Array.isArray(response.data) ? response.data : []
    },
    enabled: isModalOpen,
  })

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center justify-center gap-2 text-gray-300 hover:bg-[#3A3B3C] py-2 px-4 rounded-lg transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        View Answers
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Answers">
        {isLoading ? (
          <p className="text-center text-gray-400">Loading answers...</p>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load answers. Please try again.</p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {answers && answers.length > 0 ? (
              answers.map((answer: Answer) => (
                <div key={answer.id} className="bg-[#3A3B3C] rounded-lg p-4">
                  <p className="text-gray-300 mb-2">{answer.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-semibold text-xs text-white">
                        {answer.user?.name?.[0]?.toUpperCase() || answer.user?.email?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <p className="font-medium text-gray-400">{answer.user?.name || answer.user?.email || 'Anonymous'}</p>
                    </div>
                    <span className="text-gray-500">{new Date(answer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No answers yet.</p>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
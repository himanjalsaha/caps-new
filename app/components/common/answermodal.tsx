import { useState } from 'react'
import axios from 'axios'
import Modal from './modal'
import { Answer } from '@/types/next-auth'

interface AnswersModalProps {
  postId: string
}

export default function AnswersModal({ postId }: AnswersModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openModal = () => {
    setIsModalOpen(true)
    fetchAnswers()
  }

  const closeModal = () => setIsModalOpen(false)

  const fetchAnswers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`/api/answers?doubtPostId=${postId}`, {
        params: { doubtPostId: postId }
      })
      setAnswers(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      setError('Failed to load answers. Please try again.')
      console.error('Error fetching answers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center justify-center gap-2 text-gray-300 hover:bg-[#3A3B3C] py-2 px-4 rounded-lg transition-colors"
      >
        View Answers
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Answers">
        {isLoading ? (
          <p className="text-center text-gray-400">Loading answers...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {answers.length > 0 ? (
              answers.map((answer: Answer) => (
                <div key={answer.id} className="bg-[#3A3B3C] rounded-lg p-4">
                  <p className="text-gray-300 mb-2">{answer.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-semibold text-xs">
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

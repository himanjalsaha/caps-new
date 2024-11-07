'use client'

import { useState } from 'react'
import { Search, ChevronDown, Send, X, BookOpen, Users, FileText, Image, Link2, Globe2 } from 'lucide-react'

export default function PostDoubtPage() {
    type Teacher = {
        id: number;
        name: string;
        subject: string;
        avatar: string;
    } | null;
    
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>(null)
  const [doubt, setDoubt] = useState('')
  const [doubtType, setDoubtType] = useState('Question')
  const [visibility, setVisibility] = useState('Everyone')

  const teachers = [
    { id: 1, name: 'Dr. Emily Johnson', subject: 'Computer Science', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 2, name: 'Prof. Michael Lee', subject: 'Mathematics', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 3, name: 'Dr. Sarah Parker', subject: 'Physics', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 4, name: 'Prof. David Brown', subject: 'Chemistry', avatar: '/placeholder.svg?height=40&width=40' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted:', { teacher: selectedTeacher, doubt, doubtType, visibility })
    // Reset form
    setSelectedTeacher(null)
    setDoubt('')
    setDoubtType('Question')
    setVisibility('Everyone')
  }

  return (
    <div className="min-h-screen flex-1  bg-[#18191A]  text-gray-100 p-4">
         <div className="pt-14 flex"></div>
      <div className="max-w-2xl mx-auto bg-[#242526] rounded-xl shadow-xl">
        <div className="border-b border-[#3E4042] p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Post a doubt to your teacher</h1>
          
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              S
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Student Name</h3>
              <button className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1">
                Computer Science Student
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Teacher Selection */}
          <div className="space-y-2">
            <label htmlFor="teacher-select" className="block text-sm font-medium">
              Select a Teacher
            </label>
            <div className="relative">
              <select
                id="teacher-select"
                value={selectedTeacher ? selectedTeacher.id : ''}
                onChange={(e) => setSelectedTeacher(teachers.find(t => t.id === parseInt(e.target.value)) || null)}
                className="block w-full bg-[#3A3B3C] border border-[#4E4F50] rounded-lg py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                required
              >
                <option value="">Choose a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.subject}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Doubt Type Selection */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <DoubtTypeButton
              icon={<BookOpen className="w-4 h-4" />}
              label="Question"
              active={doubtType === 'Question'}
              onClick={() => setDoubtType('Question')}
            />
            <DoubtTypeButton
              icon={<FileText className="w-4 h-4" />}
              label="Concept Clarification"
              active={doubtType === 'Concept Clarification'}
              onClick={() => setDoubtType('Concept Clarification')}
            />
            <DoubtTypeButton
              icon={<Users className="w-4 h-4" />}
              label="Assignment Help"
              active={doubtType === 'Assignment Help'}
              onClick={() => setDoubtType('Assignment Help')}
            />
          </div>

          {/* Doubt Textarea */}
          <div className="space-y-2">
            <textarea
              value={doubt}
              onChange={(e) => setDoubt(e.target.value)}
              className="w-full min-h-[200px] bg-[#3A3B3C] border border-[#4E4F50] rounded-lg px-4 py-2 text-white placeholder-gray-400 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your doubt here... Be specific to help the teacher understand your question better."
              required
            ></textarea>
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
                onClick={() => setVisibility(visibility === 'Everyone' ? 'Only Teacher' : 'Everyone')}
              >
                <Globe2 className="w-4 h-4" />
                {visibility}
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full font-medium transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Post Doubt
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function DoubtTypeButton({ icon, label, active, onClick }: {
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
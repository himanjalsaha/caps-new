import { MoreHorizontal } from 'lucide-react'
import React from 'react'

const Rightsidebar = () => {
  return (
    <div>    {/* Right Sidebar */}
    <aside className="hidden xl:block w-80 pt-20 fixed right-0 h-[calc(100vh)] border-l border-[#3E4042] p-4">
      <div className="bg-[#242526] rounded-xl p-4">
        <h3 className="font-semibold mb-4">Trending Topics</h3>
        <div className="space-y-3">
          <TrendingTopic
            title="Final Exams Schedule Released"
            stats="1.2k students discussing"
          />
          <TrendingTopic
            title="New Research Lab Opening"
            stats="856 students interested"
          />
          <TrendingTopic
            title="Campus Hackathon 2024"
            stats="524 participants"
          />
        </div>
      </div>
    </aside></div>
  )
}

function TrendingTopic({ title, stats }: any) {
    return (
      <div className="flex items-center justify-between hover:bg-[#3A3B3C] p-2 rounded-lg cursor-pointer transition-colors">
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-xs text-gray-400">{stats}</p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-400" />
      </div>
    )
  }

export default Rightsidebar
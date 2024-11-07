import { Book, Bookmark, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
  return (
    <div >   <aside className="hidden lg:block w-60 fixed h-[calc(100vh)] border-r border-[#3E4042] p-4">
    <div className="my-12">
      <SidebarLink icon={<Book className="w-5 h-5" />} text="My Courses" count={3} />
      <SidebarLink icon={<Users className="w-5 h-5" />} text="Study Groups" count={5} />
      <SidebarLink icon={<Bookmark className="w-5 h-5" />} text="Saved Questions" count={12} />
    </div>
  </aside></div>
  )
}


function SidebarLink({ icon, text, count }:any) {
    return (
      <Link
        href="#"
        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#3A3B3C] transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-gray-300">{text}</span>
        </div>
        {count && (
          <span className="text-xs bg-[#3A3B3C] px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </Link>
    )
  }

export default Sidebar
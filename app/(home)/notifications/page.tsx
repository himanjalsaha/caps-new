'use client'

import { useState } from 'react'
import { Bell, MessageSquare, Users, Star, BookOpen, ChevronDown, Check, X, Filter } from 'lucide-react'

type NotificationType = 'reply' | 'mention' | 'like' | 'follow' | 'announcement' | 'grade'

interface Notification {
  id: string
  type: NotificationType
  content: string
  timestamp: string
  read: boolean
  link: string
  user?: {
    name: string
    avatar: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'reply',
      content: 'John Doe replied to your question about Data Structures',
      timestamp: '2 hours ago',
      read: false,
      link: '/post/123',
      user: {
        name: 'John Doe',
        avatar: '/placeholder.svg?height=40&width=40'
      }
    },
    {
      id: '2',
      type: 'mention',
      content: 'Sarah mentioned you in a discussion about Machine Learning',
      timestamp: '1 day ago',
      read: false,
      link: '/post/456',
      user: {
        name: 'Sarah Smith',
        avatar: '/placeholder.svg?height=40&width=40'
      }
    },
    {
      id: '3',
      type: 'like',
      content: 'Your answer in the Algorithms forum received 10 likes',
      timestamp: '3 days ago',
      read: true,
      link: '/post/789'
    },
    {
      id: '4',
      type: 'follow',
      content: 'Prof. Johnson started following your posts',
      timestamp: '1 week ago',
      read: true,
      link: '/profile/prof-johnson',
      user: {
        name: 'Prof. Johnson',
        avatar: '/placeholder.svg?height=40&width=40'
      }
    },
    {
      id: '5',
      type: 'announcement',
      content: 'Important: Changes to the final exam schedule',
      timestamp: '2 weeks ago',
      read: false,
      link: '/announcements/exam-schedule'
    },
    {
      id: '6',
      type: 'grade',
      content: 'Your grade for CS301 Assignment 2 has been posted',
      timestamp: '3 weeks ago',
      read: true,
      link: '/grades/cs301'
    },
  ])

  const [filter, setFilter] = useState<NotificationType | 'all'>('all')

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(notif => notif.type === filter)

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'reply': return <MessageSquare className="w-5 h-5" />
      case 'mention': return <Users className="w-5 h-5" />
      case 'like': return <Star className="w-5 h-5" />
      case 'follow': return <Users className="w-5 h-5" />
      case 'announcement': return <Bell className="w-5 h-5" />
      case 'grade': return <BookOpen className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-[#18191A] text-gray-100 ">

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={markAllAsRead}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Mark all as read
            </button>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as NotificationType | 'all')}
                className="appearance-none bg-[#3A3B3C] text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Notifications</option>
                <option value="reply">Replies</option>
                <option value="mention">Mentions</option>
                <option value="like">Likes</option>
                <option value="follow">Follows</option>
                <option value="announcement">Announcements</option>
                <option value="grade">Grades</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-[#242526] rounded-lg p-4 flex items-start gap-4 ${
                notification.read ? 'opacity-70' : ''
              }`}
            >
              <div className={`p-2 rounded-full ${
                notification.read ? 'bg-gray-700' : 'bg-blue-500'
              }`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="mb-1">{notification.content}</p>
                <p className="text-sm text-gray-400">{notification.timestamp}</p>
              </div>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    aria-label="Mark as read"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  aria-label="Delete notification"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No notifications to display.</p>
          </div>
        )}
      </div>
    </div>
  )
}
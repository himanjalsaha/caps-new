import { Server as NetServer } from 'http'
import { NextRequest } from 'next/server'
import { Server as ServerIO } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Ensure WebSocket connection stays alive
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

// Create a global io instance
global.io = global.io || null

export async function GET(req: NextRequest) {
  try {
    // Return early if socket server is already running
    if (global.io) {
      return new Response('Socket server already running')
    }

    // Get the raw HTTP server from the response
    const res = new Response('Socket server initialized')
    const httpServer = res.socket?.server as NetServer
    
    // Initialize Socket.IO server
    global.io = new ServerIO(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
    })

    // Handle socket connections
    global.io.on('connection', (socket) => {
      console.log('New client connected', socket.id)

      // Handle chat messages
      socket.on('chat message', async (data: { 
        message: string
        senderId: string
        receiverId: string 
      }) => {
        try {
          const chatMessage = await prisma.chatMessage.create({
            data: {
              message: data.message,
              senderId: data.senderId,
              receiverId: data.receiverId,
              createdAt: new Date(),
            },
          })

          // Broadcast the message to all connected clients
          global.io?.emit('chat message', chatMessage)
        } catch (error) {
          console.error('Error saving message:', error)
          socket.emit('error', { message: 'Failed to save message' })
        }
      })

      // Handle fetching chat history
      socket.on('fetch messages', async ({ 
        senderId, 
        receiverId 
      }: { 
        senderId: string
        receiverId: string 
      }) => {
        try {
          const messages = await prisma.chatMessage.findMany({
            where: {
              OR: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
              ],
            },
            orderBy: { createdAt: 'asc' },
          })

          // Send chat history only to the requesting client
          socket.emit('chat history', messages)
        } catch (error) {
          console.error('Error fetching messages:', error)
          socket.emit('error', { message: 'Failed to fetch messages' })
        }
      })

      // Handle disconnections
      socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id)
      })
    })

    return res
  } catch (error) {
    console.error('Error initializing socket server:', error)
    return new Response('Failed to initialize socket server', { 
      status: 500 
    })
  }
}

// Add TypeScript declarations for global io
declare global {
  var io: ServerIO | null
}
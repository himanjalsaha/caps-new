import { Server as ServerIO } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

let io

export async function GET(req) {
  if (io) {
    console.log('Socket server already running')
    return new Response('Socket server already running')
  }

  const res = new Response('Socket server initialized')
  const httpServer = res.socket?.server

  io = new ServerIO(httpServer, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
  })

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id)

    socket.on('chat message', async (data) => {
      try {
        const chatMessage = await prisma.chatMessage.create({
          data: {
            message: data.message,
            senderId: data.senderId,
            receiverId: data.receiverId,
            createdAt: new Date(),
          },
        })
        io.emit('chat message', chatMessage)
      } catch (error) {
        console.error('Error saving message:', error)
        socket.emit('error', { message: 'Failed to save message' })
      }
    })

    socket.on('fetch messages', async ({ senderId, receiverId }) => {
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
        socket.emit('chat history', messages)
      } catch (error) {
        console.error('Error fetching messages:', error)
        socket.emit('error', { message: 'Failed to fetch messages' })
      }
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id)
    })
  })

  return res
}

// Log to demonstrate the code is running
console.log('Socket.IO server code loaded')
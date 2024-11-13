import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { IncomingMessage, Server as HttpServer } from "http";
import { Socket } from "socket.io";

const prisma = new PrismaClient();
let io: Server | undefined;

type NextApiResponseWithSocket = NextApiResponse & {
  socket: IncomingMessage & {
    server: HttpServer & { io?: Server };
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {

  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/chat/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket: Socket) => {
      console.log("New client connected", socket.id);

      // Listen for incoming messages
      socket.on("chat message", async (data: { message: string; senderId: string; receiverId: string }) => {
        const { message, senderId, receiverId } = data;

        try {
          // Save the message to the database
          const chatMessage = await prisma.chatMessage.create({
            data: {
              message,
              senderId,
              receiverId,
              createdAt: new Date(),
            },
          });

          io?.emit("chat message", chatMessage);  // Broadcast to all clients
        } catch (error) {
          console.error("Error saving message:", error);
        }
      });

      // Fetch chat history between two users
      socket.on("fetch messages", async ({ senderId, receiverId }) => {
        try {
          const messages = await prisma.chatMessage.findMany({
            where: {
              OR: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
              ],
            },
            orderBy: { createdAt: "asc" },
          });

          socket.emit("chat history", messages);  // Send only to the requester
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
      });
    });
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,  // Disable body parsing for WebSocket
  },
};

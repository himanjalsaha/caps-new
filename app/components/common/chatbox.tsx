"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Smile, Paperclip, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { ScrollArea } from "@/components/ui/scroll-area"

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

type Chat = {
  id: number;
  name: string;
  lastMessage: string;
  avatar: string;
};

type Message = {
  text: string;
  sender: "user" | "bot";
  file?: File;
};

const chats: Chat[] = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "Let's meet tomorrow",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Bob Johnson",
    lastMessage: "Did you see the game?",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

// Inline Avatar component
function Avatar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block h-10 w-10 overflow-hidden rounded-full">
      {children}
    </div>
  );
}

function AvatarImage({ src, alt }: { src: string; alt: string }) {
  return <Image width={500} height={500} src={src} alt={alt} />;
}

function AvatarFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-600 text-white">
      {children}
    </div>
  );
}

// Inline ScrollArea component
function ScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`overflow-auto ${className}`}>{children}</div>;
}

export default function ChatBox() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<{ [key: number]: Message[] }>({
    1: [{ text: "Hello! How can I help you today?", sender: "bot" }],
    2: [{ text: "Hi Jane! What time shall we meet?", sender: "bot" }],
    3: [{ text: "Hey Bob! Yes, it was an amazing game!", sender: "bot" }],
  });
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }

      if (
        fileInputRef.current &&
        !fileInputRef.current.contains(event.target as Node)
      ) {
        setSelectedFile(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = () => {
    if ((inputMessage.trim() || selectedFile) && selectedChat) {
      const newMessage = {
        text: inputMessage,
        sender: "user" as const,
        file: selectedFile || undefined,
      };
      setMessages((prev) => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
      }));
      setInputMessage("");
      setSelectedFile(null);

      // Simulated bot response
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [selectedChat.id]: [
            ...(prev[selectedChat.id] || []),
            {
              text: `You said: ${inputMessage}${
                selectedFile ? ` and uploaded a file: ${selectedFile.name}` : ""
              }`,
              sender: "bot",
            },
          ],
        }));
      }, 1000);
    }
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
    setShowFileUpload(false);
  };

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
    setShowEmojis(false);
  };

  const handleEmojiClick = (emojiObject: any) => {
    setInputMessage((prevInput) => prevInput + emojiObject.emoji);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-[720px] max-w-5xl mx-[290px] bg-[#242526] rounded-xl shadow-xl overflow-hidden">
      <div className="w-1/4 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Chats</h2>
        </div>
        <ScrollArea className="h-[calc(700px-69px)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-700 ${
                selectedChat?.id === chat.id ? "bg-gray-700" : ""
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <Avatar>
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback>
                  {chat.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">{chat.name}</h3>
                <p className="text-sm text-gray-400">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {selectedChat ? selectedChat.name : "Select a chat"}
          </h2>
        </div>
        <ScrollArea className="flex-1 p-4">
          {selectedChat &&
            messages[selectedChat.id]?.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-600 text-gray-200"
                  }`}
                >
                  {message.text}
                  {message.file && (
                    <div className="mt-2 text-sm">
                      Attached: {message.file.name}
                    </div>
                  )}
                </span>
              </div>
            ))}
        </ScrollArea>
        <div className="p-4 border-t border-gray-700 relative">
          {showEmojis && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full mb-2 z-50"
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          {showFileUpload && (
            <div className="absolute bottom-full p-2 mb-4 bg-gray-700 rounded">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.txt"
                className="w-full text-white"
              />
            </div>
          )}
          {selectedFile && (
            <div className="absolute flex items-center justify-between p-2 mb-2 bg-gray-700 rounded left-2 bottom-full">
              <span className="text-sm truncate text-white">
                {selectedFile.name}
              </span>
              <button
                onClick={removeSelectedFile}
                className="ml-2 text-red-500"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={toggleEmojis}
              className={`p-2 rounded-full ${showEmojis ? "bg-gray-600" : ""}`}
              aria-label="Toggle emoji panel"
            >
              <Smile className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={toggleFileUpload}
              className={`p-2 rounded-full ${
                showFileUpload ? "bg-gray-600" : ""
              }`}
              aria-label="Toggle file upload"
            >
              <Paperclip className="w-6 h-6 text-white" />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="flex h-10 w-full rounded-md bg-gray-700 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-md flex items-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Send className="w-6 h-6 mr-2" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

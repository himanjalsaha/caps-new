"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Smile, Paperclip, X } from "lucide-react";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ChatBox() {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot"; file?: File }[]
  >([{ text: "Hello! How can I help you today?", sender: "bot" }]);
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
        setSelectedFile(null); // Hide or reset the file input when clicking outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim() || selectedFile) {
      const newMessage = {
        text: inputMessage,
        sender: "user" as const,
        file: selectedFile || undefined,
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
      setSelectedFile(null);
      // Here you would typically send the message to a backend or chatbot API
      // For this example, we'll just echo the message back as a bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: `You said: ${inputMessage}${
              selectedFile ? ` and uploaded a file: ${selectedFile.name}` : ""
            }`,
            sender: "bot",
          },
        ]);
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
    <div
      className=" max-w-4xl  mx-auto bg-[#242526] rounded-xl shadow-xl  "
      style={{ height: "700px" }}
    >
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chat</h2>
      </div>
      <div className="h-[570px] overflow-y-auto p-4 ">
        {messages.map((message, index) => (
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
                  : "bg-gray-200 text-gray-800"
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
      </div>
      <div className=" p-4 border-t relative">
        {showEmojis && (
          <div ref={emojiPickerRef} className="absolute bottom-full mb-2 z-50">
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
              className="w-full"
            />
          </div>
        )}
        {selectedFile && (
          <div className="absolute flex items-center justify-between p-2 mb-2 bg-gray-700 rounded left-[350px] bottom-[80px] ml-2">
            <span className="text-sm truncate">{selectedFile.name}</span>
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
            <Smile className="w-6 h-6" />
          </button>
          <button
            onClick={toggleFileUpload}
            className={`p-2 rounded-full ${
              showFileUpload ? "bg-gray-600" : ""
            }`}
            aria-label="Toggle file upload"
          >
            <Paperclip className="w-6 h-6" />
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
            className="flex h-10 w-full rounded-md bg-[#242526] px-3 py-2 text-sm  file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            className="p-2  text-white rounded-md flex items-center"
          >
            <Send className="w-6 h-6 mr-2 b" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

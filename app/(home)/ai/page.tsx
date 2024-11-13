import React from "react";

export default function AiChat() {
  return (
    <div className="min-h-screen  pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#242526] rounded-xl p-4 mb-4 shadow-lg border border-purple-500/20">
          <h3 className="text-white/90 font-medium mb-3">Demo Login Credentials</h3>
          <div className="space-y-2 text-gray-300">
            <p>
              Email: <span className="text-purple-400">user@gmail.com</span>
            </p>
            <p>
              Password: <span className="text-purple-400">123456</span>
            </p>
          </div>
        </div>

        <div className="bg-[#242526] rounded-xl shadow-xl overflow-hidden h-[85vh]">
          <iframe
            src="https://campusassist.vercel.app/"
            className="w-full h-full border-none"
            title="Campus Assistant Chat"
          />
        </div>
      </div>
    </div>
  );
}

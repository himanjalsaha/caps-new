import React from "react";

export default function AiChat() {
  return (
    <div className="min-h-screen  pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#242526] rounded-xl shadow-xl overflow-hidden h-[80vh]">
          <iframe
            src="https://campusassist.vercel.app/"
            className="w-full h-full border-none"
                      title="Campus Assistant Chat"
                      allowTransparency
          />
        </div>
      </div>
    </div>
  );
}

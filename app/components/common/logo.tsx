import Image from 'next/image';
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center justify-center p-4 gap-4">
      <Image 
        src="/christ-uni.png" 
        alt="Ask Christ Logo" 
        width={60} 
        height={60} 
        className="object-contain size-10 "
      />
      <span className="text-2xl text-nowrap font-bold bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
        Ask Christ
      </span>
    </div>
  );
};

export default Logo;
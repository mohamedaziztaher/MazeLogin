import React from 'react'

const NirdLogo: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-black p-8">
      <div className="flex items-center gap-8">
        {/* Insect/Butterfly Graphic */}
        <div className="relative">
          {/* Head */}
          <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
          {/* Antennae */}
          <div className="absolute -top-2 left-2 w-0.5 h-4 bg-purple-400 rounded-full transform rotate-12"></div>
          <div className="absolute -top-2 left-4 w-0.5 h-4 bg-purple-400 rounded-full transform -rotate-12"></div>
          
          {/* Body */}
          <div className="relative top-8 left-4 w-3 h-24 bg-gradient-to-b from-blue-500 via-purple-500 to-yellow-400 rounded-full">
            {/* Pixelated elements */}
            <div className="absolute -left-2 top-2 w-2 h-2 bg-blue-400"></div>
            <div className="absolute -left-1 top-6 w-2 h-2 bg-blue-300"></div>
            <div className="absolute -left-2 top-10 w-2 h-2 bg-blue-500"></div>
            <div className="absolute -left-1 top-14 w-2 h-2 bg-blue-400"></div>
          </div>
          
          {/* Upper Wing (B shape) */}
          <div className="absolute top-10 left-8 w-20 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-tl-full rounded-tr-3xl rounded-bl-3xl rounded-br-full transform -rotate-12"></div>
          
          {/* Lower Wing */}
          <div className="absolute top-20 left-10 w-16 h-20 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full"></div>
        </div>
        
        {/* Text */}
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold">
            <span className="text-blue-500">N</span>
            <span className="text-gray-700">umérique</span>
          </div>
          <div className="text-2xl font-bold">
            <span className="text-pink-500">I</span>
            <span className="text-gray-700">nclusif</span>
          </div>
          <div className="text-2xl font-bold">
            <span className="text-pink-300">R</span>
            <span className="text-gray-700">esponsable</span>
          </div>
          <div className="text-2xl font-bold">
            <span className="text-yellow-400">D</span>
            <span className="text-gray-700">urable</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NirdLogo


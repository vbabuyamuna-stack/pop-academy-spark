import React, { useState } from 'react';

const DaisyButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const [clicks, setClicks] = useState(0);
    const [isPressed, setIsPressed] = useState(false);

    return (
      <div className="inline-block">
        {/* Cute Bee Character */}
        <div className={`transition-all duration-500 ${isHovered ? 'translate-y-2' : 'translate-y-0'}`}>
          <div className="inline-block relative">
            {/* Bee body */}
            <div className="relative">
              {/* Wings */}
              <div className={`absolute -top-2 left-2 w-8 h-10 bg-white rounded-full opacity-80 transition-all duration-300 ${isHovered ? 'rotate-12' : 'rotate-0'}`}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
              <div className={`absolute -top-2 right-2 w-8 h-10 bg-white rounded-full opacity-80 transition-all duration-300 ${isHovered ? '-rotate-12' : 'rotate-0'}`}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
              {/* Main body */}
              <div className="relative w-16 h-20 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full">
                {/* Black stripes */}
                <div className="absolute top-6 left-0 right-0 h-3 bg-gray-800 rounded-full" />
                <div className="absolute top-11 left-0 right-0 h-3 bg-gray-800 rounded-full" />
                {/* Face */}
                <div className="absolute top-3 left-0 right-0 flex justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-800 rounded-full" />
                  <div className="w-2 h-2 bg-gray-800 rounded-full" />
                </div>
                <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-gray-800 rounded-full transition-all ${isHovered ? 'scale-110' : ''}`} />
                {/* Antennae */}
                <div className="absolute -top-3 left-4 w-0.5 h-4 bg-gray-800">
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full" />
                </div>
                <div className="absolute -top-3 right-4 w-0.5 h-4 bg-gray-800">
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Daisy Button */}
        <button
          {...props}
          ref={ref}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onClick={(e) => {
            setClicks(clicks + 1);
            if (props.onClick) props.onClick(e);
          }}
          className={`group relative px-12 py-5 bg-white rounded-full shadow-xl transition-all duration-300 border-4 border-yellow-300 overflow-visible ${
            isHovered ? 'shadow-2xl scale-105' : 'shadow-xl scale-100'
          } ${isPressed ? 'scale-95' : ''} ${props.className || ''}`}
        >
          {/* Petals */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute transition-all duration-500 ease-out`}
                style={{
                  transform: `rotate(${i * 30}deg) translateY(${isHovered ? '-45px' : '-42px'})`,
                }}
              >
                <div 
                  className="w-5 h-14 bg-gradient-to-b from-white to-gray-50 rounded-full"
                  style={{
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
                  }}
                />
              </div>
            ))}
          </div>
          {/* Center with texture */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 rounded-full transition-all duration-500 ${
              isHovered ? 'scale-110 rotate-90' : 'scale-100 rotate-0'
            }`}
            style={{
              boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4), inset 0 2px 4px rgba(255,255,255,0.5)',
            }}
          >
            {/* Texture dots */}
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-orange-500 rounded-full opacity-40"
                style={{
                  top: `${30 + Math.cos(i * 0.785) * 15}%`,
                  left: `${50 + Math.sin(i * 0.785) * 15}%`,
                }}
              />
            ))}
          </div>
          {/* Button text */}
          <span className="relative z-10 text-gray-700 font-bold text-xl tracking-wider uppercase">
            {children || 'Pick a Daisy'}
          </span>
          {/* Subtle particles */}
          {isHovered && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-75"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                    animationDuration: `${1 + Math.random()}s`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </>
          )}
        </button>
        {/* Counter display */}
        {clicks > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg inline-block border-2 border-yellow-200 mt-4">
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
              {clicks} {clicks === 1 ? 'Daisy' : 'Daisies'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {clicks === 1 && "The bee is happy! 🐝"}
              {clicks >= 2 && clicks < 5 && "Buzzing with joy! 🐝✨"}
              {clicks >= 5 && clicks < 10 && "A beautiful bouquet! 🌼🌼🌼"}
              {clicks >= 10 && "Garden paradise! 🌼🐝🌸"}
            </p>
          </div>
        )}
      </div>
    );
  }
);

export default DaisyButton;

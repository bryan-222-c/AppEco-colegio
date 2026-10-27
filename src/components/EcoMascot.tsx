import React, { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { speakText, sounds } from '../utils/audio';

interface EcoMascotProps {
  mood?: 'happy' | 'celebrating' | 'thinking' | 'guiding' | 'explaining';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
  className?: string;
}

export const EcoMascot: React.FC<EcoMascotProps> = ({
  mood = 'happy',
  message,
  size = 'md',
  showSpeechBubble = true,
  className = '',
}) => {
  const [isWaving, setIsWaving] = useState(false);

  const handleMascotClick = () => {
    setIsWaving(true);
    sounds.playPop();
    if (message) {
      speakText(message);
    }
    setTimeout(() => setIsWaving(false), 1200);
  };

  const sizeDimensions = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-40 sm:h-40',
  }[size];

  return (
    <div className={`flex items-center gap-3 relative select-none ${className}`}>
      {/* Mascot Graphic */}
      <div
        onClick={handleMascotClick}
        title="¡Haz clic en Eco para escuchar su consejo!"
        className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 ${
          isWaving ? 'animate-bounce-gentle' : ''
        } ${sizeDimensions}`}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft aura glow */}
          <circle cx="80" cy="85" r="58" fill="#dcfce7" opacity="0.8" />

          {/* Plant Sprout Leaf on Head (bouncing) */}
          <g className="origin-bottom transform animate-bounce-gentle" style={{ transformOrigin: '80px 48px' }}>
            <path
              d="M80 48 C70 30, 48 30, 52 14 C70 16, 78 32, 80 48 Z"
              fill="#22c55e"
              stroke="#15803d"
              strokeWidth="2.5"
            />
            <path
              d="M80 48 C90 30, 112 30, 108 14 C90 16, 82 32, 80 48 Z"
              fill="#4ade80"
              stroke="#15803d"
              strokeWidth="2.5"
            />
            <path
              d="M80 48 Q80 20 80 14"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* Body: Friendly Green Drop / Pear character */}
          <path
            d="M80 42 C115 42, 134 75, 130 112 C126 140, 105 146, 80 146 C55 146, 34 140, 30 112 C26 75, 45 42, 80 42 Z"
            fill="url(#eco-gradient)"
            stroke="#15803d"
            strokeWidth="3.5"
          />

          {/* Belly highlight */}
          <ellipse cx="80" cy="116" rx="34" ry="22" fill="#bbf7d0" opacity="0.6" />

          {/* Cheerful Eyes */}
          <g>
            {mood === 'celebrating' ? (
              // Starry / squinting happy eyes
              <>
                <path
                  d="M58 84 Q66 76 74 84"
                  stroke="#064e3b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M86 84 Q94 76 102 84"
                  stroke="#064e3b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </>
            ) : (
              // Big round shiny eyes
              <>
                <ellipse cx="64" cy="86" rx="8" ry="11" fill="#064e3b" />
                <ellipse cx="96" cy="86" rx="8" ry="11" fill="#064e3b" />
                <circle cx="62" cy="82" r="3.5" fill="#ffffff" />
                <circle cx="94" cy="82" r="3.5" fill="#ffffff" />
                <circle cx="66" cy="90" r="1.5" fill="#ffffff" />
                <circle cx="98" cy="90" r="1.5" fill="#ffffff" />
              </>
            )}
          </g>

          {/* Rosy Cheeks */}
          <circle cx="50" cy="96" r="6.5" fill="#f87171" opacity="0.6" />
          <circle cx="110" cy="96" r="6.5" fill="#f87171" opacity="0.6" />

          {/* Big Warm Smile */}
          <path
            d="M68 98 Q80 114 92 98"
            stroke="#064e3b"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="#b91c1c"
          />
          {/* Little tongue inside smile */}
          <path
            d="M74 104 Q80 112 86 104"
            fill="#f87171"
          />

          {/* Small friendly hands */}
          <path
            d={isWaving ? "M28 85 Q18 65 24 50" : "M32 102 Q22 108 28 118"}
            stroke="#15803d"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="#86efac"
          />
          <path
            d="M128 102 Q138 108 132 118"
            stroke="#15803d"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="#86efac"
          />

          {/* Little feet */}
          <ellipse cx="62" cy="144" rx="10" ry="6" fill="#15803d" />
          <ellipse cx="98" cy="144" rx="10" ry="6" fill="#15803d" />

          {/* Gradients */}
          <defs>
            <linearGradient id="eco-gradient" x1="80" y1="42" x2="80" y2="146" gradientUnits="userSpaceOnUse">
              <stop stopColor="#86efac" />
              <stop offset="0.6" stopColor="#4ade80" />
              <stop offset="1" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>

        {/* Small badge/tag */}
        <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 font-black text-[10px] px-1.5 py-0.5 rounded-full border border-amber-600 shadow-sm flex items-center gap-0.5">
          <Sparkles className="w-2.5 h-2.5 text-amber-700" />
          <span>Eco</span>
        </div>
      </div>

      {/* Interactive Speech Bubble */}
      {showSpeechBubble && message && (
        <div className="max-w-xs sm:max-w-md bg-white border-2 border-emerald-400 rounded-2xl p-3 sm:p-4 shadow-lg relative text-slate-800 text-sm sm:text-base leading-snug">
          {/* Arrow */}
          <div className="absolute left-[-9px] top-6 w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-emerald-400 border-b-[8px] border-b-transparent"></div>
          <div className="absolute left-[-6px] top-6 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-[8px] border-b-transparent"></div>

          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-slate-700">{message}</p>
            <button
              onClick={() => speakText(message)}
              title="Escuchar a Eco en voz alta"
              className="flex-shrink-0 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 p-1.5 rounded-full transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

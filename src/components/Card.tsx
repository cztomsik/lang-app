import type { ComponentChildren } from 'preact';

interface CardProps {
  children: ComponentChildren;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl p-10 mb-8 min-h-[300px] flex items-center justify-center ${className}`}>
      <div className="text-center w-full">
        {children}
      </div>
    </div>
  );
}

interface WordDisplayProps {
  label: string;
  word: string;
  onSpeak?: () => void;
  color?: 'default' | 'primary';
}

export function WordDisplay({ label, word, onSpeak, color = 'default' }: WordDisplayProps) {
  const wordColor = color === 'primary' ? 'text-violet-500' : 'text-gray-800';
  
  return (
    <div className="mb-8">
      <span className="block text-sm text-gray-600 uppercase tracking-wider mb-2">
        {label}:
      </span>
      <div className="flex items-center gap-4 justify-center">
        <h2 className={`text-4xl font-bold m-0 ${wordColor}`}>
          {word}
        </h2>
        {onSpeak && (
          <button 
            className="bg-transparent hover:bg-gray-100 active:opacity-50 rounded-full p-2 min-w-10 h-10 flex items-center justify-center opacity-70 hover:opacity-100 text-xl"
            onClick={onSpeak}
            title="Speak"
          >
            🔊
          </button>
        )}
      </div>
    </div>
  );
}
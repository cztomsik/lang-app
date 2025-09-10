import type { ComponentChildren } from 'preact';
import { Button } from './Button';

interface CardProps {
  children: ComponentChildren;
  class?: string;
}

export function Card({ children, class: className = '' }: CardProps) {
  return (
    <div
      class={`bg-gradient-to-br from-gray-100 to-blue-100 rounded-xl p-4 mb-4 min-h-[300px] flex items-center justify-center ${className}`}
    >
      <div class="text-center w-full">{children}</div>
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
    <div class="mb-4 md:mb-8">
      <span class="block text-xs text-gray-600 uppercase tracking-wider mb-1">{label}:</span>
      <div class="flex items-center gap-4 justify-center">
        <h2 class={`text-2xl md:text-4xl font-bold m-0 ${wordColor}`}>{word}</h2>
        {onSpeak && (
          <Button variant="speak" class="text-xl" onClick={onSpeak} title="Speak">
            🔊
          </Button>
        )}
      </div>
    </div>
  );
}

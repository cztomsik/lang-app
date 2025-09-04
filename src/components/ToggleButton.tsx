import type { ComponentChildren } from 'preact';

interface ToggleButtonProps {
  onClick: () => void;
  children: ComponentChildren;
}

export function ToggleButton({ onClick, children }: ToggleButtonProps) {
  return (
    <button 
      className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-base cursor-pointer transition-all duration-300 hover:border-violet-500 hover:bg-violet-50"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
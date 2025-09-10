import type { ComponentChildren } from 'preact';
import { Button } from './Button';

interface ToggleButtonProps {
  onClick: () => void;
  children: ComponentChildren;
}

export function ToggleButton({ onClick, children }: ToggleButtonProps) {
  return (
    <Button
      variant="unstyled"
      class="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-base cursor-pointer transition-all duration-300 hover:border-violet-500 hover:bg-violet-50"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

import type { ComponentChildren } from 'preact';

interface ControlGroupProps {
  label: string;
  children: ComponentChildren;
}

export function ControlGroup({ label, children }: ControlGroupProps) {
  return (
    <div class="grid grid-cols-2 justify-between items-center gap-2 py-1">
      <label class="text-sm text-gray-600 font-medium">{label}:</label>
      {children}
    </div>
  );
}

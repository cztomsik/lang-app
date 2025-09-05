import type { ComponentChildren } from 'preact';

interface ControlGroupProps {
  label: string;
  children: ComponentChildren;
}

export function ControlGroup({ label, children }: ControlGroupProps) {
  return (
    <div className="grid grid-cols-2 justify-between items-center gap-2 py-1">
      <label className="text-sm text-gray-600 font-medium">{label}:</label>
      {children}
    </div>
  );
}

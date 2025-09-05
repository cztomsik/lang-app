interface InputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Input({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
}: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full max-w-md px-4 py-4 text-lg border-2 border-gray-300 rounded-lg text-center transition-colors duration-300 focus:outline-none focus:border-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  );
}

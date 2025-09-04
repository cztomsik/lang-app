interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="flex bg-gray-300 rounded-lg p-0.5 flex-1 mb-2">
      {options.map(option => (
        <button
          key={option.value}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            value === option.value
              ? 'bg-white text-violet-500 shadow-sm'
              : 'bg-transparent text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
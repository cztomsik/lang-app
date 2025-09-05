interface ChoiceButtonProps {
  option: string;
  isCorrect: boolean;
  isSelected: boolean;
  showFeedback: boolean;
  onClick: () => void;
  onSpeak: () => void;
  disabled: boolean;
}

export function ChoiceButton({
  option,
  isCorrect,
  isSelected,
  showFeedback,
  onClick,
  onSpeak,
  disabled,
}: ChoiceButtonProps) {
  let buttonClass =
    'relative px-5 pr-12 py-5 text-lg font-medium border-2 border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-300 text-left min-h-20 flex items-center justify-start w-full hover:border-violet-500 hover:bg-violet-50 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed';

  if (showFeedback) {
    if (isCorrect) {
      buttonClass =
        'relative px-5 pr-12 py-5 text-lg font-medium border-2 rounded-lg cursor-not-allowed text-left min-h-20 flex items-center justify-start w-full bg-gradient-to-br from-green-400 to-cyan-400 border-cyan-400 text-white font-bold animate-pulse';
    } else if (isSelected && !isCorrect) {
      buttonClass =
        'relative px-5 pr-12 py-5 text-lg font-medium border-2 rounded-lg cursor-not-allowed text-left min-h-20 flex items-center justify-start w-full bg-gradient-to-br from-pink-400 to-red-500 border-red-500 text-white animate-shake';
    }
  }

  return (
    <div className="relative">
      <button className={buttonClass} onClick={onClick} disabled={disabled}>
        {option}
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-1 min-w-6 h-6 flex items-center justify-center text-sm opacity-70 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onSpeak();
        }}
        title="Speak"
      >
        🔊
      </button>
    </div>
  );
}

import { Button } from './Button';

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
    'relative px-4 pr-12 py-3 md:text-lg font-medium border-2 border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-300 text-left min-h-20 flex items-center justify-start w-full hover:border-violet-500 hover:bg-violet-50 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed';

  if (showFeedback) {
    if (isCorrect) {
      buttonClass =
        'relative px-4 pr-12 py-3 text-lg font-medium border-2 rounded-lg cursor-not-allowed text-left min-h-20 flex items-center justify-start w-full bg-gradient-to-br from-green-400 to-cyan-400 border-cyan-400 text-white font-bold animate-pulse';
    } else if (isSelected && !isCorrect) {
      buttonClass =
        'relative px-4 pr-12 py-3 text-lg font-medium border-2 rounded-lg cursor-not-allowed text-left min-h-20 flex items-center justify-start w-full bg-gradient-to-br from-pink-400 to-red-500 border-red-500 text-white animate-shake';
    }
  }

  return (
    <div className="relative">
      <Button
        variant="unstyled"
        className={buttonClass}
        onClick={onClick}
        disabled={disabled}
      >
        {option}
      </Button>
      <div
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="speak"
          className="bg-white/90 hover:bg-white border border-gray-200 min-w-6 h-6 text-sm"
          onClick={onSpeak}
          title="Speak"
        >
          🔊
        </Button>
      </div>
    </div>
  );
}

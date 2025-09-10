import { Button } from './Button';

interface FeedbackProps {
  type: 'correct' | 'incorrect';
  correctAnswer?: string;
  onSpeak?: () => void;
}

export function Feedback({ type, correctAnswer, onSpeak }: FeedbackProps) {
  const isCorrect = type === 'correct';

  return (
    <div
      class={`my-5 p-4 rounded-lg text-lg font-medium border-2 ${
        isCorrect ? 'bg-green-50 text-green-800 border-green-300' : 'bg-red-50 text-red-800 border-red-300'
      }`}
    >
      {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
      {!isCorrect && correctAnswer && (
        <div class="mt-2 text-base font-normal flex items-center justify-center flex-wrap">
          <span>The answer is: {correctAnswer}</span>
          {onSpeak && (
            <Button variant="speak" class="ml-2 rounded-full min-w-7 h-7 text-base" onClick={onSpeak} title="Speak">
              🔊
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

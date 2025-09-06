interface FeedbackProps {
  type: 'correct' | 'incorrect';
  correctAnswer?: string;
  onSpeak?: () => void;
}

export function Feedback({ type, correctAnswer, onSpeak }: FeedbackProps) {
  const isCorrect = type === 'correct';

  return (
    <div
      className={`my-5 p-4 rounded-lg text-lg font-medium border-2 ${
        isCorrect ? 'bg-green-50 text-green-800 border-green-300' : 'bg-red-50 text-red-800 border-red-300'
      }`}
    >
      {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
      {!isCorrect && correctAnswer && (
        <div className="mt-2 text-base font-normal flex items-center justify-center flex-wrap">
          <span>The answer is: {correctAnswer}</span>
          {onSpeak && (
            <button
              className="ml-2 bg-transparent hover:bg-white/50 active:opacity-50 rounded-full p-1 min-w-7 h-7 flex items-center justify-center opacity-70 hover:opacity-100 text-base"
              onClick={onSpeak}
              title="Speak"
            >
              🔊
            </button>
          )}
        </div>
      )}
    </div>
  );
}

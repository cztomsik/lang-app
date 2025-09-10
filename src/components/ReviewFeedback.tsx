import type { FunctionComponent } from 'preact';

interface ReviewFeedbackProps {
  onQualitySelect: (quality: number) => void;
  showAnswer: boolean;
  correctAnswer?: string;
}

export const ReviewFeedback: FunctionComponent<ReviewFeedbackProps> = ({
  onQualitySelect,
  showAnswer,
  correctAnswer,
}) => {
  const qualityButtons = [
    { quality: 0, label: 'Forgot', color: 'bg-red-500 hover:bg-red-600' },
    { quality: 3, label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600' },
    { quality: 4, label: 'Good', color: 'bg-blue-500 hover:bg-blue-600' },
    { quality: 5, label: 'Easy', color: 'bg-green-500 hover:bg-green-600' },
  ];

  return (
    <div class="space-y-4">
      {showAnswer && correctAnswer && (
        <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-1">Correct answer:</p>
          <p class="text-lg font-semibold text-blue-700">{correctAnswer}</p>
        </div>
      )}

      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm text-gray-600 mb-3">How well did you know this?</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          {qualityButtons.map(({ quality, label, color }) => (
            <button
              key={quality}
              onClick={() => onQualitySelect(quality)}
              class={`${color} text-white font-medium py-2 px-4 rounded-lg transition-colors`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

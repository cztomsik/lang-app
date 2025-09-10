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
    <div className="space-y-4">
      {showAnswer && correctAnswer && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Correct answer:</p>
          <p className="text-lg font-semibold text-blue-700">{correctAnswer}</p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-3">How well did you know this?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {qualityButtons.map(({ quality, label, color }) => (
            <button
              key={quality}
              onClick={() => onQualitySelect(quality)}
              className={`${color} text-white font-medium py-2 px-4 rounded-lg transition-colors`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

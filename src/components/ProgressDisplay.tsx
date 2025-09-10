import type { FunctionComponent } from 'preact';

interface ProgressDisplayProps {
  stats: {
    total: number;
    learned: number;
    learning: number;
    newWords: number;
    dueNow: number;
    masteryPercentage: number;
  };
  isReviewMode: boolean;
  onToggleReviewMode?: () => void;
}

export const ProgressDisplay: FunctionComponent<ProgressDisplayProps> = ({
  stats,
  isReviewMode,
  onToggleReviewMode,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
        {stats.dueNow > 0 && onToggleReviewMode && (
          <button
            onClick={onToggleReviewMode}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isReviewMode
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
            }`}
          >
            {isReviewMode ? 'Exit Review' : `Review ${stats.dueNow} Due`}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-xs text-gray-600">Total Words</div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{stats.learned}</div>
          <div className="text-xs text-gray-600">Mastered</div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">{stats.learning}</div>
          <div className="text-xs text-gray-600">Learning</div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.newWords}</div>
          <div className="text-xs text-gray-600">New</div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{stats.dueNow}</div>
          <div className="text-xs text-gray-600">Due Now</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Mastery</span>
          <span>{stats.masteryPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${stats.masteryPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

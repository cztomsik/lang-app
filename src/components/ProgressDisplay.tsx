import type { FunctionComponent } from 'preact';

interface ProgressDisplayProps {
  stats: {
    total: number;
    learned: number;
    learning: number;
    newWords: number;
    masteryPercentage: number;
    avgStrength?: number;
  };
  isReviewMode: boolean;
  onToggleReviewMode?: () => void;
  categoryName?: string;
}

export const ProgressDisplay: FunctionComponent<ProgressDisplayProps> = ({ stats, categoryName }) => {
  const getStrengthColor = (strength: number) => {
    if (strength < 30) return 'text-red-600';
    if (strength < 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-800">
          {categoryName ? `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Progress` : 'Your Progress'}
        </h3>
      </div>

      <div
        class={`grid gap-3 ${stats.avgStrength !== undefined ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4'}`}
      >
        <div class="bg-white rounded-lg p-3 shadow-sm">
          <div class="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div class="text-xs text-gray-600">Total Words</div>
        </div>

        <div class="bg-white rounded-lg p-3 shadow-sm">
          <div class="text-2xl font-bold text-green-600">{stats.learned}</div>
          <div class="text-xs text-gray-600">Mastered</div>
        </div>

        <div class="bg-white rounded-lg p-3 shadow-sm">
          <div class="text-2xl font-bold text-yellow-600">{stats.learning}</div>
          <div class="text-xs text-gray-600">Learning</div>
        </div>

        <div class="bg-white rounded-lg p-3 shadow-sm">
          <div class="text-2xl font-bold text-blue-600">{stats.newWords}</div>
          <div class="text-xs text-gray-600">New</div>
        </div>

        {stats.avgStrength !== undefined && (
          <div class="bg-white rounded-lg p-3 shadow-sm">
            <div class={`text-2xl font-bold ${getStrengthColor(stats.avgStrength)}`}>{stats.avgStrength}%</div>
            <div class="text-xs text-gray-600">Avg Strength</div>
          </div>
        )}
      </div>

      <div class="mt-3">
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>Mastery</span>
          <span>{stats.masteryPercentage}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${stats.masteryPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

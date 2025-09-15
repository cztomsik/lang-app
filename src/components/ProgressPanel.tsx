import type { FunctionComponent } from 'preact';
import { ProgressDisplay } from './ProgressDisplay';
import type { Stats } from '../hooks/useAppState';

interface ProgressPanelProps {
  stats: Stats;
  isReviewMode: boolean;
  onToggleReviewMode: () => void;
  selectedCategory: string;
  getCategoryStats?: (category: string) => Stats;
}

export const ProgressPanel: FunctionComponent<ProgressPanelProps> = ({
  stats,
  isReviewMode,
  onToggleReviewMode,
  selectedCategory,
  getCategoryStats,
}) => {
  // Use category-specific stats if available and category is selected
  const displayStats = selectedCategory !== 'all' && getCategoryStats ? getCategoryStats(selectedCategory) : stats;

  return (
    <ProgressDisplay
      stats={displayStats}
      isReviewMode={isReviewMode}
      onToggleReviewMode={onToggleReviewMode}
      categoryName={selectedCategory !== 'all' ? selectedCategory : undefined}
    />
  );
};
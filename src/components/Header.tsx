import { Select } from './Select';

interface HeaderProps {
  contentType: 'vocabulary' | 'phrases';
  onContentTypeChange: (type: 'vocabulary' | 'phrases') => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  showStats: boolean;
  onToggleStats: () => void;
  masteryPercentage: number;
  dueCount: number;
}

export function Header({
  contentType,
  onContentTypeChange,
  selectedCategory,
  onCategoryChange,
  categories,
  showStats,
  onToggleStats,
  masteryPercentage,
  dueCount,
}: HeaderProps) {
  return (
    <header className="flex gap-2 items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-light text-gray-800">minilingo</h1>
        <button
          onClick={onToggleStats}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
          title={showStats ? 'Hide stats' : 'Show stats'}
        >
          <span className="text-sm font-medium">
            {masteryPercentage}%
            {dueCount > 0 && (
              <span className="ml-1 text-purple-600">({dueCount} due)</span>
            )}
          </span>
          <svg
            className="w-4 h-4 transition-transform"
            style={{ transform: showStats ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      <div className="flex gap-2">
        <Select
          value={contentType}
          onChange={(value) => {
            onContentTypeChange(value as 'vocabulary' | 'phrases');
            onCategoryChange('all');
          }}
          options={[
            { value: 'vocabulary', label: 'Vocabulary' },
            { value: 'phrases', label: 'Phrases' },
          ]}
        />
        <Select
          value={selectedCategory}
          onChange={onCategoryChange}
          options={categories.map((cat, i) => ({
            value: cat,
            label: i ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Everything',
          }))}
        />
      </div>
    </header>
  );
}

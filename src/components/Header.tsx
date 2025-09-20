interface HeaderProps {
  showProgress: boolean;
  onToggleProgress: () => void;
  showSettings: boolean;
  onToggleSettings: () => void;
  masteryPercentage: number;
  dueCount: number;
}

export function Header({ showProgress, onToggleProgress, showSettings, onToggleSettings, masteryPercentage, dueCount }: HeaderProps) {
  return (
    <header class="flex gap-2 items-center">
      <h1 class="text-2xl font-light text-gray-800">minilingo</h1>
      <div class="ml-auto flex gap-1">
        <button
          onClick={onToggleProgress}
          class="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
          title={showProgress ? 'Hide progress' : 'Show progress'}
        >
          <span class="text-sm font-medium">
            📊 {masteryPercentage}%{dueCount > 0 && <span class="ml-1 text-purple-600">({dueCount} due)</span>}
          </span>
        </button>
        <button
          onClick={onToggleSettings}
          class="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
          title={showSettings ? 'Hide settings' : 'Show settings'}
        >
          <span class="text-sm font-medium">⚙️</span>
        </button>
      </div>
    </header>
  );
}

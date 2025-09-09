import type { FunctionComponent } from 'preact';
import { ProgressDisplay } from './ProgressDisplay';
import { SegmentedControl } from './SegmentedControl';
import { Select } from './Select';
import { Button } from './Button';

type Language = 'english' | 'italian' | 'japanese' | 'czech' | 'portuguese' | 'spanish';

interface SettingsPanelProps {
  stats: {
    total: number;
    learned: number;
    learning: number;
    newWords: number;
    dueNow: number;
    masteryPercentage: number;
  };
  isReviewMode: boolean;
  onToggleReviewMode: () => void;
  practiceMode: 'learn' | 'answer' | 'guess';
  onPracticeModeChange: (mode: 'learn' | 'answer' | 'guess') => void;
  fromLanguage: Language;
  toLanguage: Language;
  onFromLanguageChange: (language: Language) => void;
  onToLanguageChange: (language: Language) => void;
  onSwapLanguages: () => void;
}

export const SettingsPanel: FunctionComponent<SettingsPanelProps> = ({
  stats,
  isReviewMode,
  onToggleReviewMode,
  practiceMode,
  onPracticeModeChange,
  fromLanguage,
  toLanguage,
  onFromLanguageChange,
  onToLanguageChange,
  onSwapLanguages,
}) => {
  return (
    <div className="space-y-4">
      <ProgressDisplay
        stats={stats}
        isReviewMode={isReviewMode}
        onToggleReviewMode={onToggleReviewMode}
      />
      
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Practice Mode</label>
            <SegmentedControl
              value={practiceMode}
              onChange={(value) => onPracticeModeChange(value as 'learn' | 'answer' | 'guess')}
              options={[
                { value: 'learn', label: 'Learn' },
                { value: 'guess', label: 'Guess' },
                { value: 'answer', label: 'Answer' },
              ]}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Languages</label>
            <div className="flex gap-2">
              <Select
                value={fromLanguage}
                onChange={(value) => onFromLanguageChange(value as Language)}
                className="from-language-select flex-1"
                options={[
                  { value: 'english', label: '🇬🇧 English' },
                  { value: 'italian', label: '🇮🇹 Italian' },
                  { value: 'japanese', label: '🇯🇵 Japanese' },
                  { value: 'czech', label: '🇨🇿 Czech' },
                  { value: 'portuguese', label: '🇵🇹 Portuguese' },
                  { value: 'spanish', label: '🇪🇸 Spanish' },
                ]}
              />

              <Button
                variant="icon"
                onClick={onSwapLanguages}
                title="Swap languages"
              >
                ⇄
              </Button>

              <Select
                value={toLanguage}
                onChange={(value) => onToLanguageChange(value as Language)}
                className="to-language-select flex-1"
                options={[
                  { value: 'english', label: '🇬🇧 English' },
                  { value: 'italian', label: '🇮🇹 Italian' },
                  { value: 'japanese', label: '🇯🇵 Japanese' },
                  { value: 'czech', label: '🇨🇿 Czech' },
                  { value: 'portuguese', label: '🇵🇹 Portuguese' },
                  { value: 'spanish', label: '🇪🇸 Spanish' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
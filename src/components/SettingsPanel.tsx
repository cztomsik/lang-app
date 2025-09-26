import type { FunctionComponent } from 'preact';
import { SegmentedControl } from './SegmentedControl';
import { Select } from './Select';
import { Button } from './Button';

type Language = 'english' | 'italian' | 'japanese' | 'czech' | 'portuguese' | 'spanish' | 'german';

interface SettingsPanelProps {
  practiceMode: 'learn' | 'answer' | 'guess';
  onPracticeModeChange: (mode: 'learn' | 'answer' | 'guess') => void;
  fromLanguage: Language;
  toLanguage: Language;
  onFromLanguageChange: (language: Language) => void;
  onToLanguageChange: (language: Language) => void;
  onSwapLanguages: () => void;
  contentType: 'vocabulary' | 'phrases';
  onContentTypeChange: (type: 'vocabulary' | 'phrases') => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export const SettingsPanel: FunctionComponent<SettingsPanelProps> = ({
  practiceMode,
  onPracticeModeChange,
  fromLanguage,
  toLanguage,
  onFromLanguageChange,
  onToLanguageChange,
  onSwapLanguages,
  contentType,
  onContentTypeChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  return (
    <div class="bg-white rounded-lg p-4 shadow-sm">
        <div class="flex flex-col gap-3">
          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">Languages</label>
            <div class="flex gap-2">
              <Select
                value={fromLanguage}
                onChange={(value) => onFromLanguageChange(value as Language)}
                class="from-language-select flex-1"
                options={[
                  { value: 'english', label: '🇬🇧 English' },
                  { value: 'italian', label: '🇮🇹 Italian' },
                  { value: 'japanese', label: '🇯🇵 Japanese' },
                  { value: 'czech', label: '🇨🇿 Czech' },
                  { value: 'portuguese', label: '🇵🇹 Portuguese' },
                  { value: 'spanish', label: '🇪🇸 Spanish' },
                  { value: 'german', label: '🇩🇪 German' },
                ]}
              />

              <Button variant="icon" onClick={onSwapLanguages} title="Swap languages">
                ⇄
              </Button>

              <Select
                value={toLanguage}
                onChange={(value) => onToLanguageChange(value as Language)}
                class="to-language-select flex-1"
                options={[
                  { value: 'english', label: '🇬🇧 English' },
                  { value: 'italian', label: '🇮🇹 Italian' },
                  { value: 'japanese', label: '🇯🇵 Japanese' },
                  { value: 'czech', label: '🇨🇿 Czech' },
                  { value: 'portuguese', label: '🇵🇹 Portuguese' },
                  { value: 'spanish', label: '🇪🇸 Spanish' },
                  { value: 'german', label: '🇩🇪 German' },
                ]}
              />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">Content & Category</label>
            <div class="grid grid-cols-2 gap-2">
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
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">Practice Mode</label>
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
        </div>
    </div>
  );
};

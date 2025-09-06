import { Select } from './Select';

interface HeaderProps {
  contentType: 'vocabulary' | 'phrases';
  onContentTypeChange: (type: 'vocabulary' | 'phrases') => void;
  onCategoryReset: () => void;
}

export function Header({
  contentType,
  onContentTypeChange,
  onCategoryReset,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-light text-gray-800">minilingo</h1>
      <Select
        value={contentType}
        onChange={(value) => {
          onContentTypeChange(value as 'vocabulary' | 'phrases');
          onCategoryReset();
        }}
        options={[
          { value: 'vocabulary', label: '📝 Vocabulary' },
          { value: 'phrases', label: '💬 Phrases' },
        ]}
      />
    </header>
  );
}

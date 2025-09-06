import { Select } from './Select';

interface HeaderProps {
  contentType: 'vocabulary' | 'phrases';
  onContentTypeChange: (type: 'vocabulary' | 'phrases') => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export function Header({
  contentType,
  onContentTypeChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: HeaderProps) {
  return (
    <header className="flex gap-2 items-center justify-between">
      <h1 className="text-2xl font-light text-gray-800">minilingo</h1>
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

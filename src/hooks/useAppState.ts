import { useState, useEffect } from 'preact/hooks';
import { useLocalStorage } from './useLocalStorage';
import { vocabulary } from '../vocabulary';
import type { VocabularyWord } from '../vocabulary';
import { phrases } from '../phrases';
import type { Phrase } from '../phrases';

type Language = 'english' | 'italian' | 'japanese' | 'czech' | 'portuguese' | 'spanish' | 'german';
type ContentType = 'vocabulary' | 'phrases';
type WordOrPhrase = VocabularyWord | Phrase;

export interface Stats {
  total: number;
  learned: number;
  learning: number;
  newWords: number;
  masteryPercentage: number;
}

export function useAppState() {
  // Persistent state
  const [fromLanguage, setFromLanguage] = useLocalStorage<Language>('fromLanguage', 'italian');
  const [toLanguage, setToLanguage] = useLocalStorage<Language>('toLanguage', 'english');
  const [practiceMode, setPracticeMode] = useLocalStorage<'learn' | 'answer' | 'guess'>('practiceMode', 'guess');
  const [showProgress, setShowProgress] = useLocalStorage<boolean>('showProgress', false);
  const [showSettings, setShowSettings] = useLocalStorage<boolean>('showSettings', false);

  // Session state
  const [contentType, setContentType] = useState<ContentType>('vocabulary');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentWord, setCurrentWord] = useState<WordOrPhrase | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getCurrentData = () => {
    return contentType === 'vocabulary' ? vocabulary : phrases;
  };

  const categories = ['all', ...Array.from(new Set(getCurrentData().map((w) => w.category)))];

  // Reset category when content type changes
  useEffect(() => {
    setSelectedCategory('all');
  }, [contentType]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setUsedWords(new Set()); // Reset used words when category changes
  };

  const getFilteredWords = () => {
    const data = getCurrentData();
    if (selectedCategory === 'all') return data;
    return data.filter((w) => w.category === selectedCategory);
  };

  const swapLanguages = () => {
    const temp = fromLanguage;
    setFromLanguage(toLanguage);
    setToLanguage(temp);
  };

  return {
    // Language settings
    fromLanguage,
    toLanguage,
    setFromLanguage,
    setToLanguage,
    swapLanguages,

    // Content settings
    contentType,
    setContentType,
    selectedCategory,
    handleCategoryChange,
    categories,

    // Practice settings
    practiceMode,
    setPracticeMode,
    showProgress,
    setShowProgress,
    showSettings,
    setShowSettings,

    // Game state
    currentWord,
    setCurrentWord,
    score,
    setScore,
    userInput,
    setUserInput,
    feedback,
    setFeedback,
    usedWords,
    setUsedWords,
    multipleChoiceOptions,
    setMultipleChoiceOptions,
    selectedOption,
    setSelectedOption,

    // Utilities
    getCurrentData,
    getFilteredWords,
  };
}

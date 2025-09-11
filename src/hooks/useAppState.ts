import { useState, useEffect } from 'preact/hooks';
import { useLocalStorage } from './useLocalStorage';
import { vocabulary } from '../vocabulary';
import type { VocabularyWord } from '../vocabulary';
import { phrases } from '../phrases';
import type { Phrase } from '../phrases';

type Language = 'english' | 'italian' | 'japanese' | 'czech' | 'portuguese' | 'spanish';
type ContentType = 'vocabulary' | 'phrases';
type WordOrPhrase = VocabularyWord | Phrase;

export function useAppState() {
  // Persistent state
  const [fromLanguage, setFromLanguage] = useLocalStorage<Language>('fromLanguage', 'english');
  const [toLanguage, setToLanguage] = useLocalStorage<Language>('toLanguage', 'italian');
  const [practiceMode, setPracticeMode] = useLocalStorage<'learn' | 'answer' | 'guess'>('practiceMode', 'guess');
  const [showStats, setShowStats] = useLocalStorage<boolean>('showStats', true);

  // Session state
  const [contentType, setContentType] = useState<ContentType>('vocabulary');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentWord, setCurrentWord] = useState<WordOrPhrase | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
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
    showStats,
    setShowStats,
    
    // Game state
    currentWord,
    setCurrentWord,
    showAnswer,
    setShowAnswer,
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
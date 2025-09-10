import { useState, useEffect, useCallback } from 'preact/hooks';
import { useLocalStorage } from './useLocalStorage';
import type { WordProgress } from '../spacedRepetition';
import { calculateNextReview, getDueWords, initializeWordProgress, getLearningStats } from '../spacedRepetition';

export interface SpacedRepetitionState {
  progressData: WordProgress[];
  dueWords: WordProgress[];
  stats: ReturnType<typeof getLearningStats>;
  currentReview: WordProgress | null;
  isReviewMode: boolean;
}

export function useSpacedRepetition(contentType: 'vocabulary' | 'phrases', fromLanguage: string, toLanguage: string) {
  // Store progress data in localStorage with a unique key per language pair and content type
  const storageKey = `sr_progress_${contentType}_${fromLanguage}_${toLanguage}`;
  const [progressData, setProgressData] = useLocalStorage<WordProgress[]>(storageKey, []);

  // Current review item
  const [currentReview, setCurrentReview] = useState<WordProgress | null>(null);

  // Calculate due words
  const dueWords = getDueWords(progressData);

  // Calculate statistics
  const stats = getLearningStats(progressData);

  // Check if we're in review mode (have due words)
  const isReviewMode = dueWords.length > 0;

  /**
   * Get or create progress for a word
   */
  const getOrCreateProgress = useCallback(
    (wordId: string, category: string): WordProgress => {
      const existing = progressData.find(
        (p) => p.wordId === wordId && p.fromLanguage === fromLanguage && p.toLanguage === toLanguage
      );

      if (existing) {
        return existing;
      }

      // Create new progress entry
      const newProgress = initializeWordProgress(wordId, category, fromLanguage, toLanguage);

      // Add to progress data
      setProgressData((prev: WordProgress[]) => [...prev, newProgress]);

      return newProgress;
    },
    [progressData, fromLanguage, toLanguage, setProgressData]
  );

  /**
   * Record a review result
   */
  const recordReview = useCallback(
    (wordId: string, quality: number, category: string) => {
      setProgressData((prev: WordProgress[]) => {
        // Check if progress exists
        const exists = prev.some(
          (p) => p.wordId === wordId && p.fromLanguage === fromLanguage && p.toLanguage === toLanguage
        );

        // If it doesn't exist, create it first
        if (!exists) {
          const newProgress = initializeWordProgress(wordId, category, fromLanguage, toLanguage);
          // Add the new progress and immediately update it with the review
          return [...prev, calculateNextReview(newProgress, quality)];
        }

        // If it exists, just update it
        return prev.map((p: WordProgress) => {
          if (p.wordId === wordId && p.fromLanguage === fromLanguage && p.toLanguage === toLanguage) {
            return calculateNextReview(p, quality);
          }
          return p;
        });
      });
    },
    [fromLanguage, toLanguage, setProgressData]
  );

  /**
   * Get the next word for review
   */
  const getNextReview = useCallback((): WordProgress | null => {
    const due = getDueWords(progressData);
    if (due.length > 0) {
      return due[0];
    }
    return null;
  }, [progressData]);

  /**
   * Mark a word as seen (for learn mode)
   */
  const markAsSeen = useCallback(
    (wordId: string, category: string) => {
      const progress = getOrCreateProgress(wordId, category);

      // If it's a new word, just mark it as needing review tomorrow
      if (progress.repetitions === 0) {
        setProgressData((prev: WordProgress[]) => {
          return prev.map((p: WordProgress) => {
            if (p.wordId === wordId && p.fromLanguage === fromLanguage && p.toLanguage === toLanguage) {
              return {
                ...p,
                nextReview: Date.now() + 24 * 60 * 60 * 1000, // Review in 24 hours
              };
            }
            return p;
          });
        });
      }
    },
    [getOrCreateProgress, fromLanguage, toLanguage, setProgressData]
  );

  /**
   * Reset progress for a specific category or all
   */
  const resetProgress = useCallback(
    (category?: string) => {
      if (category) {
        setProgressData((prev: WordProgress[]) => prev.filter((p: WordProgress) => p.category !== category));
      } else {
        setProgressData([]);
      }
    },
    [setProgressData]
  );

  /**
   * Get progress for a specific word
   */
  const getWordProgress = useCallback(
    (wordId: string): WordProgress | undefined => {
      return progressData.find(
        (p) => p.wordId === wordId && p.fromLanguage === fromLanguage && p.toLanguage === toLanguage
      );
    },
    [progressData, fromLanguage, toLanguage]
  );

  /**
   * Get all words that have been started but not mastered
   */
  const getLearningWords = useCallback((): WordProgress[] => {
    return progressData.filter((p) => p.repetitions > 0 && p.repetitions < 3);
  }, [progressData]);

  /**
   * Get all mastered words (3+ successful reviews)
   */
  const getMasteredWords = useCallback((): WordProgress[] => {
    return progressData.filter((p) => p.repetitions >= 3);
  }, [progressData]);

  // Update current review when due words change
  useEffect(() => {
    if (isReviewMode && !currentReview && dueWords.length > 0) {
      setCurrentReview(dueWords[0]);
    } else if (!isReviewMode) {
      setCurrentReview(null);
    }
  }, [isReviewMode, dueWords, currentReview]);

  return {
    // State
    progressData,
    dueWords,
    stats,
    currentReview,
    isReviewMode,

    // Actions
    recordReview,
    getOrCreateProgress,
    markAsSeen,
    resetProgress,
    getNextReview,
    setCurrentReview,

    // Queries
    getWordProgress,
    getLearningWords,
    getMasteredWords,
  };
}

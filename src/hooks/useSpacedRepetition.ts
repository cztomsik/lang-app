import { useCallback } from 'preact/hooks';
import { useLocalStorage } from './useLocalStorage';
import type { WordProgress } from '../spacedRepetition';
import { updateWordProgress, initializeWordProgress, getLearningStats } from '../spacedRepetition';

export interface SpacedRepetitionState {
  progressData: WordProgress[];
  stats: ReturnType<typeof getLearningStats>;
}

export function useSpacedRepetition(contentType: 'vocabulary' | 'phrases', fromLanguage: string, toLanguage: string) {
  // Store progress data in localStorage with a unique key per language pair and content type
  const storageKey = `sr_progress_${contentType}_${fromLanguage}_${toLanguage}`;
  const [progressData, setProgressData] = useLocalStorage<WordProgress[]>(storageKey, []);

  // Calculate statistics
  const stats = getLearningStats(progressData);

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
   * Record a practice result
   */
  const recordProgress = useCallback(
    (wordId: string, quality: number, category: string) => {
      setProgressData((prev: WordProgress[]) => {
        // Check if progress exists
        const exists = prev.some(
          (p) => p.wordId === wordId && p.fromLanguage === fromLanguage && p.toLanguage === toLanguage
        );

        // If it doesn't exist, create it first
        if (!exists) {
          const newProgress = initializeWordProgress(wordId, category, fromLanguage, toLanguage);
          // Add the new progress and immediately update it with the practice result
          return [...prev, updateWordProgress(newProgress, quality)];
        }

        // If it exists, just update it
        return prev.map((p: WordProgress) => {
          if (p.wordId === wordId && p.fromLanguage === fromLanguage && p.toLanguage === toLanguage) {
            return updateWordProgress(p, quality);
          }
          return p;
        });
      });
    },
    [fromLanguage, toLanguage, setProgressData]
  );


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


  return {
    // State
    progressData,
    stats,

    // Actions
    recordProgress,
    getOrCreateProgress,
    markAsSeen,
    resetProgress,

    // Queries
    getWordProgress,
    getLearningWords,
    getMasteredWords,
  };
}

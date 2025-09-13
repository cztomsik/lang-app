export interface WordProgress {
  wordId: string;
  category: string;
  fromLanguage: string;
  toLanguage: string;
  easeFactor: number; // difficulty multiplier (starts at 2.5) - higher = easier for you
  repetitions: number; // number of successful reviews in a row
}

export interface ReviewQuality {
  quality: number; // 0-5 scale
  // 0 - Complete blackout
  // 1 - Incorrect, but recognized after seeing answer
  // 2 - Incorrect, but seemed easy after seeing answer
  // 3 - Correct, but with difficulty
  // 4 - Correct with hesitation
  // 5 - Perfect recall
}

/**
 * Update word progress based on performance quality
 * Tracks repetitions and adjusts difficulty (easeFactor) based on performance
 */
export function updateWordProgress(progress: WordProgress, quality: number): WordProgress {
  // If quality is less than 3, we reset the learning
  if (quality < 3) {
    return {
      ...progress,
      repetitions: 0,
      easeFactor: Math.max(1.3, progress.easeFactor - 0.2),
    };
  }

  // Calculate new values for successful review
  let repetitions = progress.repetitions + 1;
  let easeFactor = progress.easeFactor;

  // Update ease factor based on quality
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, easeFactor); // Minimum ease factor of 1.3

  return {
    ...progress,
    repetitions,
    easeFactor,
  };
}


/**
 * Initialize progress for a new word
 */
export function initializeWordProgress(
  wordId: string,
  category: string,
  fromLanguage: string,
  toLanguage: string
): WordProgress {
  return {
    wordId,
    category,
    fromLanguage,
    toLanguage,
    easeFactor: 2.5,
    repetitions: 0,
  };
}

/**
 * Get learning statistics from progress data
 */
export function getLearningStats(progressData: WordProgress[]) {
  const total = progressData.length;
  const learned = progressData.filter((p) => p.repetitions >= 3).length;
  const learning = progressData.filter((p) => p.repetitions > 0 && p.repetitions < 3).length;
  const newWords = progressData.filter((p) => p.repetitions === 0).length;

  // Calculate average ease factor for difficulty assessment
  const avgEaseFactor = progressData.reduce((sum, p) => sum + p.easeFactor, 0) / (total || 1);

  return {
    total,
    learned,
    learning,
    newWords,
    avgEaseFactor,
    masteryPercentage: Math.round((learned / (total || 1)) * 100),
  };
}


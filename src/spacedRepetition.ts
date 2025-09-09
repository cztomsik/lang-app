export interface WordProgress {
  wordId: string;
  category: string;
  fromLanguage: string;
  toLanguage: string;
  interval: number; // days until next review
  easeFactor: number; // difficulty multiplier (starts at 2.5)
  repetitions: number; // number of successful reviews in a row
  nextReview: number; // timestamp for next review
  lastReview?: number; // timestamp of last review
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
 * SuperMemo 2 (SM-2) algorithm implementation
 * This algorithm calculates optimal review intervals based on performance
 */
export function calculateNextReview(
  progress: WordProgress,
  quality: number
): WordProgress {
  const now = Date.now();
  
  // If quality is less than 3, we reset the learning
  if (quality < 3) {
    return {
      ...progress,
      repetitions: 0,
      interval: 1,
      easeFactor: Math.max(1.3, progress.easeFactor - 0.2),
      lastReview: now,
      nextReview: now + (1 * 24 * 60 * 60 * 1000) // 1 day in milliseconds
    };
  }

  // Calculate new values for successful review
  let repetitions = progress.repetitions + 1;
  let interval = progress.interval;
  let easeFactor = progress.easeFactor;

  // Update ease factor based on quality
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, easeFactor); // Minimum ease factor of 1.3

  // Calculate interval based on repetition number
  if (repetitions === 1) {
    interval = 1;
  } else if (repetitions === 2) {
    interval = 6;
  } else {
    interval = Math.round(interval * easeFactor);
  }

  // Ensure minimum interval of 1 day
  interval = Math.max(1, interval);

  return {
    ...progress,
    repetitions,
    interval,
    easeFactor,
    lastReview: now,
    nextReview: now + (interval * 24 * 60 * 60 * 1000) // Convert days to milliseconds
  };
}

/**
 * Get words that are due for review
 */
export function getDueWords(
  progressData: WordProgress[],
  currentTime: number = Date.now()
): WordProgress[] {
  return progressData.filter(p => p.nextReview <= currentTime)
    .sort((a, b) => a.nextReview - b.nextReview);
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
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0,
    nextReview: Date.now() // Due immediately for first review
  };
}

/**
 * Get learning statistics from progress data
 */
export function getLearningStats(progressData: WordProgress[]) {
  const total = progressData.length;
  const learned = progressData.filter(p => p.repetitions >= 3).length;
  const learning = progressData.filter(p => p.repetitions > 0 && p.repetitions < 3).length;
  const newWords = progressData.filter(p => p.repetitions === 0).length;
  const dueNow = getDueWords(progressData).length;
  
  // Calculate average ease factor for difficulty assessment
  const avgEaseFactor = progressData.reduce((sum, p) => sum + p.easeFactor, 0) / (total || 1);
  
  return {
    total,
    learned,
    learning,
    newWords,
    dueNow,
    avgEaseFactor,
    masteryPercentage: Math.round((learned / (total || 1)) * 100)
  };
}

/**
 * Format time until next review in human-readable format
 */
export function formatTimeUntilReview(nextReview: number): string {
  const now = Date.now();
  const diff = nextReview - now;
  
  if (diff <= 0) return 'Due now';
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  if (days > 0) {
    return `In ${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `In ${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return 'Due soon';
  }
}
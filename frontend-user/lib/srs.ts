// SuperMemo 2 (SM-2) Algorithm Implementation
// Source: https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method

export interface SRSCard {
  id: string;
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReview: Date;
}

export enum ReviewQuality {
  AGAIN = 0,      // Complete blackout
  HARD = 1,       // Incorrect response; correct one remembered
  GOOD = 2,       // Correct response recalled with serious difficulty
  EASY = 3,       // Correct response with hesitation
  PERFECT = 4,    // Perfect response
}

export interface ReviewResult {
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReview: Date;
}

/**
 * Calculate next review schedule using SM-2 algorithm
 * @param card Current card state
 * @param quality Review quality (0-4)
 * @returns Updated card state
 */
export function calculateSM2(card: SRSCard, quality: ReviewQuality): ReviewResult {
  let { repetitions, easeFactor, interval } = card;

  // Update ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ease factor should not be less than 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Update repetitions and interval
  if (quality < ReviewQuality.GOOD) {
    // Failed - restart
    repetitions = 0;
    interval = 1;
  } else {
    repetitions++;

    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    repetitions,
    easeFactor,
    interval,
    nextReview,
  };
}

/**
 * Get human-readable interval text
 */
export function getIntervalText(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `In ${days} days`;
  if (days < 30) return `In ${Math.round(days / 7)} week${days / 7 > 1 ? 's' : ''}`;
  if (days < 365) return `In ${Math.round(days / 30)} month${days / 30 > 1 ? 's' : ''}`;
  return `In ${Math.round(days / 365)} year${days / 365 > 1 ? 's' : ''}`;
}

/**
 * Check if card is due for review
 */
export function isDue(nextReview: Date): boolean {
  return new Date() >= nextReview;
}

/**
 * Get cards due for review
 */
export function getDueCards<T extends SRSCard>(cards: T[]): T[] {
  return cards.filter((card) => isDue(card.nextReview));
}

/**
 * Sort cards by next review date (earliest first)
 */
export function sortByDue<T extends SRSCard>(cards: T[]): T[] {
  return [...cards].sort(
    (a, b) => a.nextReview.getTime() - b.nextReview.getTime()
  );
}




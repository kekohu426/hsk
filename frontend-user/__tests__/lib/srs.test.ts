import { calculateSM2, ReviewQuality, getIntervalText } from '@/lib/srs';

describe('SRS (Spaced Repetition System)', () => {
  describe('calculateSM2', () => {
    it('should initialize new card correctly', () => {
      const result = calculateSM2({
        id: '1',
        repetitions: 0,
        easeFactor: 2.5,
        interval: 0,
        nextReview: new Date(),
      }, ReviewQuality.PERFECT);

      expect(result.repetitions).toBe(1);
      expect(result.interval).toBe(1);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('should increase interval after correct answer', () => {
      const result = calculateSM2({
        id: '1',
        repetitions: 2,
        easeFactor: 2.5,
        interval: 6,
        nextReview: new Date(),
      }, ReviewQuality.GOOD);

      expect(result.interval).toBeGreaterThan(6);
      expect(result.repetitions).toBe(3);
    });

    it('should reset on failed review', () => {
      const result = calculateSM2({
        id: '1',
        repetitions: 5,
        easeFactor: 2.5,
        interval: 10,
        nextReview: new Date(),
      }, ReviewQuality.AGAIN);

      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
    });

    it('should maintain minimum ease factor of 1.3', () => {
      const result = calculateSM2({
        id: '1',
        repetitions: 1,
        easeFactor: 1.3,
        interval: 1,
        nextReview: new Date(),
      }, ReviewQuality.HARD);

      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('should handle perfect quality correctly', () => {
      const result = calculateSM2({
        id: '1',
        repetitions: 1,
        easeFactor: 2.5,
        interval: 1,
        nextReview: new Date(),
      }, ReviewQuality.PERFECT);

      expect(result.easeFactor).toBeGreaterThanOrEqual(2.5);
      expect(result.interval).toBe(6); // Second repetition should be 6 days
    });
  });

  describe('getIntervalText', () => {
    it('should return correct text for days', () => {
      expect(getIntervalText(0)).toBe('Today');
      expect(getIntervalText(1)).toBe('Tomorrow');
      expect(getIntervalText(5)).toBe('In 5 days');
    });

    it('should return correct text for weeks', () => {
      expect(getIntervalText(7)).toBe('In 1 week');
      expect(getIntervalText(14)).toBe('In 2 weeks');
    });

    it('should return correct text for months', () => {
      expect(getIntervalText(30)).toBe('In 1 month');
      expect(getIntervalText(60)).toBe('In 2 months');
    });

    it('should return correct text for years', () => {
      expect(getIntervalText(365)).toBe('In 1 year');
      expect(getIntervalText(730)).toBe('In 2 years');
    });
  });
});


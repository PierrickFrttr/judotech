import { useCallback } from 'react'

// SM-2 algorithm
export function useSRS() {
  const computeNextReview = useCallback((current, quality) => {
    // quality: 0-5 (0-2 = wrong, 3-5 = correct)
    const prev = current || { easiness: 2.5, interval: 1, repetitions: 0 }
    let { easiness, interval, repetitions } = prev

    if (quality >= 3) {
      if (repetitions === 0) interval = 1
      else if (repetitions === 1) interval = 6
      else interval = Math.round(interval * easiness)
      repetitions += 1
    } else {
      repetitions = 0
      interval = 1
    }

    easiness = Math.max(1.3, easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

    const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000

    return { easiness, interval, repetitions, nextReview }
  }, [])

  const isDue = useCallback((srsData) => {
    if (!srsData?.nextReview) return true
    return Date.now() >= srsData.nextReview
  }, [])

  const getPriority = useCallback((techniqueProgress) => {
    if (!techniqueProgress?.srs) return 1
    const overdue = Date.now() - techniqueProgress.srs.nextReview
    return Math.max(0, overdue / (24 * 60 * 60 * 1000))
  }, [])

  return { computeNextReview, isDue, getPriority }
}

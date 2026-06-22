import { useState, useEffect, useCallback } from 'react'

const isElectron = typeof window !== 'undefined' && window.electronAPI

export function useProgress() {
  const [progress, setProgress] = useState({})
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (isElectron) {
        const [prog, s] = await Promise.all([
          window.electronAPI.progress.getAll(),
          window.electronAPI.progress.getStreak(),
        ])
        setProgress(prog || {})
        setStreak(s || 0)
      } else {
        const stored = localStorage.getItem('judotech-progress')
        setProgress(stored ? JSON.parse(stored) : {})
        setStreak(0)
      }
      setLoading(false)
    }
    load()
  }, [])

  const updateProgress = useCallback(async (techniqueId, data) => {
    if (isElectron) {
      const updated = await window.electronAPI.progress.update(techniqueId, data)
      setProgress(prev => ({ ...prev, [techniqueId]: updated }))
    } else {
      setProgress(prev => {
        const next = {
          ...prev,
          [techniqueId]: { ...prev[techniqueId], ...data, lastSeen: Date.now() },
        }
        localStorage.setItem('judotech-progress', JSON.stringify(next))
        return next
      })
    }
  }, [])

  const getStats = useCallback(() => {
    const entries = Object.values(progress)
    const total = entries.length
    const mastered = entries.filter(e => (e.correct || 0) >= 3 && (e.correct || 0) / ((e.correct || 0) + (e.wrong || 0)) >= 0.8).length
    const seen = entries.filter(e => (e.correct || 0) + (e.wrong || 0) > 0).length
    const totalCorrect = entries.reduce((acc, e) => acc + (e.correct || 0), 0)
    const totalAttempts = entries.reduce((acc, e) => acc + (e.correct || 0) + (e.wrong || 0), 0)
    return {
      total,
      mastered,
      seen,
      accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    }
  }, [progress])

  return { progress, streak, loading, updateProgress, getStats }
}

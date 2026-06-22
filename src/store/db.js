// Persistence layer — wraps electronAPI (prod) or localStorage (browser dev)
const isElectron = typeof window !== 'undefined' && window.electronAPI

export const db = {
  async getProgress() {
    if (isElectron) return window.electronAPI.progress.getAll()
    const v = localStorage.getItem('jt-progress')
    return v ? JSON.parse(v) : {}
  },

  async updateProgress(id, data) {
    if (isElectron) return window.electronAPI.progress.update(id, data)
    const all = await db.getProgress()
    all[id] = { ...all[id], ...data, lastSeen: Date.now() }
    localStorage.setItem('jt-progress', JSON.stringify(all))
    return all[id]
  },

  async getStreak() {
    if (isElectron) return window.electronAPI.progress.getStreak()
    return 0
  },
}

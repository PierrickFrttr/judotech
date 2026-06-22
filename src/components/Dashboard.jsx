import React, { useMemo } from 'react'
import styles from './Dashboard.module.css'
import categoriesData from '../data/categories.json'

const FAMILLE_COLORS = {
  'nage-waza': '#c8002a',
  'katame-waza': '#1a6bc8',
}

export default function Dashboard({ techniques, progress, streak, stats, onNavigate, onSelectTechnique }) {
  const familleStats = useMemo(() => {
    return categoriesData.familles.map(famille => {
      const famTechniques = techniques.filter(t => t.famille === famille.id)
      const famProgress = famTechniques.map(t => progress[t.id] || {})
      const seen = famProgress.filter(p => (p.correct || 0) + (p.wrong || 0) > 0).length
      const mastered = famProgress.filter(p => {
        const total = (p.correct || 0) + (p.wrong || 0)
        return total > 0 && p.correct / total >= 0.8 && p.correct >= 3
      }).length
      const totalCorrect = famProgress.reduce((a, p) => a + (p.correct || 0), 0)
      const totalAttempts = famProgress.reduce((a, p) => a + (p.correct || 0) + (p.wrong || 0), 0)
      return {
        ...famille,
        total: famTechniques.length,
        seen,
        mastered,
        accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
      }
    })
  }, [techniques, progress])

  const weakestTechniques = useMemo(() => {
    return techniques
      .filter(t => {
        const p = progress[t.id]
        const total = p ? (p.correct || 0) + (p.wrong || 0) : 0
        return total > 0
      })
      .map(t => {
        const p = progress[t.id]
        const total = (p.correct || 0) + (p.wrong || 0)
        return { ...t, accuracy: Math.round((p.correct / total) * 100), total }
      })
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5)
  }, [techniques, progress])

  const notSeenCount = techniques.filter(t => {
    const p = progress[t.id]
    return !p || (p.correct || 0) + (p.wrong || 0) === 0
  }).length

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tableau de bord</h1>
        <p className={styles.subtitle}>Votre progression en un coup d'œil</p>
      </header>

      <div className={styles.content}>
        <div className={styles.statsRow}>
          <StatCard
            value={streak}
            label="Jours consécutifs"
            icon="🔥"
            color="#f59e0b"
          />
          <StatCard
            value={`${stats.mastered}/${techniques.length}`}
            label="Techniques maîtrisées"
            icon="✓"
            color="var(--success)"
          />
          <StatCard
            value={`${stats.accuracy}%`}
            label="Précision globale"
            icon="◎"
            color="var(--accent)"
          />
          <StatCard
            value={notSeenCount}
            label="Pas encore vues"
            icon="○"
            color="var(--text-muted)"
          />
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Progression par famille</h2>
            <div className={styles.familleCards}>
              {familleStats.map(famille => (
                <div key={famille.id} className={styles.familleCard}>
                  <div className={styles.familleHeader}>
                    <span
                      className={styles.familleDot}
                      style={{ background: famille.couleur }}
                    />
                    <div>
                      <div className={styles.familleName}>{famille.nom}</div>
                      <div className={styles.familleTraduction}>{famille.traduction}</div>
                    </div>
                    <div className={styles.familleCount}>
                      {famille.mastered}/{famille.total}
                    </div>
                  </div>
                  <div className={styles.familleBar}>
                    <div
                      className={styles.familleBarFill}
                      style={{
                        width: `${(famille.mastered / famille.total) * 100}%`,
                        background: famille.couleur,
                      }}
                    />
                  </div>
                  <div className={styles.familleFooter}>
                    <span>{famille.seen} vues</span>
                    <span>{famille.accuracy}% précision</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Techniques à retravailler</h2>
            {weakestTechniques.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Aucune technique pratiquée encore.</p>
                <button className={styles.startBtn} onClick={() => onNavigate('quiz')}>
                  Commencer le quiz →
                </button>
              </div>
            ) : (
              <div className={styles.weakList}>
                {weakestTechniques.map((t, i) => (
                  <button
                    key={t.id}
                    className={styles.weakItem}
                    onClick={() => onSelectTechnique(t.id)}
                  >
                    <span className={styles.weakRank} style={{ color: i === 0 ? 'var(--error)' : 'var(--text-muted)' }}>
                      {i + 1}
                    </span>
                    <div className={styles.weakInfo}>
                      <span className={styles.weakName}>{t.romaji}</span>
                      <span className={styles.weakSub}>{t.traduction_fr}</span>
                    </div>
                    <div className={styles.weakAccuracy}>
                      <span
                        className={styles.weakPct}
                        style={{ color: t.accuracy < 50 ? 'var(--error)' : t.accuracy < 80 ? 'var(--warning)' : 'var(--success)' }}
                      >
                        {t.accuracy}%
                      </span>
                      <span className={styles.weakAttempts}>{t.total} essais</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {weakestTechniques.length > 0 && (
              <button
                className={styles.quizWeakBtn}
                onClick={() => onNavigate('quiz')}
              >
                S'entraîner sur les techniques faibles →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ value, label, icon, color }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon} style={{ color }}>{icon}</span>
      <span className={styles.statValue} style={{ color }}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

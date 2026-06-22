import React, { useState } from 'react'
import TechniqueImage from './TechniqueImage'
import styles from './TechniqueDetail.module.css'

const TIPS_LABELS = {
  kuzushi: { label: 'Kuzushi', desc: 'Déséquilibre', color: '#a855f7' },
  tsukuri: { label: 'Tsukuri', desc: 'Placement', color: '#3b82f6' },
  kake: { label: 'Kake', desc: 'Exécution', color: '#c8002a' },
  erreurs: { label: 'Erreurs courantes', desc: 'À éviter', color: '#f59e0b' },
}

const DIFFICULTY_LABELS = ['', 'Débutant', 'Intermédiaire', 'Avancé', 'Expert']

export default function TechniqueDetail({ technique, progress, onBack, onStartQuiz }) {
  const [activeImage, setActiveImage] = useState(0)

  const attempts = progress ? (progress.correct || 0) + (progress.wrong || 0) : 0
  const accuracy = attempts > 0 ? Math.round((progress.correct / attempts) * 100) : null

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
            <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
          </svg>
          Encyclopédie
        </button>
        <div className={styles.topActions}>
          <button className={styles.quizBtn} onClick={() => onStartQuiz('A')}>Quiz Image → Nom</button>
          <button className={styles.quizBtn} onClick={() => onStartQuiz('B')}>Quiz Nom → Image</button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <TechniqueImage
                technique={{ ...technique, images: technique.images?.length > 0 ? [technique.images[activeImage] || technique.images[0]] : [] }}
                size="large"
              />
            </div>
            {technique.images?.length > 1 && (
              <div className={styles.thumbnails}>
                {technique.images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumbnail} ${i === activeImage ? styles.activeThumbnail : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <TechniqueImage
                      technique={{ ...technique, images: [img] }}
                      size="small"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {accuracy !== null && (
            <div className={styles.statsCard}>
              <h3 className={styles.statsTitle}>Mes statistiques</h3>
              <div className={styles.statsGrid}>
                <div className={styles.stat}>
                  <span className={styles.statValue} style={{ color: 'var(--success)' }}>{progress.correct || 0}</span>
                  <span className={styles.statLabel}>Correctes</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue} style={{ color: 'var(--error)' }}>{progress.wrong || 0}</span>
                  <span className={styles.statLabel}>Erreurs</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{accuracy}%</span>
                  <span className={styles.statLabel}>Précision</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.nameSection}>
            <div className={styles.kanjiLarge}>{technique.kanji}</div>
            <div className={styles.names}>
              <h1 className={styles.romaji}>{technique.romaji}</h1>
              <p className={styles.traduction}>{technique.traduction_fr}</p>
            </div>
          </div>

          <div className={styles.badges}>
            <span className={styles.badge} style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>
              {technique.famille}
            </span>
            <span className={styles.badge} style={{ background: 'rgba(100,100,100,0.2)', color: 'var(--text-secondary)' }}>
              {technique.sous_famille}
            </span>
            {technique.gokyo_groupe && (
              <span className={styles.badge} style={{ background: 'rgba(100,100,100,0.2)', color: 'var(--text-secondary)' }}>
                Gokyo groupe {technique.gokyo_groupe}
              </span>
            )}
            {technique.niveau_difficulte && (
              <span className={styles.badge} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
                {DIFFICULTY_LABELS[technique.niveau_difficulte] || `Niveau ${technique.niveau_difficulte}`}
              </span>
            )}
          </div>

          {technique.tags?.length > 0 && (
            <div className={styles.tags}>
              {technique.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag.replace(/_/g, ' ')}</span>
              ))}
            </div>
          )}

          <div className={styles.tipsSection}>
            <h2 className={styles.tipsTitle}>Tips d'exécution</h2>
            <div className={styles.tipsList}>
              {Object.entries(TIPS_LABELS).map(([key, meta]) => {
                const tip = technique.tips?.[key]
                if (!tip) return null
                return (
                  <div key={key} className={styles.tipCard} style={{ borderLeftColor: meta.color }}>
                    <div className={styles.tipHeader}>
                      <span className={styles.tipLabel} style={{ color: meta.color }}>{meta.label}</span>
                      <span className={styles.tipDesc}>{meta.desc}</span>
                    </div>
                    <p className={styles.tipText}>{tip}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

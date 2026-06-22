import React, { useState, useMemo } from 'react'
import TechniqueImage from './TechniqueImage'
import styles from './Encyclopedia.module.css'
import categoriesData from '../data/categories.json'

const FAMILLE_COLORS = {
  'nage-waza': '#c8002a',
  'katame-waza': '#1a6bc8',
}

const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const IconList = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/>
    <circle cx="3" cy="18" r="1" fill="currentColor"/>
  </svg>
)

export default function Encyclopedia({ techniques, progress, onSelect, onStartQuiz }) {
  const [search, setSearch] = useState('')
  const [familleFilter, setFamilleFilter] = useState('all')
  const [sousFamilleFilter, setSousFamilleFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list')

  const familles = categoriesData.familles
  const selectedFamille = familles.find(f => f.id === familleFilter)

  const filtered = useMemo(() => {
    return techniques.filter(t => {
      const matchesSearch =
        !search ||
        t.nom_japonais.toLowerCase().includes(search.toLowerCase()) ||
        t.romaji.toLowerCase().includes(search.toLowerCase()) ||
        t.traduction_fr.toLowerCase().includes(search.toLowerCase()) ||
        t.kanji.includes(search)
      const matchesFamille = familleFilter === 'all' || t.famille === familleFilter
      const matchesSousFamille = sousFamilleFilter === 'all' || t.sous_famille === sousFamilleFilter
      return matchesSearch && matchesFamille && matchesSousFamille
    })
  }, [techniques, search, familleFilter, sousFamilleFilter])

  function handleFamilleChange(id) {
    setFamilleFilter(id)
    setSousFamilleFilter('all')
  }

  function getMastery(techniqueId) {
    const p = progress[techniqueId]
    if (!p) return 0
    const total = (p.correct || 0) + (p.wrong || 0)
    if (total === 0) return 0
    const rate = p.correct / total
    if (rate >= 0.8 && p.correct >= 3) return 2
    if (total > 0) return 1
    return 0
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Encyclopédie</h1>
            <p className={styles.subtitle}>{filtered.length} technique{filtered.length > 1 ? 's' : ''}</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.quizBtn} onClick={() => onStartQuiz('A')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Quiz Image → Nom
            </button>
            <button className={styles.quizBtn} onClick={() => onStartQuiz('B')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Quiz Nom → Image
            </button>
          </div>
        </div>

        <div className={styles.searchRow}>
          <div className={styles.searchBar}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('list')}
              title="Vue liste"
            >
              <IconList />
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vue grille"
            >
              <IconGrid />
            </button>
          </div>
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${familleFilter === 'all' ? styles.active : ''}`}
            onClick={() => handleFamilleChange('all')}
          >
            Toutes
          </button>
          {familles.map(f => (
            <button
              key={f.id}
              className={`${styles.filterBtn} ${familleFilter === f.id ? styles.active : ''}`}
              style={familleFilter === f.id ? { borderColor: f.couleur, color: f.couleur, background: `${f.couleur}18` } : {}}
              onClick={() => handleFamilleChange(f.id)}
            >
              {f.nom}
            </button>
          ))}
          {selectedFamille && selectedFamille.sous_familles.map(sf => (
            <button
              key={sf.id}
              className={`${styles.filterBtn} ${styles.subFilter} ${sousFamilleFilter === sf.id ? styles.active : ''}`}
              onClick={() => setSousFamilleFilter(sousFamilleFilter === sf.id ? 'all' : sf.id)}
            >
              {sf.nom}
            </button>
          ))}
        </div>
      </header>

      {viewMode === 'grid' ? (
        <div className={styles.grid}>
          {filtered.map(technique => {
            const mastery = getMastery(technique.id)
            const p = progress[technique.id]
            const attempts = p ? (p.correct || 0) + (p.wrong || 0) : 0
            return (
              <button key={technique.id} className={styles.card} onClick={() => onSelect(technique.id)}>
                <div className={styles.cardImage}>
                  <TechniqueImage technique={technique} size="medium" />
                  <div className={styles.famille} style={{ background: FAMILLE_COLORS[technique.famille] || 'var(--accent)' }}>
                    {technique.sous_famille}
                  </div>
                  {mastery === 2 && <div className={styles.masteredBadge}>✓</div>}
                  {mastery === 1 && <div className={styles.seenBadge}>●</div>}
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardNames}>
                    <span className={styles.romaji}>{technique.romaji}</span>
                    <span className={styles.kanji}>{technique.kanji}</span>
                  </div>
                  <span className={styles.traduction}>{technique.traduction_fr}</span>
                  {attempts > 0 && (
                    <div className={styles.cardProgress}>
                      <div className={styles.progressBar} style={{ width: `${Math.round(((p?.correct || 0) / attempts) * 100)}%` }} />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
          {filtered.length === 0 && <div className={styles.empty}><span>Aucune technique trouvée</span></div>}
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map(technique => {
            const mastery = getMastery(technique.id)
            const p = progress[technique.id]
            const attempts = p ? (p.correct || 0) + (p.wrong || 0) : 0
            const accuracy = attempts > 0 ? Math.round(((p?.correct || 0) / attempts) * 100) : null
            return (
              <button key={technique.id} className={styles.listItem} onClick={() => onSelect(technique.id)}>
                <div className={styles.listImage}>
                  <TechniqueImage technique={technique} size="small" />
                </div>
                <div className={styles.listContent}>
                  <div className={styles.listTop}>
                    <span className={styles.listRomaji}>{technique.romaji}</span>
                    <span className={styles.listKanji}>{technique.kanji}</span>
                  </div>
                  <span className={styles.listTraduction}>{technique.traduction_fr}</span>
                  <div className={styles.listMeta}>
                    <span
                      className={styles.listFamille}
                      style={{ background: `${FAMILLE_COLORS[technique.famille] || 'var(--accent)'}22`, color: FAMILLE_COLORS[technique.famille] || 'var(--accent)' }}
                    >
                      {technique.sous_famille}
                    </span>
                    {attempts > 0 && (
                      <div className={styles.listProgress}>
                        <div className={styles.listProgressBar}>
                          <div className={styles.listProgressFill} style={{ width: `${accuracy}%` }} />
                        </div>
                        <span className={styles.listAccuracy} style={{ color: accuracy >= 80 ? 'var(--success)' : accuracy >= 50 ? 'var(--warning)' : 'var(--error)' }}>
                          {accuracy}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.listRight}>
                  {mastery === 2 && <span className={styles.masteryDot} style={{ background: 'var(--success)' }}>✓</span>}
                  {mastery === 1 && <span className={styles.masteryDot} style={{ background: 'var(--warning)' }}>●</span>}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </button>
            )
          })}
          {filtered.length === 0 && <div className={styles.empty}><span>Aucune technique trouvée</span></div>}
        </div>
      )}
    </div>
  )
}

import React, { useState, useMemo } from 'react'
import TechniqueImage from './TechniqueImage'
import styles from './Encyclopedia.module.css'
import categoriesData from '../data/categories.json'

const FAMILLE_COLORS = {
  'nage-waza': '#c8002a',
  'katame-waza': '#1a6bc8',
}

export default function Encyclopedia({ techniques, progress, onSelect, onStartQuiz }) {
  const [search, setSearch] = useState('')
  const [familleFilter, setFamilleFilter] = useState('all')
  const [sousFamilleFilter, setSousFamilleFilter] = useState('all')

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

        <div className={styles.searchBar}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom, romaji, traduction, kanji…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
          )}
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

      <div className={styles.grid}>
        {filtered.map(technique => {
          const mastery = getMastery(technique.id)
          const p = progress[technique.id]
          const attempts = p ? (p.correct || 0) + (p.wrong || 0) : 0

          return (
            <button
              key={technique.id}
              className={styles.card}
              onClick={() => onSelect(technique.id)}
            >
              <div className={styles.cardImage}>
                <TechniqueImage technique={technique} size="medium" />
                <div
                  className={styles.famille}
                  style={{ background: FAMILLE_COLORS[technique.famille] || 'var(--accent)' }}
                >
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
                    <div
                      className={styles.progressBar}
                      style={{ width: `${Math.round(((p?.correct || 0) / attempts) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <span>Aucune technique trouvée</span>
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import styles from './Sidebar.module.css'

const ICONS = {
  encyclopedia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  quiz: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" />
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  flame: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c0 0-5 4.5-5 10a5 5 0 0010 0c0-2-1-4-2-5.5 0 2-1 3-2 3.5 0-2-1-5-1-8z" />
    </svg>
  ),
}

const NAV_ITEMS = [
  { id: 'encyclopedia', label: 'Encyclopédie' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'dashboard', label: 'Tableau de bord' },
]

export default function Sidebar({ currentView, onNavigate, streak, stats }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <nav
      className={`${styles.sidebar} ${expanded ? styles.expanded : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <span>柔</span>
        </div>
        {expanded && <span className={styles.logoText}>JudoTech</span>}
      </div>

      <div className={styles.nav}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${currentView === item.id || (currentView === 'detail' && item.id === 'encyclopedia') ? styles.active : ''}`}
            onClick={() => onNavigate(item.id)}
            title={item.label}
          >
            <span className={styles.icon}>{ICONS[item.id]}</span>
            {expanded && <span className={styles.label}>{item.label}</span>}
          </button>
        ))}
      </div>

      <div className={styles.bottom}>
        {streak > 0 && (
          <div className={styles.streak} title={`${streak} jour${streak > 1 ? 's' : ''} de suite`}>
            <span className={styles.streakIcon}>{ICONS.flame}</span>
            {expanded && <span className={styles.streakCount}>{streak}j</span>}
          </div>
        )}
        {expanded && stats && (
          <div className={styles.miniStats}>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>{stats.mastered}</span>
              <span className={styles.miniStatLabel}>maîtrisées</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>{stats.accuracy}%</span>
              <span className={styles.miniStatLabel}>précision</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

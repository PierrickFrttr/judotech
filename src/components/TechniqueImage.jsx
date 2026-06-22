import React, { useState } from 'react'
import styles from './TechniqueImage.module.css'

export default function TechniqueImage({ technique, size = 'medium', className = '' }) {
  const [failed, setFailed] = useState(false)

  const imagePath = technique.images?.[0]
    ? `images/techniques/${technique.images[0]}`
    : null

  if (!imagePath || failed) {
    return (
      <div className={`${styles.placeholder} ${styles[size]} ${className}`}>
        <span className={styles.kanji}>{technique.kanji}</span>
        <span className={styles.name}>{technique.romaji}</span>
      </div>
    )
  }

  return (
    <img
      src={imagePath}
      alt={technique.nom_japonais}
      className={`${styles.image} ${styles[size]} ${className}`}
      onError={() => setFailed(true)}
    />
  )
}

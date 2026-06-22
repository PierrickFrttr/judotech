import React, { useState, useCallback, useMemo, useEffect } from 'react'
import TechniqueImage from './TechniqueImage'
import styles from './Quiz.module.css'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestion(techniques, mode) {
  const correct = techniques[Math.floor(Math.random() * techniques.length)]
  const others = shuffle(techniques.filter(t => t.id !== correct.id)).slice(0, 3)
  const choices = shuffle([correct, ...others])
  return { correct, choices, mode }
}

export default function Quiz({ techniques, progress, mode, updateProgress, onBack }) {
  const [question, setQuestion] = useState(() => buildQuestion(techniques, mode))
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [sessionDone, setSessionDone] = useState(false)
  const [sessionSize] = useState(10)

  const modeLabel = mode === 'A' ? 'Image → Nom' : 'Nom → Image'

  function handleAnswer(choice) {
    if (answered) return
    setSelected(choice.id)
    setAnswered(true)
    const isCorrect = choice.id === question.correct.id
    const p = progress[question.correct.id] || {}
    updateProgress(question.correct.id, {
      correct: (p.correct || 0) + (isCorrect ? 1 : 0),
      wrong: (p.wrong || 0) + (isCorrect ? 0 : 1),
    })
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }))
  }

  function handleNext() {
    if (score.total + 1 > sessionSize && !answered) {
      setSessionDone(true)
      return
    }
    if (score.total >= sessionSize) {
      setSessionDone(true)
      return
    }
    setQuestion(buildQuestion(techniques, mode))
    setSelected(null)
    setAnswered(false)
  }

  function handleRestart() {
    setScore({ correct: 0, total: 0 })
    setQuestion(buildQuestion(techniques, mode))
    setSelected(null)
    setAnswered(false)
    setSessionDone(false)
  }

  if (sessionDone) {
    const pct = Math.round((score.correct / score.total) * 100)
    return (
      <div className={styles.container}>
        <div className={styles.resultScreen}>
          <div className={styles.resultIcon}>{pct >= 70 ? '🥋' : '📚'}</div>
          <h1 className={styles.resultTitle}>Session terminée</h1>
          <div className={styles.resultScore} style={{ color: pct >= 70 ? 'var(--success)' : 'var(--error)' }}>
            {score.correct} / {score.total}
          </div>
          <p className={styles.resultPct}>{pct}% de réussite</p>
          <p className={styles.resultMsg}>
            {pct >= 80 ? 'Excellent travail ! Continue comme ça.' : pct >= 60 ? 'Bon résultat, encore un effort !' : 'Revois les techniques et réessaie.'}
          </p>
          <div className={styles.resultActions}>
            <button className={styles.primaryBtn} onClick={handleRestart}>Recommencer</button>
            <button className={styles.secondaryBtn} onClick={onBack}>Retour à l'encyclopédie</button>
          </div>
        </div>
      </div>
    )
  }

  const { correct, choices } = question

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
            <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
          </svg>
        </button>
        <div className={styles.modeLabel}>Mode {modeLabel}</div>
        <div className={styles.progress}>
          <span>{score.total}/{sessionSize}</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(score.total / sessionSize) * 100}%` }} />
          </div>
        </div>
        <div className={styles.scoreDisplay}>
          <span style={{ color: 'var(--success)' }}>{score.correct}</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span>{score.total}</span>
        </div>
      </div>

      <div className={styles.questionArea}>
        {mode === 'A' ? (
          <ModeA
            technique={correct}
            choices={choices}
            selected={selected}
            answered={answered}
            onAnswer={handleAnswer}
          />
        ) : (
          <ModeB
            technique={correct}
            choices={choices}
            selected={selected}
            answered={answered}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      {answered && (
        <div className={styles.feedback}>
          <div className={`${styles.feedbackBanner} ${selected === correct.id ? styles.correct : styles.wrong}`}>
            {selected === correct.id ? (
              <>
                <span className={styles.feedbackIcon}>✓</span>
                <span>Correct !</span>
              </>
            ) : (
              <>
                <span className={styles.feedbackIcon}>✗</span>
                <span>Incorrect — c'était <strong>{correct.romaji}</strong></span>
              </>
            )}
          </div>
          <button
            className={styles.nextBtn}
            onClick={handleNext}
            autoFocus
          >
            {score.total >= sessionSize - 1 ? 'Voir les résultats' : 'Question suivante →'}
          </button>
        </div>
      )}
    </div>
  )
}

function ModeA({ technique, choices, selected, answered, onAnswer }) {
  return (
    <div className={styles.modeA}>
      <div className={styles.questionLabel}>Quelle est cette technique ?</div>
      <div className={styles.mainImageContainer}>
        <TechniqueImage technique={technique} size="large" />
      </div>
      <div className={styles.choicesGrid}>
        {choices.map(choice => {
          let state = ''
          if (answered) {
            if (choice.id === technique.id) state = 'correct'
            else if (choice.id === selected) state = 'wrong'
            else state = 'dimmed'
          }
          return (
            <button
              key={choice.id}
              className={`${styles.choiceBtn} ${styles.textChoice} ${state ? styles[state] : ''}`}
              onClick={() => onAnswer(choice)}
              disabled={answered}
            >
              <span className={styles.choiceRomaji}>{choice.romaji}</span>
              <span className={styles.choiceKanji}>{choice.kanji}</span>
              <span className={styles.choiceTraduction}>{choice.traduction_fr}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ModeB({ technique, choices, selected, answered, onAnswer }) {
  return (
    <div className={styles.modeB}>
      <div className={styles.questionLabel}>Identifiez la technique</div>
      <div className={styles.techniqueName}>
        <span className={styles.nameKanji}>{technique.kanji}</span>
        <span className={styles.nameRomaji}>{technique.romaji}</span>
        <span className={styles.nameTraduction}>{technique.traduction_fr}</span>
      </div>
      <div className={styles.imageGrid}>
        {choices.map(choice => {
          let state = ''
          if (answered) {
            if (choice.id === technique.id) state = 'correct'
            else if (choice.id === selected) state = 'wrong'
            else state = 'dimmed'
          }
          return (
            <button
              key={choice.id}
              className={`${styles.choiceBtn} ${styles.imageChoice} ${state ? styles[state] : ''}`}
              onClick={() => onAnswer(choice)}
              disabled={answered}
            >
              <TechniqueImage technique={choice} size="medium" />
              {answered && (
                <div className={styles.imageLabel}>{choice.romaji}</div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

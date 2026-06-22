import React, { useState, useMemo } from 'react'
import { useProgress } from './hooks/useProgress'
import Sidebar from './components/Sidebar'
import Encyclopedia from './components/Encyclopedia'
import TechniqueDetail from './components/TechniqueDetail'
import Quiz from './components/Quiz'
import Dashboard from './components/Dashboard'
import techniquesData from './data/techniques.json'
import styles from './App.module.css'

export default function App() {
  const [view, setView] = useState('encyclopedia')
  const [selectedTechniqueId, setSelectedTechniqueId] = useState(null)
  const [quizMode, setQuizMode] = useState('A')
  const { progress, streak, loading, updateProgress, getStats } = useProgress()

  const techniques = useMemo(() => techniquesData, [])

  const selectedTechnique = useMemo(
    () => techniques.find(t => t.id === selectedTechniqueId) || null,
    [selectedTechniqueId, techniques]
  )

  function handleSelectTechnique(id) {
    setSelectedTechniqueId(id)
    setView('detail')
  }

  function handleStartQuiz(mode = 'A') {
    setQuizMode(mode)
    setView('quiz')
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
        <span>Chargement…</span>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Sidebar
        currentView={view}
        onNavigate={setView}
        streak={streak}
        stats={getStats()}
      />
      <main className={styles.main}>
        {view === 'encyclopedia' && (
          <Encyclopedia
            techniques={techniques}
            progress={progress}
            onSelect={handleSelectTechnique}
            onStartQuiz={handleStartQuiz}
          />
        )}
        {view === 'detail' && selectedTechnique && (
          <TechniqueDetail
            technique={selectedTechnique}
            progress={progress[selectedTechnique.id]}
            onBack={() => setView('encyclopedia')}
            onStartQuiz={handleStartQuiz}
            allTechniques={techniques}
            onSelect={handleSelectTechnique}
          />
        )}
        {view === 'quiz' && (
          <Quiz
            techniques={techniques}
            progress={progress}
            mode={quizMode}
            updateProgress={updateProgress}
            onBack={() => setView('encyclopedia')}
          />
        )}
        {view === 'dashboard' && (
          <Dashboard
            techniques={techniques}
            progress={progress}
            streak={streak}
            stats={getStats()}
            onNavigate={setView}
            onSelectTechnique={handleSelectTechnique}
          />
        )}
      </main>
    </div>
  )
}

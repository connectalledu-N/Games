import { useState } from 'react'
import { AppProvider, useApp } from './store'
import ModeSelect from './pages/ModeSelect'
import DailySchedule from './pages/DailySchedule'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import MathSubject from './pages/MathSubject'
import SpellingSubject from './pages/SpellingSubject'
import GeographySubject from './pages/GeographySubject'
import MythologySubject from './pages/MythologySubject'
import ScienceSubject from './pages/ScienceSubject'
import CraftSubject from './pages/CraftSubject'
import LabyrinthGame from './pages/LabyrinthGame'

function AppInner() {
  const { mode, setMode } = useApp()
  const [subject, setSubject] = useState(null)
  const [gameLevel, setGameLevel] = useState(0)   // which level to start the game at
  const [freeExplore, setFreeExplore] = useState(false)

  if (!mode) return <ModeSelect />

  if (mode === 'teacher') {
    return <TeacherDashboard onBack={() => setMode(null)} />
  }

  // Student subject routing
  const backToSchedule = () => setSubject(null)

  if (subject === 'math')      return <MathSubject      onBack={backToSchedule} />
  if (subject === 'spelling')  return <SpellingSubject  onBack={backToSchedule} />
  if (subject === 'geography') return <GeographySubject onBack={backToSchedule} />
  if (subject === 'mythology') return <MythologySubject onBack={backToSchedule} />
  if (subject === 'science')   return <ScienceSubject   onBack={backToSchedule} />
  if (subject === 'craft')     return <CraftSubject     onBack={backToSchedule} />
  if (subject === 'game')      return <LabyrinthGame    onBack={backToSchedule} startLevel={gameLevel} />

  const handleSubject = (s, level) => {
    if (s === 'game' && level !== undefined) setGameLevel(level)
    setSubject(s)
  }

  if (freeExplore) {
    return (
      <StudentDashboard
        onSubject={handleSubject}
        onBack={() => setFreeExplore(false)}
      />
    )
  }

  return (
    <DailySchedule
      onSubject={handleSubject}
      onFreeExplore={() => setFreeExplore(true)}
    />
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}

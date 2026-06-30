import { useState } from 'react'
import { AppProvider, useApp } from './store'
import ModeSelect from './pages/ModeSelect'
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

  if (!mode) return <ModeSelect />

  if (mode === 'teacher') {
    return <TeacherDashboard onBack={() => setMode(null)} />
  }

  // Student mode
  if (subject === 'math') return <MathSubject onBack={() => setSubject(null)} />
  if (subject === 'spelling') return <SpellingSubject onBack={() => setSubject(null)} />
  if (subject === 'geography') return <GeographySubject onBack={() => setSubject(null)} />
  if (subject === 'mythology') return <MythologySubject onBack={() => setSubject(null)} />
  if (subject === 'science') return <ScienceSubject onBack={() => setSubject(null)} />
  if (subject === 'craft') return <CraftSubject onBack={() => setSubject(null)} />
  if (subject === 'game') return <LabyrinthGame onBack={() => setSubject(null)} />

  return <StudentDashboard onSubject={setSubject} />
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}

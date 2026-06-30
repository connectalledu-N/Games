import { useApp } from '../store'
import Header from '../components/Header'

const SUBJECTS = [
  { id: 'math', label: 'Maths Quest', icon: '⚡', color: '#7EB8F7', bg: 'from-blue-900 to-blue-800', desc: 'Times tables · Operations · Decimals', badge: '4 quests' },
  { id: 'spelling', label: 'Spelling Scrolls', icon: '📜', color: '#F5A623', bg: 'from-yellow-900 to-yellow-800', desc: 'Silent letters · -tion/-sion · Homophones · Myth vocab', badge: '4 scrolls' },
  { id: 'geography', label: 'Geography Map', icon: '🗺️', color: '#1FB8A0', bg: 'from-teal-900 to-teal-800', desc: 'Ancient Greece · Modern Greece · Percy\'s Journey', badge: '3 maps' },
  { id: 'mythology', label: 'Myth Academy', icon: '🏛️', color: '#9B72CF', bg: 'from-purple-900 to-purple-800', desc: 'Gods · Greek vs Roman · Great Myths', badge: '3 quizzes + God Cards' },
  { id: 'science', label: 'Science Lab', icon: '🔬', color: '#4ade80', bg: 'from-green-900 to-green-800', desc: 'Zeus & Weather · Poseidon & Oceans · Constellations', badge: '3 labs' },
  { id: 'craft', label: 'Craft Workshop', icon: '🎨', color: '#F472B6', bg: 'from-pink-900 to-pink-800', desc: 'Camp map · Shield · Comic · Diorama', badge: '4 projects' },
  { id: 'game', label: 'Quest Runner', icon: '🎮', color: '#FB923C', bg: 'from-orange-900 to-orange-800', desc: 'Side-scrolling runner · Jump · Dodge · Quiz mode', badge: 'Mini game' },
]

export default function StudentDashboard({ onSubject }) {
  const { studentName, drachmas, completed } = useApp()

  const totalActivities = 19
  const completedCount = Object.keys(completed).length
  const pct = Math.round((completedCount / totalActivities) * 100)

  const getCabinRank = () => {
    if (drachmas >= 500) return { rank: 'Legend of Olympus', icon: '🏆' }
    if (drachmas >= 300) return { rank: 'Champion Demigod', icon: '⚔️' }
    if (drachmas >= 150) return { rank: 'Quest Hero', icon: '🗡️' }
    if (drachmas >= 50) return { rank: 'Young Camper', icon: '🏕️' }
    return { rank: 'New Arrival', icon: '🌱' }
  }

  const { rank, icon } = getCabinRank()

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero banner */}
      <div className="px-4 py-6" style={{ background: 'linear-gradient(180deg, #0D2137 0%, #0A1628 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Welcome back,</p>
              <h1 className="font-cinzel text-2xl text-white font-bold">{studentName || 'Demigod'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">{icon}</span>
                <span className="text-sm text-yellow-400">{rank}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="drachma-coin text-base">🪙 {drachmas} drachmas</div>
            </div>
          </div>

          {/* Overall progress */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Quest Progress</span>
              <span className="text-teal-400">{completedCount}/{totalActivities} complete</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Subject grid */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="font-cinzel text-lg text-gray-300 mb-4">Choose your quest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SUBJECTS.map(s => {
            const subjectCompleted = Object.keys(completed).filter(k => k.startsWith(s.id)).length
            return (
              <button
                key={s.id}
                onClick={() => onSubject(s.id)}
                className={`card-hover rounded-2xl p-5 text-left bg-gradient-to-br ${s.bg} border border-white/10`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{s.icon}</span>
                  <span className="text-xs px-2 py-1 rounded-full text-white/60 bg-white/10">{s.badge}</span>
                </div>
                <div className="font-cinzel font-semibold text-base mb-1" style={{ color: s.color }}>{s.label}</div>
                <div className="text-xs text-gray-400 mb-3">{s.desc}</div>
                {subjectCompleted > 0 && (
                  <div className="text-xs text-green-400">✓ {subjectCompleted} completed</div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

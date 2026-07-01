import { useState } from 'react'
import { useApp } from '../store'
import Header from '../components/Header'
import { DAILY_PLAN, TRIAL_TASKS } from '../data/dailyPlan'

// Teacher prep notes per task id — what to have ready
const PREP = {
  'myth-olympians':             { prep: 'No materials needed — digital god cards are in the app' },
  'game-level-1':               { prep: 'Device with internet connection' },
  'game-level-2':               { prep: 'Device with internet connection' },
  'game-level-3':               { prep: 'Device with internet connection' },
  'spelling-silent-letters':    { prep: 'No extra materials needed' },
  'math-tables':                { prep: 'Pencil & paper for working out · Optional: printed ×6/×7 grid to check answers afterwards' },
  'geo-greece-places':          { prep: 'Optional: atlas or printed map of ancient Greece to look at alongside the app' },
  'math-operations':            { prep: 'Pencil & paper for multi-step working out' },
  'spelling-tion-sion':         { prep: 'No extra materials needed' },
  'sci-weather-zeus':           { prep: 'Optional: globe or weather chart to discuss cloud types & storms in real life' },
  'myth-greek-roman':           { prep: 'No extra materials needed — comparison table is built into the app' },
  'geo-ancient-modern':         { prep: 'Optional: printed side-by-side map of ancient vs modern Greece' },
  'math-division':              { prep: 'Pencil & paper · Optional: small counters or cubes for visual division if needed' },
  'spelling-homophones':        { prep: 'No extra materials needed · Optional: small whiteboard to write word pairs' },
  'sci-ocean-poseidon':         { prep: 'Optional: globe to point out the five oceans · Blue tray + water for hands-on demo if wanted' },
  'geo-percy-journey':          { prep: 'Optional: printed US/New York map to trace Percy\'s real-world locations' },
  'myth-myths':                 { prep: 'No extra materials needed' },
  'math-decimals':              { prep: 'Pencil & paper · Optional: ruler to show tenths visually on a number line' },
  'spelling-mythology-vocab':   { prep: 'No extra materials needed' },
  'sci-constellations':         { prep: 'Optional: printed star chart · Plan a night-sky viewing session if possible!' },
  'craft-camp-map':             { prep: '🎨 CRAFT — Get ready: A3 or A4 paper, pencils, coloured pens or crayons, ruler, eraser. Optional: watercolour paints, green/blue paper for cutting and sticking, gold pen for Percy\'s cabin' },
}

const SUBJECT_COLOR = {
  math: '#7EB8F7', spelling: '#F5A623', geography: '#1FB8A0',
  mythology: '#9B72CF', science: '#4ade80', craft: '#F472B6', game: '#FB923C',
}

const ACTIVITY_MAP = {
  'math-tables':             { label: 'Maths: Times Tables',        subject: 'Maths',     icon: '⚡' },
  'math-operations':         { label: 'Maths: Operations',          subject: 'Maths',     icon: '🏛️' },
  'math-division':           { label: 'Maths: Division',            subject: 'Maths',     icon: '🗡️' },
  'math-decimals':           { label: 'Maths: Decimals',            subject: 'Maths',     icon: '🌊' },
  'spelling-silent-letters': { label: 'Spelling: Silent Letters',   subject: 'English',   icon: '📜' },
  'spelling-tion-sion':      { label: 'Spelling: -tion/-sion',      subject: 'English',   icon: '✨' },
  'spelling-homophones':     { label: 'Spelling: Homophones',       subject: 'English',   icon: '🌀' },
  'spelling-mythology-vocab':{ label: 'Spelling: Myth Vocab',       subject: 'English',   icon: '🏺' },
  'geo-greece-places':       { label: 'Geography: Ancient Greece',  subject: 'Geography', icon: '🗺️' },
  'geo-ancient-modern':      { label: 'Geography: Anc vs Modern',   subject: 'Geography', icon: '⏳' },
  'geo-percy-journey':       { label: 'Geography: Percy\'s Map',    subject: 'Geography', icon: '🧭' },
  'myth-olympians':          { label: 'Mythology: The Olympians',   subject: 'Mythology', icon: '🏛️' },
  'myth-greek-roman':        { label: 'Mythology: Greek/Roman',     subject: 'Mythology', icon: '🏺' },
  'myth-myths':              { label: 'Mythology: Great Myths',     subject: 'Mythology', icon: '📖' },
  'sci-weather-zeus':        { label: 'Science: Zeus & Weather',    subject: 'Science',   icon: '⚡' },
  'sci-ocean-poseidon':      { label: 'Science: Poseidon & Oceans', subject: 'Science',   icon: '🌊' },
  'sci-constellations':      { label: 'Science: Constellations',    subject: 'Science',   icon: '⭐' },
}

const SUBJECT_COLORS = {
  'Maths': '#7EB8F7', 'English': '#F5A623', 'Geography': '#1FB8A0',
  'Mythology': '#9B72CF', 'Science': '#4ade80',
}

function fmtDate(isoDate, offsetDays = 0) {
  if (!isoDate) return null
  const d = new Date(isoDate)
  d.setDate(d.getDate() + offsetDays)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function TeacherDashboard({ onBack }) {
  const { completed, drachmas, studentName, startDate, setStartDate, resetProgress, getCurrentDay } = useApp()
  const [dateInput, setDateInput] = useState(startDate || '')
  const [dateSaved, setDateSaved] = useState(false)
  const [openDay, setOpenDay] = useState('trial')

  const handleSaveDate = () => {
    if (!dateInput) return
    setStartDate(dateInput)
    setDateSaved(true)
    setTimeout(() => setDateSaved(false), 2000)
  }

  const currentDay = getCurrentDay()

  const bySubject = {}
  Object.entries(ACTIVITY_MAP).forEach(([id, info]) => {
    if (!bySubject[info.subject]) bySubject[info.subject] = { total: 0, done: 0, activities: [] }
    bySubject[info.subject].total++
    if (completed[id]) {
      bySubject[info.subject].done++
      bySubject[info.subject].activities.push({ id, ...info, result: completed[id] })
    }
  })
  const totalDone = Object.keys(completed).length
  const totalActivities = Object.keys(ACTIVITY_MAP).length

  const allDays = [
    { key: 'trial', label: 'Trial Day', emoji: '🌱', theme: 'Warm-up & Explore', date: fmtDate(startDate, -1), tasks: TRIAL_TASKS, isTrialDay: true },
    ...DAILY_PLAN.map(d => ({ key: `day-${d.day}`, label: `Day ${d.day}`, emoji: d.emoji, theme: d.theme, date: fmtDate(startDate, d.day - 1), tasks: d.tasks, dayNum: d.day })),
  ]

  return (
    <div className="min-h-screen">
      <Header onBack={onBack} title="Teacher Dashboard" />
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Challenge settings */}
        <div className="rounded-xl p-4 mb-6" style={{ background: '#0D2137' }}>
          <h2 className="font-cinzel text-base text-yellow-400 mb-3">⚡ Challenge Settings</h2>
          <div className="mb-2">
            <label className="text-xs text-gray-400 block mb-1">Challenge Start Date (Day 1)</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateInput}
                onChange={e => setDateInput(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              />
              <button
                onClick={handleSaveDate}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: dateSaved ? '#1a5c3a' : '#1a3a5c', color: dateSaved ? '#4ade80' : '#7EB8F7' }}
              >
                {dateSaved ? '✓ Saved' : 'Set'}
              </button>
            </div>
            {startDate && (
              <div className="text-xs text-gray-400 mt-2">
                Status: <span className="text-white">
                  {currentDay === 0 ? 'Trial Day active'
                    : currentDay >= 1 && currentDay <= 4 ? `Day ${currentDay} of 4 active`
                    : currentDay > 4 ? 'Challenge complete ✓'
                    : 'Not started yet'}
                </span>
                {' · '}Ends {fmtDate(startDate, 3)}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl p-4 text-center" style={{ background: '#0D2137' }}>
            <div className="text-2xl font-bold text-yellow-400">{drachmas}</div>
            <div className="text-xs text-gray-400 mt-1">Drachmas</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#0D2137' }}>
            <div className="text-2xl font-bold text-teal-400">{totalDone}</div>
            <div className="text-xs text-gray-400 mt-1">Done</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#0D2137' }}>
            <div className="text-2xl font-bold text-white">{totalActivities}</div>
            <div className="text-xs text-gray-400 mt-1">Total</div>
          </div>
        </div>

        {studentName && (
          <div className="bg-white/5 rounded-xl p-3 mb-5 text-sm">
            <span className="text-gray-400">Student: </span>
            <span className="text-white font-semibold">{studentName}</span>
          </div>
        )}

        {/* ── Day-by-day prep planner ── */}
        <h2 className="font-cinzel text-base text-gray-300 mb-3">Daily Prep Planner</h2>
        <p className="text-xs text-gray-500 mb-4">Tap a day to see what's needed and what materials to prepare.</p>
        <div className="flex flex-col gap-3 mb-8">
          {allDays.map(day => {
            const isOpen = openDay === day.key
            const isToday = (day.isTrialDay && currentDay === 0) || (!day.isTrialDay && day.dayNum === currentDay)
            const dayDone = day.tasks.filter(t => !t.isGame && completed[t.id]).length
            const dayTotal = day.tasks.filter(t => !t.isGame).length
            const hasCraft = day.tasks.some(t => t.subject === 'craft')
            const totalMins = day.tasks.reduce((s, t) => s + t.minutes, 0)

            return (
              <div key={day.key} className="rounded-xl overflow-hidden border border-white/10"
                style={{ background: '#0D2137' }}>

                <button
                  className="w-full text-left px-4 py-3 flex items-center gap-3"
                  onClick={() => setOpenDay(isOpen ? null : day.key)}
                >
                  <span className="text-xl shrink-0">{day.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-cinzel text-sm font-bold text-white">{day.label}</span>
                      {day.date && <span className="text-xs text-gray-500">{day.date}</span>}
                      {isToday && <span className="text-xs bg-teal-900 text-teal-300 px-2 py-0.5 rounded-full">TODAY</span>}
                      {hasCraft && <span className="text-xs bg-pink-900/60 text-pink-300 px-2 py-0.5 rounded-full">🎨 Craft</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{day.theme} · ~{totalMins} min</div>
                  </div>
                  <div className="text-right shrink-0">
                    {!day.isTrialDay && (
                      <div className="text-xs text-gray-500">{dayDone}/{dayTotal} done</div>
                    )}
                    <div className="text-gray-600 text-xs mt-1">{isOpen ? '▲' : '▼'}</div>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/10">
                    {day.isTrialDay && (
                      <div className="px-4 py-2 text-xs text-gray-500 italic border-b border-white/5">
                        Optional warm-up — no penalties, no pressure
                      </div>
                    )}
                    {day.tasks.map(task => {
                      const done = !!completed[task.id]
                      const prep = PREP[task.id]
                      const color = SUBJECT_COLOR[task.subject] || '#888'
                      const isCraft = task.subject === 'craft'

                      return (
                        <div key={task.id}
                          className={`px-4 py-3 border-t border-white/5 ${isCraft ? 'bg-pink-950/20' : ''}`}>
                          <div className="flex items-start gap-3">
                            <span className="text-lg shrink-0 mt-0.5">{task.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold" style={{ color }}>{task.label}</span>
                                {done && <span className="text-xs text-green-400">✓ Completed</span>}
                                <span className="text-xs text-gray-600">~{task.minutes} min</span>
                              </div>
                              {prep && (
                                <div className={`mt-1.5 text-xs rounded-lg px-3 py-2 leading-relaxed ${
                                  isCraft
                                    ? 'bg-pink-900/30 text-pink-200 border border-pink-800/40'
                                    : 'bg-white/5 text-gray-400'
                                }`}>
                                  {isCraft && <span className="font-semibold text-pink-300 block mb-1">Materials needed:</span>}
                                  {prep.prep}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress by subject */}
        <h2 className="font-cinzel text-base text-gray-300 mb-4">Progress by Subject</h2>
        <div className="flex flex-col gap-4 mb-8">
          {Object.entries(bySubject).map(([subject, data]) => (
            <div key={subject} className="rounded-xl p-4" style={{ background: '#0D2137' }}>
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-sm" style={{ color: SUBJECT_COLORS[subject] }}>{subject}</div>
                <div className="text-xs text-gray-400">{data.done}/{data.total} done</div>
              </div>
              <div className="progress-bar mb-3">
                <div className="progress-fill" style={{ width: `${(data.done / data.total) * 100}%` }} />
              </div>
              {data.activities.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {data.activities.map(a => (
                    <div key={a.id} className="flex justify-between text-xs text-gray-400 py-1 border-t border-white/5">
                      <span>{a.icon} {a.label}</span>
                      <span className="text-green-400">{a.result.score}/{a.result.total} · {a.result.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-600">No activities completed yet</div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => { if (confirm('Reset ALL progress and drachmas? This cannot be undone.')) resetProgress() }}
          className="w-full bg-red-900/50 hover:bg-red-900/80 border border-red-700/40 text-red-400 py-3 rounded-xl text-sm transition-colors"
        >
          Reset All Progress
        </button>
      </div>
    </div>
  )
}

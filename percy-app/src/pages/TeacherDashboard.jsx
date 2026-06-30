import { useState } from 'react'
import { useApp } from '../store'
import Header from '../components/Header'
import { DAILY_PLAN } from '../data/dailyPlan'

const ACTIVITY_MAP = {
  'math-tables': { label: 'Maths: Times Tables', subject: 'Maths', icon: '⚡' },
  'math-operations': { label: 'Maths: Operations on Olympus', subject: 'Maths', icon: '🏛️' },
  'math-division': { label: 'Maths: Division Dungeon', subject: 'Maths', icon: '🗡️' },
  'math-decimals': { label: 'Maths: Decimal Depths', subject: 'Maths', icon: '🌊' },
  'spelling-silent-letters': { label: 'Spelling: Silent Letters', subject: 'English', icon: '📜' },
  'spelling-tion-sion': { label: 'Spelling: -tion / -sion', subject: 'English', icon: '✨' },
  'spelling-homophones': { label: 'Spelling: Homophones', subject: 'English', icon: '🌀' },
  'spelling-mythology-vocab': { label: 'Spelling: Myth Vocabulary', subject: 'English', icon: '🏺' },
  'geo-greece-places': { label: 'Geography: Map of Ancient Greece', subject: 'Geography', icon: '🗺️' },
  'geo-ancient-modern': { label: 'Geography: Ancient vs Modern', subject: 'Geography', icon: '⏳' },
  'geo-percy-journey': { label: 'Geography: Percy\'s Quest Map', subject: 'Geography', icon: '🧭' },
  'myth-olympians': { label: 'Mythology: Know Your Gods', subject: 'Mythology', icon: '🏛️' },
  'myth-greek-roman': { label: 'Mythology: Greek vs Roman Names', subject: 'Mythology', icon: '🏺' },
  'myth-myths': { label: 'Mythology: Great Myths', subject: 'Mythology', icon: '📖' },
  'sci-weather-zeus': { label: 'Science: Zeus & Weather', subject: 'Science', icon: '⚡' },
  'sci-ocean-poseidon': { label: 'Science: Poseidon & Oceans', subject: 'Science', icon: '🌊' },
  'sci-constellations': { label: 'Science: Stars & Constellations', subject: 'Science', icon: '⭐' },
}

const SUBJECT_COLORS = {
  'Maths': '#7EB8F7',
  'English': '#F5A623',
  'Geography': '#1FB8A0',
  'Mythology': '#9B72CF',
  'Science': '#4ade80',
}

export default function TeacherDashboard({ onBack }) {
  const { completed, drachmas, studentName, startDate, setStartDate, resetProgress, getCurrentDay } = useApp()
  const [dateInput, setDateInput] = useState(startDate || '')
  const [dateSaved, setDateSaved] = useState(false)

  const handleSaveDate = () => {
    if (!dateInput) return
    setStartDate(dateInput)
    setDateSaved(true)
    setTimeout(() => setDateSaved(false), 2000)
  }

  const currentDay = getCurrentDay()

  const completedIds = Object.keys(completed)
  const bySubject = {}
  Object.entries(ACTIVITY_MAP).forEach(([id, info]) => {
    if (!bySubject[info.subject]) bySubject[info.subject] = { total: 0, done: 0, activities: [] }
    bySubject[info.subject].total++
    if (completed[id]) {
      bySubject[info.subject].done++
      bySubject[info.subject].activities.push({ id, ...info, result: completed[id] })
    }
  })

  const totalDone = completedIds.length
  const totalActivities = Object.keys(ACTIVITY_MAP).length

  return (
    <div className="min-h-screen">
      <Header onBack={onBack} title="Teacher Dashboard" />
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* 3-day challenge setup */}
        <div className="rounded-xl p-4 mb-6" style={{ background: '#0D2137' }}>
          <h2 className="font-cinzel text-base text-yellow-400 mb-3">⚡ 3-Day Challenge Settings</h2>

          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-1">Challenge Start Date</label>
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
                Current: Day {currentDay !== null && currentDay >= 1 && currentDay <= 3
                  ? currentDay
                  : currentDay !== null && currentDay > 3 ? '3 (complete)' : '—'
                } of 3 · Ends {(() => {
                  const d = new Date(startDate)
                  d.setDate(d.getDate() + 2)
                  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                })()}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-3">
            <div className="text-xs text-gray-500 mb-2">Daily task plan:</div>
            {DAILY_PLAN.map(d => (
              <div key={d.day} className="text-xs text-gray-400 mb-1">
                <span className="text-white font-semibold">Day {d.day}:</span>{' '}
                {d.tasks.filter(t => !t.isGame).map(t => t.label).join(' · ')}{' '}
                <span className="text-orange-400">+ {d.tasks.find(t => t.isGame)?.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl p-4 text-center" style={{ background: '#0D2137' }}>
            <div className="text-2xl font-bold text-yellow-400">{drachmas}</div>
            <div className="text-xs text-gray-400 mt-1">Drachmas</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#0D2137' }}>
            <div className="text-2xl font-bold text-teal-400">{totalDone}</div>
            <div className="text-xs text-gray-400 mt-1">Completed</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#0D2137' }}>
            <div className="text-2xl font-bold text-white">{totalActivities}</div>
            <div className="text-xs text-gray-400 mt-1">Total Activities</div>
          </div>
        </div>

        {/* Student name */}
        {studentName && (
          <div className="bg-white/5 rounded-xl p-3 mb-5 text-sm">
            <span className="text-gray-400">Student: </span>
            <span className="text-white font-semibold">{studentName}</span>
          </div>
        )}

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
              {data.activities.length > 0 && (
                <div className="flex flex-col gap-1">
                  {data.activities.map(a => (
                    <div key={a.id} className="flex justify-between text-xs text-gray-400 py-1 border-t border-white/5">
                      <span>{a.icon} {a.label.replace(`${subject}: `, '')}</span>
                      <span className="text-green-400">{a.result.score}/{a.result.total} · {a.result.date}</span>
                    </div>
                  ))}
                </div>
              )}
              {data.activities.length === 0 && (
                <div className="text-xs text-gray-600">No activities completed yet</div>
              )}
            </div>
          ))}
        </div>

        {/* Quick reference */}
        <h2 className="font-cinzel text-base text-gray-300 mb-4">What's in the App</h2>
        <div className="rounded-xl p-4 text-sm text-gray-400 leading-relaxed mb-6" style={{ background: '#0D2137' }}>
          <div className="grid grid-cols-1 gap-2">
            {[
              ['⚡ Maths', '4 quests: Times Tables (×6–9), Multi-step Operations, Division, Intro to Decimals'],
              ['📜 English', '4 scrolls: Silent Letters, -tion/-sion, Homophones, Mythology Vocabulary'],
              ['🗺️ Geography', '3 maps: Ancient Greek places, Ancient vs Modern, Percy\'s Quest Map'],
              ['🏛️ Mythology', 'God Cards (all 12 Olympians + Hades), 3 quizzes: Gods, Greek/Roman names, Great Myths'],
              ['🔬 Science', '3 labs (facts + quiz): Zeus/Weather, Poseidon/Oceans, Constellations'],
              ['🎨 Craft', '4 step-by-step guides: Camp Map, God Shield, Myth Comic, Cabin Diorama'],
            ].map(([s, d]) => (
              <div key={s}>
                <span className="text-white font-medium">{s}: </span>{d}
              </div>
            ))}
          </div>
        </div>

        {/* Reset */}
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

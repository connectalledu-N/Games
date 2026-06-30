import { useEffect, useState } from 'react'
import { useApp } from '../store'
import Header from '../components/Header'
import { DAILY_PLAN, MISS_PENALTY, GAME_UNLOCK_THRESHOLD } from '../data/dailyPlan'

// ── Timer widget ──────────────────────────────────────────────────────────────
function TaskTimer({ minutes, onDone }) {
  const [secs, setSecs] = useState(minutes * 60)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    if (secs <= 0) { onDone?.(); return }
    const t = setTimeout(() => setSecs(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [running, secs, onDone])

  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  const pct = ((minutes * 60 - secs) / (minutes * 60)) * 100

  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#1e3a5f" strokeWidth="3" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#1FB8A0" strokeWidth="3"
            strokeDasharray={`${pct * 0.942} 94.2`} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-teal-400 font-mono">{m}:{s}</span>
      </div>
      <button
        onClick={() => setRunning(r => !r)}
        className="text-xs px-3 py-1 rounded-full border border-teal-600 text-teal-400 hover:bg-teal-900/40 transition-colors"
      >
        {running ? 'Pause' : 'Start timer'}
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DailySchedule({ onSubject, onFreeExplore }) {
  const { completed, drachmas, studentName, startDate, penaltyApplied, getCurrentDay, applyDayPenalty, addDrachmas } = useApp()
  const [expandedTask, setExpandedTask] = useState(null)
  const [showPenalty, setShowPenalty] = useState(null)

  const currentDay = getCurrentDay()

  // ── Penalty check: apply once for any fully-missed past days ──────────────
  useEffect(() => {
    if (!startDate || currentDay === null) return

    // Check days 1 and 2 (day 3 only matters at end)
    for (let d = 1; d < Math.min(currentDay, 3); d++) {
      const key = `day-${d}`
      if (penaltyApplied[key]) continue
      const plan = DAILY_PLAN[d - 1]
      const nonGameTasks = plan.tasks.filter(t => !t.isGame)
      const doneTasks = nonGameTasks.filter(t => completed[t.id])
      // Missed = fewer than half done
      if (doneTasks.length < Math.ceil(nonGameTasks.length / 2)) {
        applyDayPenalty(key)
        setShowPenalty({ day: d, penalty: MISS_PENALTY })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, currentDay])

  // ── No start date yet ─────────────────────────────────────────────────────
  if (!startDate) {
    return (
      <div className="min-h-screen">
        <Header title="Percy Jackson Academy" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">⚡</div>
          <h1 className="font-cinzel text-2xl text-white mb-3">Waiting for Your Teacher</h1>
          <p className="text-gray-400 text-sm mb-8">
            Your teacher hasn't set the quest start date yet.<br />
            Ask them to open Teacher Mode and set it!
          </p>
          <button
            onClick={onFreeExplore}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-colors"
          >
            Explore freely while you wait →
          </button>
        </div>
      </div>
    )
  }

  // ── Before Day 1 ──────────────────────────────────────────────────────────
  if (currentDay < 1) {
    const start = new Date(startDate)
    return (
      <div className="min-h-screen">
        <Header title="Percy Jackson Academy" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">⏳</div>
          <h1 className="font-cinzel text-2xl text-white mb-3">Quest Starts Soon!</h1>
          <p className="text-gray-400 text-sm">
            Your 3-day challenge begins on{' '}
            <span className="text-yellow-400 font-semibold">
              {start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </p>
        </div>
      </div>
    )
  }

  // ── After Day 3 ───────────────────────────────────────────────────────────
  if (currentDay > 3) {
    const allDone = DAILY_PLAN.every(dayPlan =>
      dayPlan.tasks.filter(t => !t.isGame).every(t => completed[t.id])
    )
    return (
      <div className="min-h-screen">
        <Header title="Percy Jackson Academy" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">{allDone ? '🏆' : '🏁'}</div>
          <h1 className="font-cinzel text-2xl text-yellow-400 mb-3">
            {allDone ? 'Legend of Olympus!' : 'Quest Complete!'}
          </h1>
          <p className="text-gray-400 text-sm mb-4">
            {allDone
              ? 'You completed every quest in the 3-day challenge. Zeus is impressed!'
              : `You collected ${drachmas} drachmas over your 3-day challenge. Well done, demigod!`}
          </p>
          <div className="drachma-coin text-lg mb-8">🪙 {drachmas} total drachmas</div>
          <button
            onClick={onFreeExplore}
            className="px-6 py-3 rounded-xl border border-yellow-600 text-yellow-400 text-sm hover:bg-yellow-900/20 transition-colors"
          >
            Keep exploring →
          </button>
        </div>
      </div>
    )
  }

  // ── Active day ────────────────────────────────────────────────────────────
  const dayPlan = DAILY_PLAN[currentDay - 1]
  const tasks = dayPlan.tasks
  const nonGameTasks = tasks.filter(t => !t.isGame)
  const doneNonGame = nonGameTasks.filter(t => completed[t.id]).length
  const gameUnlocked = doneNonGame >= GAME_UNLOCK_THRESHOLD
  const allDoneToday = tasks.every(t => completed[t.id])
  const totalMins = tasks.reduce((s, t) => s + t.minutes, 0)
  const doneMins = tasks.filter(t => completed[t.id]).reduce((s, t) => s + t.minutes, 0)

  const SUBJECT_COLOR = {
    math: '#7EB8F7', spelling: '#F5A623', geography: '#1FB8A0',
    mythology: '#9B72CF', science: '#4ade80', craft: '#F472B6', game: '#FB923C',
  }

  return (
    <div className="min-h-screen">
      <Header title={`Day ${currentDay} of 3`} />

      {/* Penalty toast */}
      {showPenalty && (
        <div className="fixed inset-x-0 top-14 z-50 flex justify-center px-4">
          <div className="bg-red-900/90 border border-red-600 rounded-xl p-4 max-w-sm w-full text-center shadow-xl">
            <div className="text-2xl mb-1">😤</div>
            <div className="text-red-300 font-semibold text-sm">Day {showPenalty.day} tasks were missed!</div>
            <div className="text-red-400 text-xs mt-1">−{showPenalty.penalty} drachmas penalty</div>
            <button
              onClick={() => setShowPenalty(null)}
              className="mt-3 px-4 py-1 bg-red-800 rounded-full text-xs text-white"
            >
              Understood — I'll do better today
            </button>
          </div>
        </div>
      )}

      {/* Day header */}
      <div className="px-4 py-5" style={{ background: 'linear-gradient(180deg, #0D2137 0%, #0A1628 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Day {currentDay} · {dayPlan.emoji}</div>
              <h1 className="font-cinzel text-xl text-white font-bold">{dayPlan.theme}</h1>
              <p className="text-xs text-gray-500 mt-1 italic">{dayPlan.quote}</p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="drachma-coin text-sm">🪙 {drachmas}</div>
            </div>
          </div>

          {/* Time progress */}
          <div className="bg-white/5 rounded-xl p-3 mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Today's quests</span>
              <span className="text-teal-400">{doneMins}/{totalMins} min complete</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(doneMins / totalMins) * 100}%` }} />
            </div>
            {allDoneToday && (
              <div className="text-center text-xs text-yellow-400 mt-2 font-semibold">
                ✨ All today's quests complete! +20 bonus drachmas earned
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-3">

        {!gameUnlocked && (
          <div className="text-xs text-center text-gray-500 py-1">
            🔒 Game unlocks after {GAME_UNLOCK_THRESHOLD} quests done ({doneNonGame}/{GAME_UNLOCK_THRESHOLD} so far)
          </div>
        )}

        {tasks.map((task, i) => {
          const done = !!completed[task.id]
          const locked = task.isGame && !gameUnlocked
          const expanded = expandedTask === task.id
          const color = SUBJECT_COLOR[task.subject] || '#fff'

          return (
            <div
              key={task.id}
              className={`rounded-2xl border transition-all ${
                done
                  ? 'border-green-700/40 bg-green-950/30'
                  : locked
                  ? 'border-white/5 bg-white/2 opacity-60'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {/* Task header row */}
              <button
                className="w-full text-left px-4 py-3 flex items-center gap-3"
                onClick={() => !locked && setExpandedTask(expanded ? null : task.id)}
                disabled={locked}
              >
                <span className="text-2xl">{task.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">{task.label}</span>
                    {done && <span className="text-xs text-green-400">✓ Done</span>}
                    {locked && <span className="text-xs text-gray-600">🔒 Locked</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">~{task.minutes} min · {task.subject}</div>
                </div>
                {!done && !locked && (
                  <span className="text-gray-600 text-xs">{expanded ? '▲' : '▼'}</span>
                )}
              </button>

              {/* Expanded panel */}
              {expanded && !done && !locked && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3">
                  <TaskTimer minutes={task.minutes} />
                  <button
                    onClick={() => {
                      setExpandedTask(null)
                      onSubject(task.subject, task.isGame ? task.gameLevel : undefined)
                    }}
                    className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={{ background: color + '22', color, border: `1px solid ${color}44` }}
                  >
                    Start Quest →
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {/* Free explore link */}
        <button
          onClick={onFreeExplore}
          className="mt-2 text-xs text-gray-600 hover:text-gray-400 transition-colors text-center py-2"
        >
          Explore all subjects freely →
        </button>
      </div>
    </div>
  )
}

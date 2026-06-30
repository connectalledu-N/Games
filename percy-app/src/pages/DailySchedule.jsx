import { useEffect, useState } from 'react'
import { useApp } from '../store'
import Header from '../components/Header'
import { DAILY_PLAN, TRIAL_TASKS, MISS_PENALTY, GAME_UNLOCK_THRESHOLD } from '../data/dailyPlan'

// ── Soft countdown timer ──────────────────────────────────────────────────────
function TaskTimer({ minutes }) {
  const total = minutes * 60
  const [secs, setSecs] = useState(total)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running || secs <= 0) return
    const t = setTimeout(() => setSecs(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [running, secs])

  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  const pct = ((total - secs) / total) * 100

  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="relative w-10 h-10 shrink-0">
        <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#1e3a5f" strokeWidth="3" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#1FB8A0" strokeWidth="3"
            strokeDasharray={`${pct * 0.942} 94.2`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-teal-400 font-mono">{m}:{s}</span>
      </div>
      <button
        onClick={() => setRunning(r => !r)}
        className="text-xs px-3 py-1 rounded-full border border-teal-600 text-teal-400 hover:bg-teal-900/40 transition-colors"
      >
        {running ? 'Pause' : secs < total ? 'Resume' : 'Start timer'}
      </button>
      {secs === 0 && <span className="text-xs text-yellow-400">⏰ Time's up!</span>}
    </div>
  )
}

// ── Single task card ──────────────────────────────────────────────────────────
function TaskCard({ task, done, locked, expanded, onExpand, onStart, color }) {
  return (
    <div className={`rounded-2xl border transition-all ${
      done   ? 'border-green-700/40 bg-green-950/30' :
      locked ? 'border-white/5 bg-white/[0.02] opacity-50' :
               'border-white/10 bg-white/5'
    }`}>
      <button
        className="w-full text-left px-4 py-3 flex items-center gap-3"
        onClick={() => !locked && !done && onExpand()}
        disabled={locked}
      >
        <span className="text-2xl">{task.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white leading-tight">{task.label}</span>
            {done   && <span className="text-xs text-green-400 shrink-0">✓ Done</span>}
            {locked && <span className="text-xs text-gray-600 shrink-0">🔒 Locked</span>}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 capitalize">~{task.minutes} min · {task.subject}</div>
        </div>
        {!done && !locked && (
          <span className="text-gray-600 text-xs shrink-0">{expanded ? '▲' : '▼'}</span>
        )}
      </button>

      {expanded && !done && !locked && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3">
          <TaskTimer minutes={task.minutes} />
          <button
            onClick={onStart}
            className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: color + '22', color, border: `1px solid ${color}44` }}
          >
            Start Quest →
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DailySchedule({ onSubject, onFreeExplore }) {
  const { completed, drachmas, startDate, penaltyApplied, getCurrentDay, applyDayPenalty } = useApp()
  const [expandedTask, setExpandedTask] = useState(null)
  const [showPenalty, setShowPenalty] = useState(null)

  const currentDay = getCurrentDay()   // 1-based; 0 = trial day; <0 = before trial; >4 = done

  const SUBJECT_COLOR = {
    math: '#7EB8F7', spelling: '#F5A623', geography: '#1FB8A0',
    mythology: '#9B72CF', science: '#4ade80', craft: '#F472B6', game: '#FB923C',
  }

  // ── Penalty check for missed past days ───────────────────────────────────
  useEffect(() => {
    if (!startDate || currentDay === null || currentDay <= 1) return
    for (let d = 1; d < Math.min(currentDay, DAILY_PLAN.length + 1); d++) {
      const key = `day-${d}`
      if (penaltyApplied[key]) continue
      const plan = DAILY_PLAN[d - 1]
      const nonGame = plan.tasks.filter(t => !t.isGame)
      const done = nonGame.filter(t => completed[t.id]).length
      if (done < Math.ceil(nonGame.length / 2)) {
        applyDayPenalty(key)
        setShowPenalty({ day: d, penalty: MISS_PENALTY })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, currentDay])

  const handleStart = (task) => {
    setExpandedTask(null)
    onSubject(task.subject, task.isGame ? task.gameLevel : undefined)
  }

  // ── No start date set ────────────────────────────────────────────────────
  if (!startDate) {
    return (
      <div className="min-h-screen">
        <Header title="Percy Jackson Academy" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">⚡</div>
          <h1 className="font-cinzel text-2xl text-white mb-3">Waiting for Your Teacher</h1>
          <p className="text-gray-400 text-sm mb-8">
            Ask your teacher to open Teacher Mode and set the challenge start date!
          </p>
          <button onClick={onFreeExplore}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-colors">
            Explore freely while you wait →
          </button>
        </div>
      </div>
    )
  }

  // ── Trial day (currentDay === 0: the day before the challenge) ────────────
  if (currentDay === 0) {
    const startDisplay = new Date(startDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    return (
      <div className="min-h-screen">
        <Header title="Trial Day 🌱" />

        {/* Banner */}
        <div className="px-4 py-5" style={{ background: 'linear-gradient(180deg, #0D2137 0%, #0A1628 100%)' }}>
          <div className="max-w-2xl mx-auto">
            <div className="text-xs text-teal-400 uppercase tracking-wide mb-1">Today · Warm-up</div>
            <h1 className="font-cinzel text-xl text-white font-bold mb-1">Get a Feel for the Quest!</h1>
            <p className="text-gray-400 text-xs mb-3">
              Your 4-day challenge starts <span className="text-yellow-400 font-semibold">{startDisplay}</span>.
              Try these tasters — no pressure, no penalty. Just explore!
            </p>
            <div className="drachma-coin text-sm">🪙 {drachmas} drachmas</div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-3">
          <div className="text-xs text-gray-500 text-center mb-1">
            These are optional warm-ups — nothing is locked or penalised today
          </div>

          {TRIAL_TASKS.map(task => {
            const done = !!completed[task.id]
            const expanded = expandedTask === task.id
            const color = SUBJECT_COLOR[task.subject] || '#fff'
            return (
              <TaskCard
                key={task.id}
                task={task}
                done={done}
                locked={false}
                expanded={expanded}
                onExpand={() => setExpandedTask(expanded ? null : task.id)}
                onStart={() => handleStart(task)}
                color={color}
              />
            )
          })}

          <button onClick={onFreeExplore}
            className="mt-2 text-xs text-gray-600 hover:text-gray-400 transition-colors text-center py-2">
            Explore all subjects freely →
          </button>
        </div>
      </div>
    )
  }

  // ── Before trial day ──────────────────────────────────────────────────────
  if (currentDay < 0) {
    const start = new Date(startDate)
    return (
      <div className="min-h-screen">
        <Header title="Percy Jackson Academy" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">⏳</div>
          <h1 className="font-cinzel text-2xl text-white mb-3">Quest Starts Soon!</h1>
          <p className="text-gray-400 text-sm">
            Your challenge begins on{' '}
            <span className="text-yellow-400 font-semibold">
              {start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </p>
          <button onClick={onFreeExplore}
            className="mt-8 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-colors">
            Explore freely →
          </button>
        </div>
      </div>
    )
  }

  // ── After all days ────────────────────────────────────────────────────────
  if (currentDay > DAILY_PLAN.length) {
    const allDone = DAILY_PLAN.every(dp =>
      dp.tasks.filter(t => !t.isGame).every(t => completed[t.id])
    )
    return (
      <div className="min-h-screen">
        <Header title="Percy Jackson Academy" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">{allDone ? '🏆' : '🏁'}</div>
          <h1 className="font-cinzel text-2xl text-yellow-400 mb-3">
            {allDone ? 'Legend of Olympus!' : 'Challenge Complete!'}
          </h1>
          <p className="text-gray-400 text-sm mb-4">
            {allDone
              ? 'Every quest in the 4-day challenge is done. Zeus himself is impressed!'
              : `You earned ${drachmas} drachmas over the 4-day challenge. Well done, demigod!`}
          </p>
          <div className="drachma-coin text-lg mb-8">🪙 {drachmas} total drachmas</div>
          <button onClick={onFreeExplore}
            className="px-6 py-3 rounded-xl border border-yellow-600 text-yellow-400 text-sm hover:bg-yellow-900/20 transition-colors">
            Keep exploring →
          </button>
        </div>
      </div>
    )
  }

  // ── Active challenge day (1–4) ────────────────────────────────────────────
  const dayPlan = DAILY_PLAN[currentDay - 1]
  const tasks = dayPlan.tasks
  const nonGameTasks = tasks.filter(t => !t.isGame)
  const doneNonGame = nonGameTasks.filter(t => completed[t.id]).length
  const gameUnlocked = doneNonGame >= GAME_UNLOCK_THRESHOLD
  const allDoneToday = tasks.every(t => completed[t.id])
  const totalMins = tasks.reduce((s, t) => s + t.minutes, 0)
  const doneMins = tasks.filter(t => completed[t.id]).reduce((s, t) => s + t.minutes, 0)

  return (
    <div className="min-h-screen">
      <Header title={`Day ${currentDay} of ${DAILY_PLAN.length}`} />

      {/* Penalty toast */}
      {showPenalty && (
        <div className="fixed inset-x-0 top-14 z-50 flex justify-center px-4 animate-pulse-glow">
          <div className="bg-red-900/95 border border-red-600 rounded-xl p-4 max-w-sm w-full text-center shadow-xl">
            <div className="text-2xl mb-1">😤</div>
            <div className="text-red-300 font-semibold text-sm">Day {showPenalty.day} tasks were missed!</div>
            <div className="text-red-400 text-xs mt-1">−{showPenalty.penalty} drachmas deducted</div>
            <button onClick={() => setShowPenalty(null)}
              className="mt-3 px-4 py-1 bg-red-800 rounded-full text-xs text-white">
              I'll do better today ✊
            </button>
          </div>
        </div>
      )}

      {/* Day header */}
      <div className="px-4 py-5" style={{ background: 'linear-gradient(180deg, #0D2137 0%, #0A1628 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Day {currentDay} of {DAILY_PLAN.length} · {dayPlan.emoji}
              </div>
              <h1 className="font-cinzel text-xl text-white font-bold">{dayPlan.theme}</h1>
              <p className="text-xs text-gray-500 mt-1 italic">{dayPlan.quote}</p>
            </div>
            <div className="shrink-0 ml-4 text-right">
              <div className="drachma-coin text-sm">🪙 {drachmas}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white/5 rounded-xl p-3 mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Today's quests</span>
              <span className="text-teal-400">{doneMins}/{totalMins} min</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(doneMins / totalMins) * 100}%` }} />
            </div>
            {allDoneToday && (
              <div className="text-center text-xs text-yellow-400 mt-2 font-semibold">
                ✨ All quests done today — amazing work!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-3">
        {!gameUnlocked && (
          <div className="text-xs text-center text-gray-500 py-1">
            🔒 Game unlocks after {GAME_UNLOCK_THRESHOLD} quests done ({doneNonGame}/{GAME_UNLOCK_THRESHOLD} so far)
          </div>
        )}

        {tasks.map(task => {
          const done = !!completed[task.id]
          const locked = task.isGame && !gameUnlocked
          const expanded = expandedTask === task.id
          const color = SUBJECT_COLOR[task.subject] || '#fff'
          return (
            <TaskCard
              key={task.id}
              task={task}
              done={done}
              locked={locked}
              expanded={expanded}
              onExpand={() => setExpandedTask(expanded ? null : task.id)}
              onStart={() => handleStart(task)}
              color={color}
            />
          )
        })}

        <button onClick={onFreeExplore}
          className="mt-2 text-xs text-gray-600 hover:text-gray-400 transition-colors text-center py-2">
          Explore all subjects freely →
        </button>
      </div>
    </div>
  )
}

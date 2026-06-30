import { useEffect, useRef, useState, useCallback } from 'react'
import { useApp } from '../store'
import Header from '../components/Header'

const W = 800
const H = 300
const GROUND = H - 60
const GRAVITY = 0.6
const JUMP_V = -13
const SPEED_INIT = 4
const SPEED_MAX = 9

const QUIZ_QUESTIONS = [
  { q: '7 × 8 = ?', a: '56' },
  { q: '9 × 6 = ?', a: '54' },
  { q: 'Zeus\'s weapon?', a: 'bolt', options: ['bolt', 'trident', 'hammer', 'sword'] },
  { q: 'Poseidon\'s Roman name?', a: 'neptune', options: ['neptune', 'mars', 'pluto', 'vulcan'] },
  { q: '48 ÷ 6 = ?', a: '8' },
  { q: '63 ÷ 7 = ?', a: '9' },
  { q: 'Annabeth\'s mother?', a: 'athena', options: ['athena', 'artemis', 'aphrodite', 'demeter'] },
  { q: '8 × 9 = ?', a: '72' },
  { q: 'Percy\'s sword is called?', a: 'riptide', options: ['riptide', 'anaklusmos', 'riptide', 'both'] },
  { q: '6 × 7 = ?', a: '42' },
  { q: 'How many Olympians?', a: '12', options: ['10', '11', '12', '13'] },
  { q: '324 ÷ 4 = ?', a: '81' },
]

const MONSTERS = [
  { name: 'Minotaur', emoji: '🐂', hp: 1 },
  { name: 'Hellhound', emoji: '🐕', hp: 1 },
  { name: 'Fury', emoji: '🦇', hp: 1 },
  { name: 'Drakon', emoji: '🐉', hp: 2 },
  { name: 'Cyclops', emoji: '👁️', hp: 2 },
]

function useGame(mode) {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)
  const rafRef = useRef(null)
  const [gameState, setGameState] = useState('idle') // idle | playing | quiz | dead | win
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [currentQ, setCurrentQ] = useState(null)
  const [quizInput, setQuizInput] = useState('')
  const [quizFeedback, setQuizFeedback] = useState(null)
  const { addDrachmas } = useApp()

  const initState = useCallback(() => ({
    percy: { x: 80, y: GROUND, vy: 0, onGround: true, frame: 0, invincible: 0, shield: false },
    obstacles: [],
    coins: [],
    bg: [],
    tick: 0,
    speed: SPEED_INIT,
    score: 0,
    lives: 3,
    pausedForQuiz: false,
    quizMonster: null,
  }), [])

  const spawnObstacle = (s) => {
    const m = MONSTERS[Math.floor(Math.random() * MONSTERS.length)]
    s.obstacles.push({
      x: W + 20,
      y: GROUND - (m.hp === 2 ? 60 : 0),
      w: 50, h: m.hp === 2 ? 80 : 50,
      emoji: m.emoji,
      name: m.name,
      hp: m.hp,
      maxHp: m.hp,
    })
  }

  const spawnCoin = (s) => {
    s.coins.push({
      x: W + 20,
      y: GROUND - 40 - Math.random() * 60,
      collected: false,
    })
  }

  const draw = useCallback((ctx, s) => {
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, '#0A1628')
    sky.addColorStop(1, '#0D2137')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 137 + s.tick * 0.2) % W)
      const sy = (i * 47) % (H - 80)
      ctx.fillRect(sx, sy, 1, 1)
    }

    // Ground
    const grd = ctx.createLinearGradient(0, GROUND, 0, H)
    grd.addColorStop(0, '#1B4332')
    grd.addColorStop(1, '#0A2318')
    ctx.fillStyle = grd
    ctx.fillRect(0, GROUND, W, H - GROUND)

    // Ground line
    ctx.strokeStyle = '#2D6A4F'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, GROUND)
    ctx.lineTo(W, GROUND)
    ctx.stroke()

    // Coins
    s.coins.forEach(c => {
      if (!c.collected) {
        ctx.font = '20px serif'
        ctx.fillText('🪙', c.x - 10, c.y)
      }
    })

    // Obstacles
    s.obstacles.forEach(o => {
      ctx.font = `${o.h * 0.7}px serif`
      ctx.fillText(o.emoji, o.x - 15, o.y + o.h * 0.8)
      // HP bar for tough monsters
      if (o.maxHp > 1) {
        ctx.fillStyle = '#ef4444'
        ctx.fillRect(o.x - 15, o.y - 10, 40, 5)
        ctx.fillStyle = '#4ade80'
        ctx.fillRect(o.x - 15, o.y - 10, 40 * (o.hp / o.maxHp), 5)
      }
    })

    // Percy
    const p = s.percy
    const flash = p.invincible > 0 && Math.floor(p.invincible / 4) % 2 === 0
    if (!flash) {
      ctx.font = '44px serif'
      ctx.fillText('🏃', p.x - 22, p.y + 44)
      if (p.shield) {
        ctx.font = '28px serif'
        ctx.fillText('🛡️', p.x + 10, p.y + 20)
      }
    }

    // HUD
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(0, 0, W, 36)
    ctx.fillStyle = '#F5A623'
    ctx.font = 'bold 14px Inter, sans-serif'
    ctx.fillText(`⚡ ${s.score}m`, 10, 22)
    ctx.fillText('❤️'.repeat(s.lives), W / 2 - 30, 22)
    ctx.fillStyle = '#7EB8F7'
    ctx.fillText(`Speed: ${s.speed.toFixed(1)}x`, W - 90, 22)
  }, [])

  const startGame = useCallback(() => {
    const s = initState()
    stateRef.current = s
    setGameState('playing')
    setScore(0)
    setLives(3)
  }, [initState])

  const jump = useCallback(() => {
    const s = stateRef.current
    if (!s || s.pausedForQuiz) return
    if (s.percy.onGround) {
      s.percy.vy = JUMP_V
      s.percy.onGround = false
    }
  }, [])

  const triggerQuiz = useCallback((monster) => {
    const s = stateRef.current
    if (!s) return
    s.pausedForQuiz = true
    s.quizMonster = monster
    const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)]
    setCurrentQ(q)
    setQuizInput('')
    setQuizFeedback(null)
    setGameState('quiz')
  }, [])

  const answerQuiz = useCallback((answer) => {
    const s = stateRef.current
    if (!s || !currentQ) return
    const correct = answer.toLowerCase().trim() === currentQ.a.toLowerCase()
    if (correct) {
      setQuizFeedback('correct')
      // Remove monster
      s.obstacles = s.obstacles.filter(o => o !== s.quizMonster)
      s.score += 50
      setScore(s.score)
      setTimeout(() => {
        s.pausedForQuiz = false
        s.quizMonster = null
        setCurrentQ(null)
        setQuizFeedback(null)
        setGameState('playing')
      }, 800)
    } else {
      setQuizFeedback('wrong')
      s.percy.invincible = 60
      s.lives = Math.max(0, s.lives - 1)
      setLives(s.lives)
      setTimeout(() => {
        if (s.lives <= 0) {
          setGameState('dead')
          cancelAnimationFrame(rafRef.current)
        } else {
          s.pausedForQuiz = false
          s.quizMonster = null
          // Push monster back so player has time
          if (s.quizMonster) s.quizMonster.x = W * 0.7
          setCurrentQ(null)
          setQuizFeedback(null)
          setGameState('playing')
        }
      }, 800)
    }
  }, [currentQ])

  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'quiz') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const loop = () => {
      const s = stateRef.current
      if (!s) return

      if (!s.pausedForQuiz) {
        s.tick++
        s.speed = Math.min(SPEED_MAX, SPEED_INIT + s.tick / 600)
        s.score = Math.floor(s.tick / 6)
        setScore(s.score)

        // Percy physics
        const p = s.percy
        p.vy += GRAVITY
        p.y += p.vy
        if (p.y >= GROUND) { p.y = GROUND; p.vy = 0; p.onGround = true }
        if (p.invincible > 0) p.invincible--

        // Spawn
        if (s.tick % Math.max(60, 120 - s.tick / 40) === 0) spawnObstacle(s)
        if (s.tick % 80 === 30) spawnCoin(s)

        // Move obstacles
        s.obstacles.forEach(o => { o.x -= s.speed })
        s.coins.forEach(c => { c.x -= s.speed })

        // Collect coins
        s.coins.forEach(c => {
          if (!c.collected && Math.abs(c.x - p.x) < 30 && Math.abs(c.y - (p.y + 20)) < 40) {
            c.collected = true
            s.score += 10
            addDrachmas(1)
          }
        })

        // Collision with obstacles
        if (p.invincible === 0) {
          s.obstacles.forEach(o => {
            if (o.x < p.x + 30 && o.x + o.w > p.x + 10 && o.y < p.y + 44 && o.y + o.h > p.y + 5) {
              if (mode === 'quiz') {
                triggerQuiz(o)
              } else {
                p.invincible = 80
                s.lives--
                setLives(s.lives)
                if (s.lives <= 0) {
                  setGameState('dead')
                  cancelAnimationFrame(rafRef.current)
                  return
                }
              }
            }
          })
        }

        // Cleanup offscreen
        s.obstacles = s.obstacles.filter(o => o.x > -60)
        s.coins = s.coins.filter(c => c.x > -30)

        // Win at 2000m
        if (s.score >= 2000) {
          addDrachmas(100)
          setGameState('win')
          cancelAnimationFrame(rafRef.current)
          return
        }
      }

      draw(ctx, s)
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [gameState, mode, draw, triggerQuiz, addDrachmas])

  return { canvasRef, gameState, score, lives, currentQ, quizInput, setQuizInput, quizFeedback, startGame, jump, answerQuiz }
}

export default function QuestRunner({ onBack }) {
  const [mode, setMode] = useState(null) // null | 'run' | 'quiz'
  const { canvasRef, gameState, score, lives, currentQ, quizInput, setQuizInput, quizFeedback, startGame, jump, answerQuiz } = useGame(mode)
  const { addDrachmas } = useApp()

  useEffect(() => {
    const onKey = (e) => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jump])

  if (!mode) {
    return (
      <div className="min-h-screen">
        <Header onBack={onBack} title="Quest Runner" />
        <div className="max-w-xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4 float-anim">🏃</div>
          <h2 className="font-cinzel text-2xl text-yellow-400 mb-2">Quest Runner</h2>
          <p className="text-gray-400 mb-10">Help Percy run through Camp Half-Blood, dodge monsters and collect drachmas!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => { setMode('run'); setTimeout(startGame, 50) }}
              className="card-hover rounded-2xl p-6 border border-teal-600/40 text-left"
              style={{ background: 'linear-gradient(135deg, #0D2137, #0A3D5C)' }}
            >
              <div className="text-3xl mb-2">🏃</div>
              <div className="font-cinzel text-teal-300 font-semibold mb-1">Run Mode</div>
              <div className="text-sm text-gray-400">Jump over monsters, collect coins. Pure fun — no questions.</div>
              <div className="text-xs text-yellow-400 mt-3">🪙 1 drachma per coin</div>
            </button>
            <button
              onClick={() => { setMode('quiz'); setTimeout(startGame, 50) }}
              className="card-hover rounded-2xl p-6 border border-yellow-600/40 text-left"
              style={{ background: 'linear-gradient(135deg, #1a1000, #2d1e00)' }}
            >
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-cinzel text-yellow-400 font-semibold mb-1">Quiz Mode</div>
              <div className="text-sm text-gray-400">Answer maths & myth questions to defeat monsters!</div>
              <div className="text-xs text-yellow-400 mt-3">🪙 +50 per correct answer</div>
            </button>
          </div>
          <p className="text-gray-600 text-sm">Press <kbd className="bg-white/10 px-2 py-0.5 rounded text-gray-300">Space</kbd> or <kbd className="bg-white/10 px-2 py-0.5 rounded text-gray-300">↑</kbd> to jump · Tap canvas on mobile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header onBack={() => { setMode(null) }} title={mode === 'quiz' ? 'Quest Runner — Quiz Mode' : 'Quest Runner'} />
      <div className="max-w-3xl mx-auto px-2 py-4">

        {/* Canvas */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-4" style={{ background: '#0A1628' }}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="w-full cursor-pointer"
            style={{ maxHeight: 300, display: 'block' }}
            onClick={jump}
          />

          {/* Overlay states */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <div className="font-cinzel text-2xl text-yellow-400 mb-4">Ready, Demigod?</div>
              <button onClick={startGame} className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-3 rounded-xl">
                Start Quest →
              </button>
            </div>
          )}

          {gameState === 'dead' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }}>
              <div className="text-5xl mb-3">💀</div>
              <div className="font-cinzel text-2xl text-red-400 mb-1">Quest Failed</div>
              <div className="text-gray-300 mb-5">You ran {score}m</div>
              <button onClick={() => { setMode(null) }} className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-xl">
                Try Again
              </button>
            </div>
          )}

          {gameState === 'win' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }}>
              <div className="text-5xl mb-3">🏆</div>
              <div className="font-cinzel text-2xl text-yellow-400 mb-1">Quest Complete!</div>
              <div className="text-gray-300 mb-1">You reached Olympus!</div>
              <div className="drachma-coin mb-5">🪙 +100 bonus drachmas!</div>
              <button onClick={() => setMode(null)} className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-3 rounded-xl">
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Quiz panel */}
        {gameState === 'quiz' && currentQ && (
          <div className="rounded-2xl p-5 border border-yellow-500/40 mb-4" style={{ background: 'rgba(245,166,35,0.1)' }}>
            <div className="font-cinzel text-yellow-400 mb-1 text-sm">⚔️ MONSTER BATTLE — Answer to defeat it!</div>
            <div className="text-lg font-semibold mb-4">{currentQ.q}</div>

            {quizFeedback && (
              <div className={`text-center font-bold text-lg mb-3 ${quizFeedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                {quizFeedback === 'correct' ? '✅ Monster defeated! +50m' : '❌ Wrong! Percy takes damage!'}
              </div>
            )}

            {!quizFeedback && currentQ.options ? (
              <div className="grid grid-cols-2 gap-2">
                {currentQ.options.map(opt => (
                  <button key={opt} onClick={() => answerQuiz(opt)}
                    className="quiz-option text-center capitalize">{opt}</button>
                ))}
              </div>
            ) : !quizFeedback ? (
              <div className="flex gap-2">
                <input
                  className="text-input flex-1 text-center text-xl font-bold"
                  placeholder="Answer…"
                  value={quizInput}
                  onChange={e => setQuizInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') answerQuiz(quizInput) }}
                  autoFocus
                />
                <button onClick={() => answerQuiz(quizInput)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-6 rounded-xl">
                  Attack!
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Controls reminder */}
        {(gameState === 'playing' || gameState === 'quiz') && (
          <div className="text-center text-gray-600 text-xs">
            Tap canvas or press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-gray-400">Space</kbd> to jump
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useRef, useState, useCallback } from 'react'
import { useApp } from '../store'
import Header from '../components/Header'

// ─── Constants ────────────────────────────────────────────────────────────────
const CELL = 42
const WALL = 4
const MOVE_FRAMES = 10   // frames to cross one cell
const FOG_RADIUS = 2     // cells revealed around Percy

const DX = [0, 1, 0, -1]  // N E S W
const DY = [-1, 0, 1, 0]
const OPP = [2, 3, 0, 1]
const KEY_TO_DIR = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3, w: 0, d: 1, s: 2, a: 3 }

// ─── Level configs ─────────────────────────────────────────────────────────────
const LEVELS = [
  {
    cols: 11, rows: 9, title: "The Labyrinth", emoji: "🌀",
    desc: "Escape Daedalus's maze — find the golden key, then the exit!",
    monsters: 2, monsterSpeed: 40, coins: 8,
    wallColor: '#1B4A2A', wallTop: '#2D6B40', floor: '#0A1E14',
    monsterEmojis: ['🐂', '🐕'], monsterNames: ['Minotaur', 'Hellhound'],
  },
  {
    cols: 13, rows: 11, title: "The Underworld", emoji: "💀",
    desc: "Navigate Hades's realm — beware the shades!",
    monsters: 4, monsterSpeed: 30, coins: 10,
    wallColor: '#3A1060', wallTop: '#6B1EA8', floor: '#080614',
    monsterEmojis: ['👻', '💀', '🦇', '🐍'], monsterNames: ['Shade', 'Skeleton', 'Fury', 'Drakon'],
  },
  {
    cols: 15, rows: 13, title: "Mount Olympus", emoji: "⚡",
    desc: "Reach Zeus's throne room — the gods are watching!",
    monsters: 6, monsterSpeed: 22, coins: 12,
    wallColor: '#5A4800', wallTop: '#B8921A', floor: '#120E00',
    monsterEmojis: ['⚡', '🔥', '🌊', '🌪️', '❄️', '☁️'], monsterNames: ['Bolt', 'Flame', 'Wave', 'Storm', 'Frost', 'Cloud'],
  },
]

// ─── Quiz pools per level (July 6 curriculum) ──────────────────────────────────
const QUIZ_L1 = [
  { q: 'How many Olympian gods are there?', a: '12', type: 'mc', options: ['10', '12', '14', '16'] },
  { q: "Zeus's Roman name is?", a: 'Jupiter', type: 'mc', options: ['Mars', 'Neptune', 'Jupiter', 'Pluto'] },
  { q: "Poseidon's Roman name is?", a: 'Neptune', type: 'mc', options: ['Mars', 'Neptune', 'Pluto', 'Vulcan'] },
  { q: "Athena's Roman name is?", a: 'Minerva', type: 'mc', options: ['Diana', 'Minerva', 'Venus', 'Juno'] },
  { q: "Ares is the god of?", a: 'War', type: 'mc', options: ['Sea', 'War', 'Sun', 'Sky'] },
  { q: "Aphrodite's Roman name is?", a: 'Venus', type: 'mc', options: ['Venus', 'Juno', 'Ceres', 'Diana'] },
  { q: 'Who was the leader of the Titans?', a: 'Kronos', type: 'mc', options: ['Atlas', 'Kronos', 'Hyperion', 'Iapetus'] },
  { q: "Medusa turns people to?", a: 'Stone', type: 'mc', options: ['Ice', 'Gold', 'Stone', 'Dust'] },
  { q: "Percy's father is which Olympian?", a: 'Poseidon', type: 'mc', options: ['Zeus', 'Poseidon', 'Hades', 'Ares'] },
  { q: "Athena's symbol is?", a: 'Owl', type: 'mc', options: ['Eagle', 'Owl', 'Dove', 'Snake'] },
  { q: "Hermes is the god of?", a: 'Messengers', type: 'mc', options: ['Sea', 'Fire', 'Messengers', 'War'] },
  { q: "Apollo's Roman name is?", a: 'Apollo', type: 'mc', options: ['Sol', 'Apollo', 'Helios', 'Phoebus'] },
  { q: "Camp Half-Blood is in which US state?", a: 'New York', type: 'mc', options: ['Florida', 'New York', 'California', 'Texas'] },
  { q: "Which sea borders Greece to the south?", a: 'Mediterranean', type: 'mc', options: ['Atlantic', 'Mediterranean', 'Black', 'Red'] },
  { q: "Which Greek island is famous for its volcano?", a: 'Santorini', type: 'mc', options: ['Rhodes', 'Crete', 'Santorini', 'Corfu'] },
  { q: "Crete is the largest island of which country?", a: 'Greece', type: 'mc', options: ['Italy', 'Turkey', 'Greece', 'Cyprus'] },
  { q: "The capital of modern Greece is?", a: 'Athens', type: 'mc', options: ['Sparta', 'Athens', 'Corinth', 'Olympia'] },
  { q: "Orion is a?", a: 'Constellation', type: 'mc', options: ['Planet', 'Star', 'Constellation', 'Galaxy'] },
  { q: "Which constellation is also called The Great Bear?", a: 'Ursa Major', type: 'mc', options: ['Orion', 'Perseus', 'Ursa Major', 'Scorpius'] },
  { q: "Perseus slew which monster in Greek myth?", a: 'Medusa', type: 'mc', options: ['Hydra', 'Medusa', 'Minotaur', 'Cerberus'] },
  { q: 'Half of 3/4 is?', a: '3/8', type: 'mc', options: ['1/4', '3/8', '1/2', '6/8'] },
  { q: 'A cabin is 6 m long and 4 m wide. Perimeter?', a: '20 m', type: 'mc', options: ['24 m', '10 m', '20 m', '18 m'] },
  { q: 'Area of a 5 m × 3 m cabin floor?', a: '15 m²', type: 'mc', options: ['8 m²', '15 m²', '16 m²', '18 m²'] },
  { q: '1/2 + 1/4 = ?', a: '3/4', type: 'mc', options: ['1/2', '2/4', '3/4', '1'] },
  { q: 'The root "hydro" means?', a: 'Water', type: 'mc', options: ['Fire', 'Earth', 'Water', 'Air'] },
  { q: 'The root "geo" means?', a: 'Earth', type: 'mc', options: ['Sea', 'Sky', 'Earth', 'Star'] },
  { q: 'The root "astro" means?', a: 'Star', type: 'mc', options: ['Moon', 'Star', 'Sun', 'Space'] },
  { q: 'The root "chron" means?', a: 'Time', type: 'mc', options: ['Speed', 'Distance', 'Time', 'Power'] },
  { q: 'The root "mega" means?', a: 'Large', type: 'mc', options: ['Small', 'Fast', 'Large', 'Bright'] },
  { q: 'The root "poly" means?', a: 'Many', type: 'mc', options: ['One', 'Many', 'Half', 'None'] },
]

const QUIZ_L2 = [
  { q: "The Oracle of Delphi gave what?", a: 'Prophecies', type: 'mc', options: ['Weapons', 'Maps', 'Prophecies', 'Drachmas'] },
  { q: "A phalanx was a Greek?", a: 'Battle formation', type: 'mc', options: ['Ship', 'Temple', 'Battle formation', 'Festival'] },
  { q: "The Battle of Marathon was fought against?", a: 'Persia', type: 'mc', options: ['Rome', 'Persia', 'Egypt', 'Sparta'] },
  { q: "Democracy was invented in ancient?", a: 'Athens', type: 'mc', options: ['Rome', 'Sparta', 'Athens', 'Corinth'] },
  { q: "The first Olympic Games were held in?", a: 'Olympia', type: 'mc', options: ['Athens', 'Sparta', 'Corinth', 'Olympia'] },
  { q: "A hero's journey always includes a?", a: 'Quest', type: 'mc', options: ['Feast', 'Quest', 'Crown', 'Map'] },
  { q: "Kronos is the Titan of?", a: 'Time', type: 'mc', options: ['Sea', 'Fire', 'Time', 'Sky'] },
  { q: "How many time zones does the US have?", a: '4', type: 'mc', options: ['2', '3', '4', '6'] },
  { q: "New York is in which time zone?", a: 'Eastern', type: 'mc', options: ['Pacific', 'Central', 'Mountain', 'Eastern'] },
  { q: "The Mediterranean Sea borders how many continents?", a: '3', type: 'mc', options: ['2', '3', '4', '5'] },
  { q: "Stars twinkle. Planets appear to?", a: 'Shine steadily', type: 'mc', options: ['Twinkle faster', 'Shine steadily', 'Change colour', 'Disappear'] },
  { q: "Constellations appear to move because Earth?", a: 'Orbits the Sun', type: 'mc', options: ['Spins faster', 'Orbits the Sun', 'Moves closer', 'Has fog'] },
  { q: "Scorpius is best seen in which season?", a: 'Summer', type: 'mc', options: ['Winter', 'Spring', 'Summer', 'Autumn'] },
  { q: "If it is 3 pm Eastern, what time is it Pacific?", a: '12 pm', type: 'mc', options: ['1 pm', '12 pm', '6 pm', '2 pm'] },
  { q: '3/4 − 1/4 = ?', a: '1/2', type: 'mc', options: ['2/4', '1/2', '1/4', '3/8'] },
  { q: "A prophecy is a?", a: 'Prediction of the future', type: 'mc', options: ['Map of Greece', 'List of gods', 'Prediction of the future', 'Battle plan'] },
  { q: 'The root "mort" means?', a: 'Death', type: 'mc', options: ['Life', 'Death', 'War', 'Water'] },
]

const QUIZ_L3 = [
  { q: "Hephaestus is the god of?", a: 'Fire & Forge', type: 'mc', options: ['Sea', 'War', 'Fire & Forge', 'Wisdom'] },
  { q: "Dionysus is the god of?", a: 'Wine & Celebration', type: 'mc', options: ['Sun', 'Wine & Celebration', 'Sea', 'War'] },
  { q: "Artemis is the goddess of?", a: 'The Hunt', type: 'mc', options: ['Love', 'War', 'The Hunt', 'Wisdom'] },
  { q: "Which island did the Minotaur live on?", a: 'Crete', type: 'mc', options: ['Ithaca', 'Rhodes', 'Crete', 'Santorini'] },
  { q: "Odysseus was king of?", a: 'Ithaca', type: 'mc', options: ['Corfu', 'Crete', 'Rhodes', 'Ithaca'] },
  { q: "Area of a rectangle 8 m × 6 m?", a: '48 m²', type: 'mc', options: ['14 m²', '28 m²', '48 m²', '56 m²'] },
  { q: "Perimeter of a square with side 7 m?", a: '28 m', type: 'mc', options: ['14 m', '21 m', '28 m', '49 m'] },
  { q: '2/3 + 1/6 = ?', a: '5/6', type: 'mc', options: ['3/9', '1/2', '5/6', '3/6'] },
  { q: "If Percy drives 300 miles at 60 mph, how many hours?", a: '5', type: 'mc', options: ['3', '4', '5', '6'] },
  { q: "The root 'hydro' + 'phobia' means fear of?", a: 'Water', type: 'mc', options: ['Fire', 'Water', 'Spiders', 'Heights'] },
  { q: "Ursa Major contains which famous star pattern?", a: 'Big Dipper', type: 'mc', options: ['Southern Cross', 'Big Dipper', "Orion's Belt", 'Pleiades'] },
  { q: "Perseus used a mirror-shield against which monster?", a: 'Medusa', type: 'mc', options: ['Cerberus', 'Hydra', 'Medusa', 'Cyclops'] },
  { q: "Cassiopeia was a queen from which myth?", a: 'Greek', type: 'mc', options: ['Roman', 'Egyptian', 'Greek', 'Norse'] },
]

function pickQuiz(lvlIdx) {
  const pool = lvlIdx === 0 ? QUIZ_L1
    : lvlIdx === 1 ? [...QUIZ_L2, ...QUIZ_L1.slice(0, 10)]
    : [...QUIZ_L3, ...QUIZ_L2.slice(0, 8), ...QUIZ_L1.slice(0, 6)]
  return pool[Math.floor(Math.random() * pool.length)]
}

// ─── Maze generation (iterative DFS) ──────────────────────────────────────────
function genMaze(cols, rows) {
  const cells = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ walls: [true, true, true, true] }))
  )
  const vis = Array.from({ length: rows }, () => new Array(cols).fill(false))
  const stack = [{ x: 0, y: 0 }]
  vis[0][0] = true
  while (stack.length) {
    const { x, y } = stack[stack.length - 1]
    const dirs = [0, 1, 2, 3]
      .filter(d => {
        const nx = x + DX[d], ny = y + DY[d]
        return nx >= 0 && nx < cols && ny >= 0 && ny < rows && !vis[ny][nx]
      })
      .sort(() => Math.random() - 0.5)
    if (!dirs.length) { stack.pop(); continue }
    const d = dirs[0], nx = x + DX[d], ny = y + DY[d]
    cells[y][x].walls[d] = false
    cells[ny][nx].walls[OPP[d]] = false
    vis[ny][nx] = true
    stack.push({ x: nx, y: ny })
  }
  return cells
}

// ─── Level initialiser ────────────────────────────────────────────────────────
function initLevel(lvlIdx) {
  const cfg = LEVELS[lvlIdx]
  const maze = genMaze(cfg.cols, cfg.rows)
  const exit = { x: cfg.cols - 1, y: cfg.rows - 1 }

  // Key: placed somewhere in the far half of the maze
  const kx = Math.floor(cfg.cols * 0.5 + Math.random() * cfg.cols * 0.4)
  const ky = Math.floor(Math.random() * cfg.rows)
  const key = { x: Math.min(kx, cfg.cols - 2), y: ky, collected: false }

  // Coins
  const used = new Set(['0,0', `${exit.x},${exit.y}`, `${key.x},${key.y}`])
  const coins = []
  let att = 0
  while (coins.length < cfg.coins && att < 300) {
    const cx = Math.floor(Math.random() * cfg.cols)
    const cy = Math.floor(Math.random() * cfg.rows)
    const k = `${cx},${cy}`
    if (!used.has(k)) { used.add(k); coins.push({ x: cx, y: cy }) }
    att++
  }

  // Monsters — keep away from start
  const safe = new Set(['0,0', '1,0', '0,1'])
  const monsters = []
  for (let i = 0; i < cfg.monsters; i++) {
    let mx, my, mk, a = 0
    do { mx = Math.floor(Math.random() * cfg.cols); my = Math.floor(Math.random() * cfg.rows); mk = `${mx},${my}`; a++ }
    while (safe.has(mk) && a < 200)
    safe.add(mk)
    monsters.push({
      x: mx, y: my,
      px: mx * CELL + CELL / 2, py: my * CELL + CELL / 2,
      tx: mx * CELL + CELL / 2, ty: my * CELL + CELL / 2,
      moving: false, moveFrame: 0,
      waitTimer: Math.floor(Math.random() * cfg.monsterSpeed),
      stunTimer: 0,
      emoji: cfg.monsterEmojis[i % cfg.monsterEmojis.length],
      name: cfg.monsterNames[i % cfg.monsterNames.length],
      speed: cfg.monsterSpeed,
    })
  }

  // Fog of war
  const fog = Array.from({ length: cfg.rows }, () => new Array(cfg.cols).fill(true))
  revealFog(fog, 0, 0, cfg.cols, cfg.rows)

  return {
    maze, exit, key, coins, monsters, fog, cfg,
    percy: {
      x: 0, y: 0,
      px: CELL / 2, py: CELL / 2,
      tx: CELL / 2, ty: CELL / 2,
      moving: false, moveFrame: 0,
      invincible: 0,
    },
    hasKey: false,
    lives: 3,
    score: 0,
    coinsGot: 0,
    tick: 0,
  }
}

function revealFog(fog, cx, cy, cols, rows) {
  for (let dy = -FOG_RADIUS; dy <= FOG_RADIUS; dy++) {
    for (let dx = -FOG_RADIUS; dx <= FOG_RADIUS; dx++) {
      const nx = cx + dx, ny = cy + dy
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) fog[ny][nx] = false
    }
  }
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LabyrinthGame({ onBack, startLevel = 0 }) {
  const { addDrachmas, recordComplete } = useApp()
  const canvasRef = useRef(null)
  const gsRef = useRef(null)           // mutable game state
  const rafRef = useRef(null)
  const inputRef = useRef({ dir: null, held: false })
  const [screen, setScreen] = useState(startLevel > 0 ? 'playing' : 'select')
  const [level, setLevel] = useState(startLevel)
  const [uiScore, setUiScore] = useState(0)
  const [uiLives, setUiLives] = useState(3)
  const [uiHasKey, setUiHasKey] = useState(false)
  const [quiz, setQuiz] = useState(null)          // { q, a, type, options, monster }
  const [quizInput, setQuizInput] = useState('')
  const [quizFeedback, setQuizFeedback] = useState(null)

  // ── Canvas size ─────────────────────────────────────────────────────────────
  const getCanvasSize = (lvlIdx) => {
    const cfg = LEVELS[lvlIdx]
    return { w: cfg.cols * CELL, h: cfg.rows * CELL }
  }

  // ── Drawing ─────────────────────────────────────────────────────────────────
  const draw = useCallback((ctx, gs) => {
    const { maze, percy, monsters, coins, exit, key, fog, cfg, hasKey } = gs
    const W = cfg.cols * CELL, H = cfg.rows * CELL

    // Floor
    ctx.fillStyle = cfg.floor
    ctx.fillRect(0, 0, W, H)

    // Cells: floor tiles
    for (let row = 0; row < cfg.rows; row++) {
      for (let col = 0; col < cfg.cols; col++) {
        const x = col * CELL, y = row * CELL
        if (!fog[row][col]) {
          ctx.fillStyle = cfg.floor
          ctx.fillRect(x + WALL, y + WALL, CELL - WALL * 2, CELL - WALL * 2)
          // subtle grid lines
          ctx.strokeStyle = 'rgba(255,255,255,0.03)'
          ctx.lineWidth = 1
          ctx.strokeRect(x + WALL, y + WALL, CELL - WALL * 2, CELL - WALL * 2)
        }
      }
    }

    // Walls
    for (let row = 0; row < cfg.rows; row++) {
      for (let col = 0; col < cfg.cols; col++) {
        const x = col * CELL, y = row * CELL
        const cell = maze[row][col]
        const visible = !fog[row][col]
        const dim = fog[row][col]

        ctx.fillStyle = dim ? '#060c14' : cfg.wallColor

        // North wall
        if (cell.walls[0]) ctx.fillRect(x, y, CELL, WALL)
        // East wall
        if (cell.walls[1]) ctx.fillRect(x + CELL - WALL, y, WALL, CELL)
        // South wall
        if (cell.walls[2]) ctx.fillRect(x, y + CELL - WALL, CELL, WALL)
        // West wall
        if (cell.walls[3]) ctx.fillRect(x, y, WALL, CELL)

        // Wall tops (lighter highlight on visible walls)
        if (visible) {
          ctx.fillStyle = cfg.wallTop
          if (cell.walls[0]) ctx.fillRect(x, y, CELL, 2)
          if (cell.walls[3]) ctx.fillRect(x, y, 2, CELL)
        }
      }
    }

    // Fog overlay
    for (let row = 0; row < cfg.rows; row++) {
      for (let col = 0; col < cfg.cols; col++) {
        if (fog[row][col]) {
          ctx.fillStyle = 'rgba(0,0,0,0.92)'
          ctx.fillRect(col * CELL, row * CELL, CELL, CELL)
        }
      }
    }

    // Coins
    ctx.font = '18px serif'
    coins.forEach(c => {
      if (!c.collected && !fog[c.y][c.x]) {
        ctx.fillText('🪙', c.x * CELL + CELL / 2 - 9, c.y * CELL + CELL / 2 + 7)
      }
    })

    // Key
    if (!key.collected && !fog[key.y][key.x]) {
      ctx.font = '22px serif'
      // glow effect
      ctx.shadowColor = '#FFD700'
      ctx.shadowBlur = 10
      ctx.fillText('🗝️', key.x * CELL + CELL / 2 - 11, key.y * CELL + CELL / 2 + 8)
      ctx.shadowBlur = 0
    }

    // Exit door
    if (!fog[exit.y][exit.x]) {
      ctx.font = '24px serif'
      if (hasKey) {
        ctx.shadowColor = '#FFD700'
        ctx.shadowBlur = 16
        ctx.fillText('🚪', exit.x * CELL + CELL / 2 - 12, exit.y * CELL + CELL / 2 + 10)
        ctx.shadowBlur = 0
      } else {
        ctx.globalAlpha = 0.4
        ctx.fillText('🚪', exit.x * CELL + CELL / 2 - 12, exit.y * CELL + CELL / 2 + 10)
        ctx.globalAlpha = 1
        ctx.font = '14px serif'
        ctx.fillText('🔒', exit.x * CELL + CELL / 2 - 2, exit.y * CELL + CELL / 2 - 4)
      }
    }

    // Monsters
    monsters.forEach(m => {
      if (fog[m.y][m.x]) return
      ctx.font = '26px serif'
      if (m.stunTimer > 0) {
        ctx.globalAlpha = 0.5
        ctx.fillText(m.emoji, m.px - 13, m.py + 10)
        ctx.globalAlpha = 1
        ctx.font = '12px serif'
        ctx.fillText('❄️', m.px, m.py - 10)
      } else {
        // Slight bob
        const bob = Math.sin(Date.now() / 300 + m.x) * 2
        ctx.fillText(m.emoji, m.px - 13, m.py + 10 + bob)
      }
    })

    // Percy
    const p = percy
    const flash = p.invincible > 0 && Math.floor(p.invincible / 4) % 2 === 0
    if (!flash) {
      ctx.font = '28px serif'
      ctx.fillText('⚡', p.px - 14, p.py + 11)
    }

    // HUD bar
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, 0, W, 28)
    ctx.font = 'bold 12px Inter, sans-serif'
    ctx.fillStyle = '#F5A623'
    ctx.fillText(`🪙 ${gs.coinsGot}`, 8, 18)
    ctx.fillStyle = '#ff6b6b'
    ctx.fillText('❤️'.repeat(gs.lives), W / 2 - 20, 18)
    ctx.fillStyle = uiHasKey ? '#FFD700' : '#666'
    ctx.fillText(hasKey ? '🗝️ KEY ✓' : '🗝️ find key', W - 80, 18)

    // Minimap (bottom-right corner)
    const MM = 4, MPad = 4
    const mmW = cfg.cols * MM + MPad * 2
    const mmH = cfg.rows * MM + MPad * 2
    const mmX = W - mmW - 4, mmY = H - mmH - 4
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(mmX, mmY, mmW, mmH)
    for (let row = 0; row < cfg.rows; row++) {
      for (let col = 0; col < cfg.cols; col++) {
        const mx = mmX + MPad + col * MM
        const my = mmY + MPad + row * MM
        if (fog[row][col]) {
          ctx.fillStyle = '#111'
        } else {
          ctx.fillStyle = '#1a3a2a'
        }
        ctx.fillRect(mx, my, MM - 1, MM - 1)
      }
    }
    // minimap exit
    ctx.fillStyle = hasKey ? '#FFD700' : '#444'
    ctx.fillRect(mmX + MPad + exit.x * MM, mmY + MPad + exit.y * MM, MM - 1, MM - 1)
    // minimap key
    if (!key.collected) {
      ctx.fillStyle = '#FFD700'
      ctx.fillRect(mmX + MPad + key.x * MM, mmY + MPad + key.y * MM, MM - 1, MM - 1)
    }
    // minimap percy
    ctx.fillStyle = '#00ffaa'
    ctx.fillRect(mmX + MPad + percy.x * MM, mmY + MPad + percy.y * MM, MM - 1, MM - 1)
  }, [uiHasKey])

  // ── Game loop ────────────────────────────────────────────────────────────────
  const startLoop = useCallback((lvlIdx) => {
    cancelAnimationFrame(rafRef.current)
    const gs = initLevel(lvlIdx)
    gsRef.current = gs
    setUiScore(0); setUiLives(3); setUiHasKey(false)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { w, h } = getCanvasSize(lvlIdx)
    canvas.width = w
    canvas.height = h

    const loop = () => {
      const gs = gsRef.current
      if (!gs) return
      gs.tick++

      // ── Percy movement ──
      const p = gs.percy
      if (p.invincible > 0) p.invincible--

      if (p.moving) {
        p.moveFrame++
        const t = p.moveFrame / MOVE_FRAMES
        p.px = p.px + (p.tx - p.px) * 0.3
        p.py = p.py + (p.ty - p.py) * 0.3
        if (p.moveFrame >= MOVE_FRAMES) {
          p.px = p.tx; p.py = p.ty; p.moving = false; p.moveFrame = 0
          // Reveal fog
          revealFog(gs.fog, p.x, p.y, gs.cfg.cols, gs.cfg.rows)
          // Check key
          if (!gs.key.collected && gs.key.x === p.x && gs.key.y === p.y) {
            gs.key.collected = true; gs.hasKey = true
            gs.score += 50
            setUiHasKey(true)
            addDrachmas(10)
          }
          // Check coins
          gs.coins.forEach(c => {
            if (!c.collected && c.x === p.x && c.y === p.y) {
              c.collected = true; gs.coinsGot++; gs.score += 10
              addDrachmas(2)
              setUiScore(gs.score)
            }
          })
          // Check exit
          if (gs.hasKey && p.x === gs.exit.x && p.y === gs.exit.y) {
            addDrachmas(50)
            recordComplete(`game-level-${lvlIdx + 1}`, 1, 1)
            setScreen(lvlIdx < LEVELS.length - 1 ? 'levelup' : 'win')
            cancelAnimationFrame(rafRef.current)
            return
          }
        }
      }

      if (!p.moving) {
        const dir = inputRef.current.dir
        if (dir !== null) {
          const nx = p.x + DX[dir], ny = p.y + DY[dir]
          if (nx >= 0 && nx < gs.cfg.cols && ny >= 0 && ny < gs.cfg.rows && !gs.maze[p.y][p.x].walls[dir]) {
            p.x = nx; p.y = ny
            p.tx = nx * CELL + CELL / 2; p.ty = ny * CELL + CELL / 2
            p.moving = true; p.moveFrame = 0
          }
        }
      }

      // ── Monster movement ──
      gs.monsters.forEach(m => {
        if (m.stunTimer > 0) { m.stunTimer--; return }
        if (m.moving) {
          m.px += (m.tx - m.px) * 0.25
          m.py += (m.ty - m.py) * 0.25
          m.moveFrame++
          if (m.moveFrame >= m.speed * 0.6) {
            m.px = m.tx; m.py = m.ty; m.moving = false; m.moveFrame = 0
          }
        } else {
          m.waitTimer--
          if (m.waitTimer <= 0) {
            // Pick random valid direction
            const dirs = [0, 1, 2, 3].filter(d => !gs.maze[m.y][m.x].walls[d]).sort(() => Math.random() - 0.5)
            if (dirs.length) {
              const d = dirs[0]
              m.x += DX[d]; m.y += DY[d]
              m.tx = m.x * CELL + CELL / 2; m.ty = m.y * CELL + CELL / 2
              m.moving = true; m.moveFrame = 0
            }
            m.waitTimer = m.speed
          }
        }

        // ── Monster–Percy collision ──
        if (m.stunTimer === 0 && p.invincible === 0) {
          const dist = Math.hypot(m.px - p.px, m.py - p.py)
          if (dist < CELL * 0.7) {
            // Trigger quiz
            cancelAnimationFrame(rafRef.current)
            const q = pickQuiz(lvlIdx)
            setQuiz({ ...q, monster: m })
            setQuizInput('')
            setQuizFeedback(null)
            setScreen('quiz')
            return
          }
        }
      })

      draw(ctx, gs)
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
  }, [draw, addDrachmas])

  // ── Quiz answer ──────────────────────────────────────────────────────────────
  const answerQuiz = useCallback((answer) => {
    const gs = gsRef.current
    if (!gs || !quiz) return
    const correct = answer.trim().toLowerCase() === quiz.a.toLowerCase()
    setQuizFeedback(correct ? 'correct' : 'wrong')
    if (correct) {
      addDrachmas(15)
      quiz.monster.stunTimer = 180  // stun for 3 seconds
      gs.score += 100
      setUiScore(gs.score)
    } else {
      gs.percy.invincible = 90
      gs.lives--
      setUiLives(gs.lives)
    }
    setTimeout(() => {
      if (!correct && gs.lives <= 0) {
        setScreen('dead')
        return
      }
      setScreen('playing')
      setQuiz(null)
      setQuizFeedback(null)
      startLoop(level)  // resume — re-init keeps position via ref
    }, 900)
  }, [quiz, addDrachmas, level, startLoop])

  // ── Actually resume after quiz (don't reinit, just restart loop) ─────────────
  const resumeLoop = useCallback(() => {
    const gs = gsRef.current
    if (!gs) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const loop = () => {
      const gs = gsRef.current
      if (!gs) return
      gs.tick++
      const p = gs.percy
      if (p.invincible > 0) p.invincible--
      if (p.moving) {
        p.moveFrame++
        p.px += (p.tx - p.px) * 0.3
        p.py += (p.ty - p.py) * 0.3
        if (p.moveFrame >= MOVE_FRAMES) {
          p.px = p.tx; p.py = p.ty; p.moving = false; p.moveFrame = 0
          revealFog(gs.fog, p.x, p.y, gs.cfg.cols, gs.cfg.rows)
          if (!gs.key.collected && gs.key.x === p.x && gs.key.y === p.y) {
            gs.key.collected = true; gs.hasKey = true; gs.score += 50
            setUiHasKey(true); addDrachmas(10)
          }
          gs.coins.forEach(c => {
            if (!c.collected && c.x === p.x && c.y === p.y) {
              c.collected = true; gs.coinsGot++; gs.score += 10
              addDrachmas(2); setUiScore(gs.score)
            }
          })
          if (gs.hasKey && p.x === gs.exit.x && p.y === gs.exit.y) {
            addDrachmas(50)
            recordComplete(`game-level-${level + 1}`, 1, 1)
            setScreen(level < LEVELS.length - 1 ? 'levelup' : 'win')
            cancelAnimationFrame(rafRef.current)
            return
          }
        }
      }
      if (!p.moving) {
        const dir = inputRef.current.dir
        if (dir !== null) {
          const nx = p.x + DX[dir], ny = p.y + DY[dir]
          if (nx >= 0 && nx < gs.cfg.cols && ny >= 0 && ny < gs.cfg.rows && !gs.maze[p.y][p.x].walls[dir]) {
            p.x = nx; p.y = ny
            p.tx = nx * CELL + CELL / 2; p.ty = ny * CELL + CELL / 2
            p.moving = true; p.moveFrame = 0
          }
        }
      }
      gs.monsters.forEach(m => {
        if (m.stunTimer > 0) { m.stunTimer--; return }
        if (m.moving) {
          m.px += (m.tx - m.px) * 0.25; m.py += (m.ty - m.py) * 0.25; m.moveFrame++
          if (m.moveFrame >= m.speed * 0.6) { m.px = m.tx; m.py = m.ty; m.moving = false; m.moveFrame = 0 }
        } else {
          m.waitTimer--
          if (m.waitTimer <= 0) {
            const dirs = [0, 1, 2, 3].filter(d => !gs.maze[m.y][m.x].walls[d]).sort(() => Math.random() - 0.5)
            if (dirs.length) {
              const d = dirs[0]; m.x += DX[d]; m.y += DY[d]
              m.tx = m.x * CELL + CELL / 2; m.ty = m.y * CELL + CELL / 2
              m.moving = true; m.moveFrame = 0
            }
            m.waitTimer = m.speed
          }
        }
        if (m.stunTimer === 0 && p.invincible === 0) {
          const dist = Math.hypot(m.px - p.px, m.py - p.py)
          if (dist < CELL * 0.7) {
            cancelAnimationFrame(rafRef.current)
            const q = pickQuiz(level)
            setQuiz({ ...q, monster: m }); setQuizInput(''); setQuizFeedback(null); setScreen('quiz')
            return
          }
        }
      })
      draw(ctx, gs)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [draw, addDrachmas, level])

  // ── Input ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'playing') return
    const down = (e) => {
      const dir = KEY_TO_DIR[e.key]
      if (dir !== undefined) { e.preventDefault(); inputRef.current.dir = dir }
    }
    const up = (e) => {
      const dir = KEY_TO_DIR[e.key]
      if (dir !== undefined && inputRef.current.dir === dir) inputRef.current.dir = null
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [screen])

  // ── Start / level change ─────────────────────────────────────────────────────
  useEffect(() => {
    if (screen === 'playing') {
      if (!gsRef.current) startLoop(level)
      else resumeLoop()
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [screen])

  // ── Touch swipe ──────────────────────────────────────────────────────────────
  const touchStart = useRef(null)
  const onTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
  const onTouchEnd = (e) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return
    if (Math.abs(dx) > Math.abs(dy)) inputRef.current.dir = dx > 0 ? 1 : 3
    else inputRef.current.dir = dy > 0 ? 2 : 0
    setTimeout(() => { inputRef.current.dir = null }, 150)
    touchStart.current = null
  }

  const pressDir = (dir) => { inputRef.current.dir = dir; setTimeout(() => { if (inputRef.current.dir === dir) inputRef.current.dir = null }, 200) }

  // ── Screens ──────────────────────────────────────────────────────────────────
  if (screen === 'select') {
    return (
      <div className="min-h-screen">
        <Header onBack={onBack} title="Labyrinth Game" />
        <div className="max-w-xl mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4 float-anim">🌀</div>
          <h2 className="font-cinzel text-2xl text-yellow-400 mb-2">The Labyrinth</h2>
          <p className="text-gray-400 mb-8">Navigate mazes, collect the golden key, defeat monsters with quiz questions, and escape!</p>
          <div className="flex flex-col gap-4 mb-8">
            {LEVELS.map((lvl, i) => (
              <button key={i} onClick={() => { setLevel(i); gsRef.current = null; setScreen('playing') }}
                className="card-hover rounded-2xl p-5 text-left border border-white/10"
                style={{ background: `linear-gradient(135deg, ${lvl.floor}, #0A1628)` }}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">{lvl.emoji}</span>
                  <div>
                    <div className="font-cinzel font-semibold text-white">Level {i + 1}: {lvl.title}</div>
                    <div className="text-xs text-gray-400">{lvl.desc}</div>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>👾 {lvl.monsters} monsters</span>
                  <span>🪙 {lvl.coins} coins</span>
                  <span>{i === 0 ? '⭐ Easy' : i === 1 ? '⭐⭐ Medium' : '⭐⭐⭐ Hard'}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="text-gray-600 text-xs">Arrow keys / WASD to move · Swipe on mobile · Answer questions to defeat monsters</div>
        </div>
      </div>
    )
  }

  if (screen === 'quiz' && quiz) {
    return (
      <div className="min-h-screen">
        <Header title="Monster Encounter!" />
        <div className="max-w-sm mx-auto px-4 py-8 text-center">
          <div className="text-5xl mb-3">{quiz.monster?.emoji || '👾'}</div>
          <div className="font-cinzel text-xl text-red-400 mb-1">A {quiz.monster?.name} blocks your path!</div>
          <p className="text-gray-400 text-sm mb-6">Answer correctly to stun it and escape. Wrong answer = lose a life!</p>
          <div className="bg-white/5 rounded-2xl p-5 mb-4 border border-yellow-500/30">
            <div className="text-lg font-semibold mb-4">{quiz.q}</div>
            {quizFeedback ? (
              <div className={`text-xl font-bold ${quizFeedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                {quizFeedback === 'correct' ? `✅ Monster stunned! +15 drachmas` : `❌ Wrong! Answer: ${quiz.a}`}
              </div>
            ) : quiz.type === 'mc' ? (
              <div className="grid grid-cols-2 gap-2">
                {quiz.options.map(opt => (
                  <button key={opt} onClick={() => answerQuiz(opt)} className="quiz-option text-center">{opt}</button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                <input className="text-input flex-1 text-center text-2xl font-bold" placeholder="Answer…"
                  value={quizInput} onChange={e => setQuizInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && answerQuiz(quizInput)} autoFocus />
                <button onClick={() => answerQuiz(quizInput)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-5 rounded-xl">⚔️</button>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-1">
            {'❤️'.repeat(uiLives).split('').map((h, i) => <span key={i} className="text-xl">{h}</span>)}
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'dead') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">💀</div>
        <div className="font-cinzel text-2xl text-red-400 mb-2">You fell in the Labyrinth!</div>
        <p className="text-gray-400 mb-6">The monsters got you. Try again, demigod!</p>
        <div className="flex gap-3">
          <button onClick={() => { gsRef.current = null; setScreen('playing') }}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-xl">Retry Level</button>
          <button onClick={() => { gsRef.current = null; setScreen('select') }}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl">Level Select</button>
        </div>
      </div>
    )
  }

  if (screen === 'levelup') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <div className="font-cinzel text-2xl text-yellow-400 mb-2">Level Complete!</div>
        <p className="text-gray-400 mb-2">+50 drachmas bonus!</p>
        <p className="text-gray-500 text-sm mb-6">Next: {LEVELS[level + 1]?.title}</p>
        <button onClick={() => { const next = level + 1; setLevel(next); gsRef.current = null; setScreen('playing') }}
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-xl font-cinzel">
          Enter {LEVELS[level + 1]?.emoji} {LEVELS[level + 1]?.title} →
        </button>
      </div>
    )
  }

  if (screen === 'win') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">⚡</div>
        <div className="font-cinzel text-3xl text-yellow-400 mb-2 gold-shimmer">You reached Olympus!</div>
        <p className="text-gray-300 mb-2">All 3 levels complete! Percy is a true hero!</p>
        <div className="drachma-coin text-base mx-auto mb-6">🪙 +50 bonus drachmas</div>
        <div className="flex gap-3">
          <button onClick={() => { gsRef.current = null; setLevel(0); setScreen('playing') }}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-xl">Play Again</button>
          <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl">Back</button>
        </div>
      </div>
    )
  }

  // Playing screen
  const cfg = LEVELS[level]
  return (
    <div className="min-h-screen">
      <Header onBack={() => { cancelAnimationFrame(rafRef.current); gsRef.current = null; setScreen('select') }}
        title={`${cfg.emoji} ${cfg.title}`} />

      <div className="flex flex-col items-center px-2 py-3 gap-3">
        {/* Canvas */}
        <div className="rounded-xl overflow-hidden border border-white/10 w-full"
          style={{ maxWidth: cfg.cols * CELL }}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
        </div>

        {/* On-screen D-pad for mobile */}
        <div className="grid grid-cols-3 gap-1 w-36">
          <div />
          <button onPointerDown={() => pressDir(0)}
            className="bg-white/10 active:bg-white/30 rounded-lg h-10 text-lg flex items-center justify-center">↑</button>
          <div />
          <button onPointerDown={() => pressDir(3)}
            className="bg-white/10 active:bg-white/30 rounded-lg h-10 text-lg flex items-center justify-center">←</button>
          <button onPointerDown={() => pressDir(2)}
            className="bg-white/10 active:bg-white/30 rounded-lg h-10 text-lg flex items-center justify-center">↓</button>
          <button onPointerDown={() => pressDir(1)}
            className="bg-white/10 active:bg-white/30 rounded-lg h-10 text-lg flex items-center justify-center">→</button>
        </div>

        <div className="text-gray-600 text-xs text-center">
          Collect 🗝️ key first, then reach 🚪 exit · Monsters trigger quiz questions
        </div>
      </div>
    </div>
  )
}

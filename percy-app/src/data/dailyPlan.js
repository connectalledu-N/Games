// 3-day Percy Jackson learning challenge
// Each task.id must match the key used in recordComplete()

export const DAILY_PLAN = [
  {
    day: 1,
    theme: 'The Lightning Thief Begins',
    quote: '"Look, I didn\'t want to be a half-blood." — Percy Jackson',
    color: '#7EB8F7',
    bg: 'from-blue-900 to-blue-800',
    emoji: '⚡',
    tasks: [
      { id: 'math-tables',          subject: 'math',       label: 'Times Tables  ×6 & ×7',      icon: '⚡', minutes: 5 },
      { id: 'spelling-silent-letters', subject: 'spelling', label: 'Silent Letters Scroll',       icon: '📜', minutes: 5 },
      { id: 'geo-greece-places',    subject: 'geography',  label: 'Map of Ancient Greece',       icon: '🗺️', minutes: 5 },
      { id: 'myth-olympians',       subject: 'mythology',  label: 'Meet the Olympians',          icon: '🏛️', minutes: 8 },
      { id: 'game-level-1',         subject: 'game',       label: 'The Labyrinth — Level 1',     icon: '🎮', minutes: 10, isGame: true, gameLevel: 0 },
    ],
  },
  {
    day: 2,
    theme: 'Into the Labyrinth',
    quote: '"Brains beat brawn every time." — Annabeth Chase',
    color: '#9B72CF',
    bg: 'from-purple-900 to-purple-800',
    emoji: '🌀',
    tasks: [
      { id: 'math-operations',      subject: 'math',       label: 'Operations on Olympus',      icon: '⚡', minutes: 5 },
      { id: 'spelling-tion-sion',   subject: 'spelling',   label: '-tion & -sion Scrolls',      icon: '📜', minutes: 5 },
      { id: 'sci-weather-zeus',     subject: 'science',    label: 'Zeus & the Weather',         icon: '🔬', minutes: 8 },
      { id: 'myth-greek-roman',     subject: 'mythology',  label: 'Greek vs Roman Gods',        icon: '🏛️', minutes: 8 },
      { id: 'geo-ancient-modern',   subject: 'geography',  label: 'Ancient vs Modern Greece',   icon: '🗺️', minutes: 5 },
      { id: 'game-level-2',         subject: 'game',       label: 'The Underworld — Level 2',   icon: '🎮', minutes: 10, isGame: true, gameLevel: 1 },
    ],
  },
  {
    day: 3,
    theme: 'Mount Olympus Awaits',
    quote: '"The real world is where the monsters are." — Percy Jackson',
    color: '#FB923C',
    bg: 'from-orange-900 to-orange-800',
    emoji: '⚡',
    tasks: [
      { id: 'math-division',        subject: 'math',       label: 'Division Dungeon',           icon: '⚡', minutes: 5 },
      { id: 'spelling-mythology-vocab', subject: 'spelling', label: 'Mythology Vocabulary',    icon: '📜', minutes: 5 },
      { id: 'sci-constellations',   subject: 'science',    label: 'Stars & Constellations',     icon: '🔬', minutes: 8 },
      { id: 'geo-percy-journey',    subject: 'geography',  label: "Percy's Quest Map",          icon: '🗺️', minutes: 5 },
      { id: 'myth-myths',           subject: 'mythology',  label: 'The Great Myths',            icon: '🏛️', minutes: 8 },
      { id: 'craft-camp-map',       subject: 'craft',      label: 'Camp Half-Blood Map',        icon: '🎨', minutes: 15 },
      { id: 'game-level-3',         subject: 'game',       label: 'Mount Olympus — Final Level',icon: '🎮', minutes: 10, isGame: true, gameLevel: 2 },
    ],
  },
]

// Penalty drachmas lost for missing a full day
export const MISS_PENALTY = 30

// How many non-game tasks must be done before the game unlocks each day
export const GAME_UNLOCK_THRESHOLD = 3

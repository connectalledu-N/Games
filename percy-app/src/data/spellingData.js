export const spellingSections = [
  {
    id: 'silent-letters',
    title: 'Silent Letters Scroll',
    icon: '📜',
    color: '#7EB8F7',
    rule: 'Some letters hide — they\'re written but not spoken! Like the \'k\' in \'knight\' or the \'w\' in \'wraith\'.',
    drachmas: 6,
    words: [
      { word: 'knight', display: 'kni_ht', missing: 'g', clue: 'A warrior — like an Ares cabin hero', silent: 'k' },
      { word: 'wraith', display: 'w_aith', missing: 'r', clue: 'A spirit ghost — the kind that haunts the Underworld', silent: 'w' },
      { word: 'gnome', display: '_nome', missing: 'g', clue: 'A small creature — could guard a garden on Olympus', silent: 'g' },
      { word: 'knife', display: 'k_ife', missing: 'n', clue: 'Annabeth\'s weapon of choice', silent: 'k' },
      { word: 'wrist', display: '_rist', missing: 'w', clue: 'The joint above your hand — where Percy\'s watch-bracelet Riptide goes', silent: 'w' },
      { word: 'thumb', display: 'thum_', missing: 'b', clue: 'The short finger — Greek sculptors carved them carefully', silent: 'b' },
      { word: 'island', display: 'i_land', missing: 's', clue: 'A piece of land in the sea — like many in the Aegean', silent: 's' },
    ],
    quiz: [
      { q: 'Which word has a silent "k"?', options: ['Kite', 'Know', 'King', 'Keep'], a: 'Know' },
      { q: 'Which word has a silent "b"?', options: ['Bend', 'Comb', 'Cube', 'Bright'], a: 'Comb' },
      { q: 'The word for a ghost-spirit (silent w) is:', options: ['Raith', 'Wraith', 'Rait', 'Wrath'], a: 'Wraith' },
    ]
  },
  {
    id: 'tion-sion',
    title: '-tion and -sion Spells',
    icon: '✨',
    color: '#F5A623',
    rule: '-tion sounds like "shun" (nation, potion). -sion can sound like "shun" (mansion) or "zhun" (television). Potions are everywhere in Greek mythology!',
    drachmas: 6,
    words: [
      { word: 'potion', display: 'po_ion', missing: 't', clue: 'What Circe might brew — "po_ion"', silent: null },
      { word: 'nation', display: 'na_ion', missing: 't', clue: 'Greece was a __ of city-states', silent: null },
      { word: 'mission', display: 'mis_ion', missing: 's', clue: 'Percy\'s quest is always a ___', silent: null },
      { word: 'mansion', display: 'man_ion', missing: 's', clue: 'The gods live in a grand ___ on Olympus', silent: null },
      { word: 'passion', display: 'pas_ion', missing: 's', clue: 'Apollo\'s ___ for music and poetry', silent: null },
      { word: 'action', display: 'ac_ion', missing: 't', clue: 'Percy is always in the middle of the ___!', silent: null },
    ],
    quiz: [
      { q: 'Complete: "Percy\'s ___ was to save Olympus" (a journey with a goal)', options: ['mision', 'mission', 'misshion', 'mition'], a: 'mission' },
      { q: 'Circe brews a magic ___ to turn sailors into animals', options: ['potion', 'posion', 'poshion', 'poction'], a: 'potion' },
      { q: 'Which ending sounds like "zhun"?', options: ['-tion in nation', '-sion in television', '-tion in action', '-sion in mansion'], a: '-sion in television' },
    ]
  },
  {
    id: 'homophones',
    title: 'Homophone Labyrinth',
    icon: '🌀',
    color: '#1FB8A0',
    rule: 'Homophones sound the same but mean different things and are spelled differently. Choose the wrong one and you\'re lost in the Labyrinth!',
    drachmas: 7,
    quiz: [
      { q: 'Percy could ___ the roar of the Minotaur from miles away.', options: ['hear', 'here'], a: 'hear', explain: '"hear" = to listen. "here" = at this place.' },
      { q: 'The gods met ___ on Mount Olympus.', options: ['there', 'their', 'they\'re'], a: 'there', explain: '"there" = at that place. "their" = belonging to them. "they\'re" = they are.' },
      { q: '___ going on a quest to the Underworld.', options: ['There', 'Their', 'They\'re'], a: 'They\'re', explain: '"They\'re" = They are going on a quest.' },
      { q: 'Annabeth held ___ breath underwater.', options: ['her', 'here'], a: 'her', explain: '"her" = belonging to Annabeth.' },
      { q: 'Poseidon rose from the ___ of the ocean.', options: ['see', 'sea'], a: 'sea', explain: '"sea" = the ocean. "see" = to look with your eyes.' },
      { q: 'Perseus had to ___ a price for help from the gods.', options: ['pay', 'paid', 'payed'], a: 'pay', explain: '"pay" is present tense. "paid" is past tense.' },
      { q: 'The ___ of Athena appeared as an owl.', options: ['symbol', 'cymbal'], a: 'symbol', explain: '"symbol" = a sign representing something. "cymbal" = the percussion instrument.' },
    ]
  },
  {
    id: 'mythology-vocab',
    title: 'Myth Vocabulary',
    icon: '🏺',
    color: '#9B72CF',
    rule: 'These are real English words that come from Greek mythology. Learn them and you\'ll sound like Athena herself!',
    drachmas: 8,
    words: [
      { word: 'odyssey', display: 'o_yssey', missing: 'd', clue: 'A long adventurous journey — like Odysseus\'s voyage home' },
      { word: 'labyrinth', display: 'laby_inth', missing: 'r', clue: 'A maze — Daedalus built one to contain the Minotaur' },
      { word: 'olympian', display: 'olymp_an', missing: 'i', clue: 'Belonging to Olympus — the 12 great gods' },
      { word: 'prophecy', display: 'prop_ecy', missing: 'h', clue: 'A prediction of the future — the Oracle gives these' },
      { word: 'ambrosia', display: 'ambros_a', missing: 'i', clue: 'The food of the gods — heals demigods' },
      { word: 'centaur', display: 'cent_ur', missing: 'a', clue: 'Half-human half-horse — like Chiron, Percy\'s teacher' },
    ],
    quiz: [
      { q: 'Chiron is what type of creature?', options: ['Cyclops', 'Satyr', 'Centaur', 'Titan'], a: 'Centaur' },
      { q: 'What does "prophecy" mean?', options: ['A battle plan', 'A type of food', 'A prediction of the future', 'A magical weapon'], a: 'A prediction of the future' },
      { q: 'Which word means "food of the gods"?', options: ['Nectar', 'Ambrosia', 'Ichor', 'Elixir'], a: 'Ambrosia' },
      { q: 'A long, amazing journey is called a(n):', options: ['Labyrinth', 'Odyssey', 'Oracle', 'Prophecy'], a: 'Odyssey' },
    ]
  },
]

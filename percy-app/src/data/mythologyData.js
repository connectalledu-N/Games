export const godCards = [
  { name: 'Zeus', roman: 'Jupiter', domain: 'Sky & Thunder', symbol: '⚡', emoji: '⚡', color: '#7EB8F7', cabin: 1, fact: 'King of the Olympians. His master bolt is the most powerful weapon ever made. He controls weather, lightning, and the sky.', weapon: 'Master Bolt', sacred: 'Eagle, Oak tree' },
  { name: 'Poseidon', roman: 'Neptune', domain: 'Sea & Earthquakes', symbol: '🔱', emoji: '🌊', color: '#1B6B8E', cabin: 3, fact: 'God of the seas, storms, and earthquakes. He\'s Percy\'s dad! His trident can shake the earth itself.', weapon: 'Trident', sacred: 'Horse, Dolphin, Bull' },
  { name: 'Athena', roman: 'Minerva', domain: 'Wisdom & Craft', symbol: '🦉', emoji: '🏛️', color: '#9B72CF', cabin: 6, fact: 'Goddess of wisdom, crafts, and strategic warfare. Annabeth\'s mum! She was born fully grown and armoured from Zeus\'s head.', weapon: 'Spear & Aegis', sacred: 'Owl, Olive tree' },
  { name: 'Apollo', roman: 'Apollo', domain: 'Sun, Music & Archery', symbol: '☀️', emoji: '🎵', color: '#F5A623', cabin: 7, fact: 'God of the sun, music, poetry, archery, and prophecy. He drives the sun chariot across the sky each day and speaks through the Oracle at Delphi.', weapon: 'Silver Bow', sacred: 'Laurel tree, Raven, Dolphin' },
  { name: 'Ares', roman: 'Mars', domain: 'War & Violence', symbol: '⚔️', emoji: '🔴', color: '#E63946', cabin: 5, fact: 'God of war and bloodlust. Often comes off as a bully! He loves conflict and rides a motorcycle.', weapon: 'Spear', sacred: 'Boar, Serpent, Vulture' },
  { name: 'Hermes', roman: 'Mercury', domain: 'Messengers & Travel', symbol: '🪶', emoji: '✉️', color: '#1FB8A0', cabin: 11, fact: 'Messenger of the gods, god of travelers, thieves, and commerce. He wears winged sandals and carries the caduceus (a staff with two snakes).', weapon: 'Caduceus', sacred: 'Tortoise, Rooster, Ram' },
  { name: 'Artemis', roman: 'Diana', domain: 'Moon & Hunt', symbol: '🌙', emoji: '🏹', color: '#C084FC', cabin: 8, fact: 'Goddess of the moon and the hunt. She leads the Hunters of Artemis — a band of immortal maidens who hunt monsters.', weapon: 'Silver Bow', sacred: 'Deer, Cypress, Bear' },
  { name: 'Hephaestus', roman: 'Vulcan', domain: 'Fire & Forges', symbol: '🔨', emoji: '🔥', color: '#F97316', cabin: 9, fact: 'Blacksmith of the gods. He makes all divine weapons, including Zeus\'s lightning bolts! He was thrown from Olympus as a baby and landed in the sea, which is why he has a limp.', weapon: 'Hammer', sacred: 'Donkey, Fire, Volcano' },
  { name: 'Aphrodite', roman: 'Venus', domain: 'Love & Beauty', symbol: '💕', emoji: '🌹', color: '#F472B6', cabin: 10, fact: 'Goddess of love and beauty. She rose from sea foam. Even the other gods are affected by her power!', weapon: 'Magic girdle', sacred: 'Dove, Sparrow, Rose' },
  { name: 'Demeter', roman: 'Ceres', domain: 'Harvest & Agriculture', symbol: '🌾', emoji: '🌻', color: '#84CC16', cabin: 4, fact: 'Goddess of the harvest and seasons. She\'s Persephone\'s mother — when Persephone is in the Underworld, Demeter is sad and winter comes.', weapon: 'Sickle', sacred: 'Wheat, Poppy, Pig' },
  { name: 'Dionysus', roman: 'Bacchus', domain: 'Wine & Festivals', symbol: '🍇', emoji: '🍷', color: '#A855F7', cabin: 12, fact: 'God of wine, parties, and theatre. Known as "Mr. D" at Camp Half-Blood where he is reluctantly the director, punished by Zeus.', weapon: 'Thyrsus', sacred: 'Grapevine, Panther, Tiger' },
  { name: 'Hades', roman: 'Pluto', domain: 'The Underworld', symbol: '💀', emoji: '🌑', color: '#374151', cabin: null, fact: 'God of the dead and ruler of the Underworld. Not actually evil — just often misunderstood! He received the Underworld in a draw of lots with his brothers.', weapon: 'Helm of Darkness', sacred: 'Black ram, Narcissus, Cypress' },
]

export const mythQuizzes = [
  {
    id: 'olympians',
    title: 'Know Your Gods',
    icon: '🏛️',
    drachmas: 7,
    questions: [
      { q: 'Which god is Percy\'s father?', options: ['Zeus', 'Poseidon', 'Hades', 'Ares'], a: 'Poseidon' },
      { q: 'Annabeth is the daughter of which goddess?', options: ['Artemis', 'Aphrodite', 'Athena', 'Demeter'], a: 'Athena' },
      { q: 'What is Zeus\'s symbol of power?', options: ['Trident', 'Master Bolt', 'Helm of Darkness', 'Caduceus'], a: 'Master Bolt' },
      { q: 'Which god is the messenger of the gods?', options: ['Apollo', 'Hermes', 'Ares', 'Hephaestus'], a: 'Hermes' },
      { q: 'Who runs Camp Half-Blood as director?', options: ['Zeus', 'Chiron', 'Dionysus', 'Hermes'], a: 'Dionysus' },
      { q: 'Riptide — Percy\'s sword — turns into what when not in use?', options: ['A shield', 'A ring', 'A pen', 'A coin'], a: 'A pen' },
      { q: 'What do demigods eat to heal themselves?', options: ['Nectar and ambrosia', 'Honey and olives', 'Ichor and figs', 'Gold and laurel'], a: 'Nectar and ambrosia' },
      { q: 'Who built the Labyrinth?', options: ['Hephaestus', 'Athena', 'Daedalus', 'Minos'], a: 'Daedalus' },
    ]
  },
  {
    id: 'greek-roman',
    title: 'Greek vs Roman Names',
    icon: '🏺',
    drachmas: 8,
    questions: [
      { q: 'What is Poseidon\'s Roman name?', options: ['Mars', 'Neptune', 'Pluto', 'Vulcan'], a: 'Neptune' },
      { q: 'What is Zeus\'s Roman name?', options: ['Jupiter', 'Mars', 'Saturn', 'Mercury'], a: 'Jupiter' },
      { q: 'What is Athena\'s Roman name?', options: ['Juno', 'Diana', 'Minerva', 'Venus'], a: 'Minerva' },
      { q: 'What is Hermes\' Roman name?', options: ['Mercury', 'Mars', 'Neptune', 'Vulcan'], a: 'Mercury' },
      { q: 'What is Ares\' Roman name?', options: ['Neptune', 'Pluto', 'Mars', 'Saturn'], a: 'Mars' },
      { q: 'What is Artemis\' Roman name?', options: ['Venus', 'Diana', 'Juno', 'Minerva'], a: 'Diana' },
      { q: 'What is Hephaestus\' Roman name?', options: ['Vulcan', 'Pluto', 'Saturn', 'Mars'], a: 'Vulcan' },
      { q: 'What is Aphrodite\'s Roman name?', options: ['Juno', 'Diana', 'Venus', 'Ceres'], a: 'Venus' },
    ]
  },
  {
    id: 'myths',
    title: 'Great Myths',
    icon: '📖',
    drachmas: 9,
    questions: [
      { q: 'Perseus used a mirror-like shield to defeat which monster (whose gaze turns people to stone)?', options: ['Hydra', 'Medusa', 'Charybdis', 'Scylla'], a: 'Medusa' },
      { q: 'Which hero flew too close to the sun and fell into the sea?', options: ['Perseus', 'Hercules', 'Icarus', 'Jason'], a: 'Icarus' },
      { q: 'What is the three-headed dog that guards the entrance to the Underworld called?', options: ['Hydra', 'Cerberus', 'Chimera', 'Orthrus'], a: 'Cerberus' },
      { q: 'Pandora opened a box (actually a jar) and released what into the world?', options: ['The gods', 'All evils and troubles', 'The Titans', 'The Furies'], a: 'All evils and troubles' },
      { q: 'What did Theseus use to find his way out of the Labyrinth?', options: ['A magic compass', 'A ball of thread', 'Winged sandals', 'A torch'], a: 'A ball of thread' },
      { q: 'King Midas was granted the power to turn everything he touched into:', options: ['Silver', 'Diamonds', 'Gold', 'Ice'], a: 'Gold' },
      { q: 'Heracles (Hercules) had to complete how many labours?', options: ['10', '11', '12', '13'], a: '12' },
      { q: 'Which Titan did Zeus defeat to become ruler of the universe?', options: ['Atlas', 'Prometheus', 'Kronos', 'Hyperion'], a: 'Kronos' },
    ]
  },
]

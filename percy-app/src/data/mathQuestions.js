export const mathSections = [
  {
    id: 'tables',
    title: 'Tables Quest',
    icon: '⚡',
    color: '#7EB8F7',
    desc: 'Help Percy multiply his way through monsters!',
    drachmas: 5,
    questions: [
      { q: 'Percy has 7 blue pens to sign 8 books each at Camp Half-Blood. How many signatures is that?', a: '56', type: 'input', hint: '7 × 8' },
      { q: 'Annabeth sets out 9 rows of 6 armour sets in the armoury. How many sets in total?', a: '54', type: 'input', hint: '9 × 6' },
      { q: 'Grover needs to carry 7 bags of 7 golden apples to Olympus. How many apples?', a: '49', type: 'input', hint: '7 × 7' },
      { q: 'Poseidon has 8 tridents with 9 enchantments each. Total enchantments?', a: '72', type: 'input', hint: '8 × 9' },
      { q: 'There are 6 cabins with 8 demigods each at Camp Half-Blood. How many demigods?', a: '48', type: 'input', hint: '6 × 8' },
      { q: 'Ares has 9 squads of 9 warriors. How many warriors altogether?', a: '81', type: 'input', hint: '9 × 9' },
      { q: 'The Oracle gives 7 prophecies a year for 6 years. How many prophecies total?', a: '42', type: 'input', hint: '7 × 6' },
      { q: 'Thalia\'s pine tree has been standing for 8 years and grew 9 rings each year. How many rings?', a: '72', type: 'input', hint: '8 × 9' },
    ]
  },
  {
    id: 'operations',
    title: 'Operations on Olympus',
    icon: '🏛️',
    color: '#F5A623',
    desc: 'Multi-step challenges from Olympus itself!',
    drachmas: 8,
    questions: [
      { q: 'Percy collected 347 drachmas from monsters this week and 289 last week. How many does he have altogether?', a: '636', type: 'input', hint: 'Add 347 + 289' },
      { q: 'Camp Half-Blood had 524 campers. After 167 went on quests, how many remain at camp?', a: '357', type: 'input', hint: 'Subtract 167 from 524' },
      { q: 'Hermes delivers 1,248 messages in a month. Iris delivers 763. How many more does Hermes deliver?', a: '485', type: 'input', hint: 'Find the difference' },
      { q: '4 cabins each have 23 demigods. How many demigods are there in those 4 cabins?', a: '92', type: 'input', hint: 'Multiply 4 × 23' },
      { q: 'Percy swims 456 laps in the Long Island Sound in 6 days. How many laps per day (same each day)?', a: '76', type: 'input', hint: 'Divide 456 ÷ 6' },
      { q: 'Annabeth uses 325 nails to build 5 equal walls for the labyrinth. Nails per wall?', a: '65', type: 'input', hint: 'Divide 325 ÷ 5' },
      { q: 'Zeus throws 18 lightning bolts in the morning and 27 in the afternoon. He uses the same number for 3 days. Total bolts?', a: '135', type: 'input', hint: '(18+27) × 3' },
      { q: 'The hydra has 9 heads. Each head bites 12 heroes. Ares then sends 40 more heroes to fight. How many heroes were bitten first?', a: '108', type: 'input', hint: '9 × 12' },
    ]
  },
  {
    id: 'division',
    title: 'Division Dungeon',
    icon: '🗡️',
    color: '#1FB8A0',
    desc: 'Divide your way out of the Labyrinth!',
    drachmas: 8,
    questions: [
      { q: '72 ambrosia pieces shared equally between 8 demigods. How many each?', a: '9', type: 'input', hint: '72 ÷ 8' },
      { q: '56 shields divided equally among 7 Ares cabin members. How many each?', a: '8', type: 'input', hint: '56 ÷ 7' },
      { q: 'Poseidon splits 540 sea creatures into groups of 9. How many groups?', a: '60', type: 'input', hint: '540 ÷ 9' },
      { q: 'Hephaestus makes 84 swords in 7 days, the same number each day. How many per day?', a: '12', type: 'input', hint: '84 ÷ 7' },
      { q: '315 campers split into groups of 5 for quest training. How many groups?', a: '63', type: 'input', hint: '315 ÷ 5' },
      { q: '288 arrows in the Apollo cabin. 8 archers share them equally. How many each?', a: '36', type: 'input', hint: '288 ÷ 8' },
    ]
  },
  {
    id: 'decimals',
    title: 'Decimal Depths',
    icon: '🌊',
    color: '#9B72CF',
    desc: 'Dive deep with Poseidon and discover decimals!',
    drachmas: 10,
    questions: [
      { q: 'Percy dives 3.5 metres on his first dive and 2.8 metres on his second. How deep total?', a: '6.3', type: 'input', hint: '3.5 + 2.8' },
      { q: 'Annabeth runs 5.7 km in the morning and 3.4 km in the evening. Total km?', a: '9.1', type: 'input', hint: '5.7 + 3.4' },
      { q: 'Grover eats 4.6 kg of tin cans. He\'d planned to eat 7.0 kg. How many kg are left to eat?', a: '2.4', type: 'input', hint: '7.0 − 4.6' },
      { q: 'A potion bottle holds 1.5 litres. Percy uses 0.75 litres. How much is left?', a: '0.75', type: 'input', hint: '1.5 − 0.75' },
      { q: 'Is 3.7 greater than, less than, or equal to 3.70?', a: 'equal', type: 'mc', options: ['greater than', 'less than', 'equal'], hint: 'Think about trailing zeros' },
      { q: 'Put these in order smallest to largest: 4.2, 4.09, 4.15', a: '4.09, 4.15, 4.2', type: 'mc', options: ['4.2, 4.15, 4.09', '4.09, 4.15, 4.2', '4.15, 4.09, 4.2'], hint: 'Compare the tenths digit first' },
    ]
  },
]

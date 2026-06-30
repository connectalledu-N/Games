export const scienceSections = [
  {
    id: 'weather-zeus',
    title: 'Zeus & Weather Science',
    icon: '⚡',
    color: '#7EB8F7',
    intro: 'Zeus controls weather — but there\'s real science behind every storm! Let\'s explore.',
    drachmas: 7,
    facts: [
      { title: 'Lightning', icon: '⚡', text: 'Lightning is a huge electric spark caused when ice crystals inside a cloud collide and create electrical charge. The bolt can be up to 5 times hotter than the surface of the sun — about 30,000°C!' },
      { title: 'Thunder', icon: '🌩️', text: 'Thunder is the sound lightning makes. The lightning superheats the air around it so fast that the air expands and makes a BOOM. You can calculate how far away a storm is: count seconds between lightning and thunder, then divide by 3 to get the distance in kilometres.' },
      { title: 'Clouds', icon: '☁️', text: 'Cumulus clouds (big puffy ones) can turn into cumulonimbus — the thunderstorm clouds. These can reach 12km high and carry enough water to fill millions of swimming pools.' },
      { title: 'The Water Cycle', icon: '💧', text: 'Water evaporates → forms clouds → falls as rain → flows to seas → evaporates again. Zeus\'s storms are just one part of this amazing cycle that has been running for billions of years.' },
    ],
    questions: [
      { q: 'Lightning is 5 times hotter than the sun\'s surface. If the sun\'s surface is 5,500°C, how hot is lightning? (use your times tables!)', a: '27500', type: 'input', hint: '5 × 5,500 = ?' },
      { q: 'You see lightning. You count 9 seconds before you hear thunder. How far away is the storm in km?', a: '3', type: 'input', hint: '9 ÷ 3 = ?' },
      { q: 'What type of cloud produces thunderstorms?', options: ['Cumulus', 'Stratus', 'Cumulonimbus', 'Cirrus'], a: 'Cumulonimbus', type: 'mc' },
      { q: 'In the water cycle, what happens to water in the sea when it\'s sunny?', options: ['It freezes', 'It evaporates into the sky', 'It turns into clouds immediately', 'It flows to rivers'], a: 'It evaporates into the sky', type: 'mc' },
    ]
  },
  {
    id: 'ocean-poseidon',
    title: 'Poseidon & Ocean Science',
    icon: '🌊',
    color: '#1B6B8E',
    intro: 'Poseidon rules the seas — and oceans cover 71% of our planet. They\'re full of incredible science!',
    drachmas: 7,
    facts: [
      { title: 'Ocean Zones', icon: '🌊', text: 'The ocean has 5 zones: Sunlight Zone (0–200m, full of life), Twilight Zone (200–1000m, dim), Midnight Zone (1000–4000m, pitch black), Abyssal Zone (4000–6000m, near freezing), and the Hadal Zone (deepest trenches, up to 11km!).' },
      { title: 'Ocean Currents', icon: '🔄', text: 'Huge rivers of water flow through the ocean — these are called currents. The Gulf Stream carries warm water from the Gulf of Mexico to Europe, making our climate warmer. Poseidon\'s "roads" are real!' },
      { title: 'Marine Animals', icon: '🐬', text: 'The ocean holds the largest animal that has ever lived — the blue whale (up to 30m long!). But there\'s also tiny plankton that produce 50% of Earth\'s oxygen. Every other breath you take comes from the sea.' },
      { title: 'Tides', icon: '🌙', text: 'Tides are caused by the moon\'s gravity pulling on Earth\'s oceans. High tide = water pulled toward the moon. Low tide = water falls back. Most places get 2 high tides and 2 low tides per day.' },
    ],
    questions: [
      { q: 'Which ocean zone has NO sunlight at all?', options: ['Sunlight Zone', 'Twilight Zone', 'Midnight Zone', 'Coral Zone'], a: 'Midnight Zone', type: 'mc' },
      { q: 'What percentage of Earth\'s surface is covered by ocean?', options: ['50%', '60%', '71%', '85%'], a: '71%', type: 'mc' },
      { q: 'What causes ocean tides?', options: ['The sun\'s heat', 'The moon\'s gravity', 'Ocean currents', 'Wind'], a: 'The moon\'s gravity', type: 'mc' },
      { q: 'How much of Earth\'s oxygen do tiny marine plankton produce?', options: ['10%', '25%', '50%', '75%'], a: '50%', type: 'mc' },
    ]
  },
  {
    id: 'constellations',
    title: 'Stars & Constellations',
    icon: '⭐',
    color: '#9B72CF',
    intro: 'The ancient Greeks looked at the night sky and saw their myths written in stars. Many constellations we know today have Greek names!',
    drachmas: 7,
    facts: [
      { title: 'Orion the Hunter', icon: '🏹', text: 'Orion was a great hunter in Greek myth. His constellation has 7 main stars including Betelgeuse (a giant red star) and Rigel. You can find Orion\'s belt — 3 stars in a straight line — in winter skies.' },
      { title: 'Cassiopeia', icon: '👑', text: 'Cassiopeia was a vain queen in Greek myth. Her constellation looks like the letter W or M in the sky. It\'s visible all year round in the Northern Hemisphere because it\'s so close to the North Star.' },
      { title: 'Perseus', icon: '⚔️', text: 'Perseus (who defeated Medusa) has his own constellation! It contains the star Algol, which ancient Arabs called "the Demon Star" because it seems to wink — it\'s actually two stars orbiting each other.' },
      { title: 'Ursa Major (Great Bear)', icon: '🐻', text: 'Callisto was turned into a bear by Zeus and placed in the stars. The Big Dipper is part of Ursa Major. The two stars at the end of the Dipper\'s bowl point straight to Polaris — the North Star.' },
    ],
    questions: [
      { q: 'What does the word "constellation" mean?', options: ['A group of planets', 'A pattern of stars', 'A type of telescope', 'A star\'s colour'], a: 'A pattern of stars', type: 'mc' },
      { q: 'Which constellation looks like a W or M in the sky?', options: ['Orion', 'Perseus', 'Cassiopeia', 'Ursa Major'], a: 'Cassiopeia', type: 'mc' },
      { q: 'Orion\'s Belt is made of how many stars?', options: ['2', '3', '4', '7'], a: '3', type: 'mc' },
      { q: 'What is the North Star (Polaris) useful for?', options: ['Telling time', 'Finding North for navigation', 'Predicting weather', 'Measuring distance to the moon'], a: 'Finding North for navigation', type: 'mc' },
    ]
  },
]

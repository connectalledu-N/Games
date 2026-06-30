export const geoQuizzes = [
  {
    id: 'greece-places',
    title: 'Map of Ancient Greece',
    icon: '🗺️',
    drachmas: 7,
    questions: [
      { q: 'Which mountain did the ancient Greeks believe the gods lived on?', options: ['Mount Etna', 'Mount Olympus', 'Mount Parnassus', 'Mount Ida'], a: 'Mount Olympus', fact: 'Mount Olympus is the highest mountain in Greece at 2,917 metres!' },
      { q: 'Where was the Oracle of Delphi located?', options: ['Athens', 'Sparta', 'Delphi', 'Corinth'], a: 'Delphi', fact: 'Delphi was considered the centre of the world by ancient Greeks. A priestess called the Pythia gave prophecies there.' },
      { q: 'What is the name of the famous ancient temple on the hill above Athens?', options: ['The Parthenon', 'The Colosseum', 'The Pantheon', 'The Agora'], a: 'The Parthenon', fact: 'The Parthenon was built for Athena, patron goddess of Athens, around 447 BC.' },
      { q: 'Which city was famous for its fierce warriors and military training?', options: ['Athens', 'Corinth', 'Sparta', 'Olympia'], a: 'Sparta', fact: 'Spartan boys began military training at age 7! Girls also trained to be strong.' },
      { q: 'Where were the ancient Olympic Games held every 4 years?', options: ['Athens', 'Olympia', 'Delphi', 'Corinth'], a: 'Olympia', fact: 'The ancient Olympics began in 776 BC and were held in Olympia, in honour of Zeus.' },
      { q: 'What sea is Greece surrounded by (mainly to the east)?', options: ['Mediterranean Sea', 'Aegean Sea', 'Ionian Sea', 'Black Sea'], a: 'Aegean Sea', fact: 'The Aegean Sea is between Greece and Turkey. It has over 1,400 islands!' },
      { q: 'Athens is located in which region of Greece?', options: ['Thessaly', 'Macedonia', 'Attica', 'Peloponnese'], a: 'Attica', fact: 'Attica is the peninsula where Athens sits. In ancient times it was a separate city-state.' },
      { q: 'What is the capital city of modern Greece?', options: ['Thessaloniki', 'Athens', 'Sparta', 'Corinth'], a: 'Athens', fact: 'Athens has been continuously inhabited for over 3,000 years — one of the oldest cities in the world.' },
    ]
  },
  {
    id: 'ancient-modern',
    title: 'Ancient vs Modern Greece',
    icon: '⏳',
    drachmas: 8,
    questions: [
      { q: 'Ancient Greeks used drachmas as money. What currency does modern Greece use?', options: ['Drachma still', 'Euro', 'Pound', 'Lira'], a: 'Euro', fact: 'Greece joined the Eurozone in 2001 and replaced the drachma with the euro.' },
      { q: 'Ancient Greeks wrote in Greek. Do modern Greeks still use the same alphabet?', options: ['Yes, Greek is still used', 'No, they use the Roman alphabet', 'No, they use Arabic script', 'No, they use Cyrillic'], a: 'Yes, Greek is still used', fact: 'The Greek alphabet is one of the oldest alphabets still in use. Many letters gave us English ones: Alpha→A, Beta→B!' },
      { q: 'The ancient Greeks held the Olympics. How often are the modern Olympics held?', options: ['Every 2 years', 'Every 3 years', 'Every 4 years', 'Every 5 years'], a: 'Every 4 years', fact: 'The modern Olympics were revived in 1896 in Athens. Greece always enters first in the parade of nations.' },
      { q: 'Ancient Athenians invented democracy. Does modern Greece have a democracy?', options: ['Yes — it\'s a republic', 'No — it\'s a monarchy', 'No — it\'s a dictatorship', 'Yes — it\'s a city-state system'], a: 'Yes — it\'s a republic', fact: '"Democracy" comes from Greek: demos (people) + kratos (power). Power of the people!' },
      { q: 'Ancient Greek myths featured many gods. What is the main religion in modern Greece?', options: ['Ancient Greek polytheism', 'Islam', 'Greek Orthodox Christianity', 'Roman Catholicism'], a: 'Greek Orthodox Christianity', fact: 'About 90% of Greeks today are Greek Orthodox Christian. But ancient temples like the Parthenon are treasured cultural sites.' },
      { q: 'In ancient times, Greece was divided into city-states. Modern Greece is:', options: ['Still city-states', 'One unified country', 'Part of Turkey', 'Part of Italy'], a: 'One unified country', fact: 'Modern Greece (the Hellenic Republic) was unified in the 19th century after gaining independence from the Ottoman Empire in 1821.' },
    ]
  },
  {
    id: 'percy-journey',
    title: 'Percy\'s Quest Map',
    icon: '🧭',
    drachmas: 6,
    questions: [
      { q: 'Camp Half-Blood is located near which US state?', options: ['California', 'New York', 'Florida', 'Texas'], a: 'New York', fact: 'Camp Half-Blood is on Long Island, New York — a real place you could visit (without the monsters!).' },
      { q: 'In The Lightning Thief, Percy travels across which country?', options: ['Greece', 'Italy', 'The United States', 'Canada'], a: 'The United States', fact: 'The quest takes Percy from New York all the way to Los Angeles, where Olympus is located on the 600th floor of the Empire State Building (in the story).' },
      { q: 'In Greek myth, the Underworld (Hades\'s realm) is sometimes said to be entered via which real place?', options: ['Mount Olympus', 'Cape Matapan, Greece', 'The Aegean Sea', 'The Acropolis'], a: 'Cape Matapan, Greece', fact: 'Cape Matapan (Tenaro) in the Peloponnese was considered an entrance to the Underworld in real Greek myth.' },
      { q: 'Mount Olympus is located in which part of Greece?', options: ['Southern Greece', 'Northern Greece', 'On an island', 'In Athens'], a: 'Northern Greece', fact: 'Mount Olympus is in northern Greece, near Thessaloniki, on the border between Thessaly and Macedonia.' },
      { q: 'The Mediterranean Sea connects Greece to which continent to the south?', options: ['Asia', 'Africa', 'South America', 'Australia'], a: 'Africa', fact: 'Greece is in southeastern Europe. Across the Mediterranean to the south is Africa (mainly Libya and Egypt).' },
    ]
  },
]

export const mapLabels = [
  { id: 'olympus', label: 'Mount Olympus', x: 38, y: 20, fact: 'Home of the 12 Olympian gods' },
  { id: 'athens', label: 'Athens (Attica)', x: 50, y: 62, fact: 'Birthplace of democracy' },
  { id: 'sparta', label: 'Sparta', x: 44, y: 72, fact: 'Famous for its fierce warriors' },
  { id: 'olympia', label: 'Olympia', x: 34, y: 68, fact: 'Home of the ancient Olympic Games' },
  { id: 'delphi', label: 'Delphi', x: 43, y: 52, fact: 'Site of the Oracle' },
  { id: 'crete', label: 'Crete', x: 52, y: 90, fact: 'Home of the Minotaur\'s labyrinth' },
]

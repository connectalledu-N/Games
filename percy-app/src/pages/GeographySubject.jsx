import { useState } from 'react'
import { geoQuizzes } from '../data/geographyData'
import QuizEngine from '../components/QuizEngine'
import Header from '../components/Header'

export default function GeographySubject({ onBack }) {
  const [active, setActive] = useState(null)

  if (active) {
    const quiz = geoQuizzes.find(q => q.id === active)
    return (
      <div className="min-h-screen">
        <Header onBack={() => setActive(null)} title={quiz.title} />
        <div className="max-w-xl mx-auto px-4 py-6">
          <QuizEngine
            questions={quiz.questions}
            drachmasPerQ={quiz.drachmas}
            sectionId={`geo-${quiz.id}`}
            onFinish={() => setActive(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header onBack={onBack} title="Geography Map" />
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🗺️</div>
          <h2 className="font-cinzel text-2xl text-teal-400 mb-2">Geography Map</h2>
          <p className="text-gray-400 text-sm">Explore ancient and modern Greece through Percy's eyes</p>
        </div>

        {/* Greece reference image area */}
        <div className="rounded-2xl p-4 mb-6 border border-teal-600/20" style={{ background: '#0d2030' }}>
          <div className="font-semibold text-teal-400 mb-2 text-sm">🗺️ Key Places in Greece</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
            {[
              ['Mount Olympus', 'Northern Greece — home of the gods'],
              ['Athens / Attica', 'Southeast mainland — birthplace of democracy'],
              ['Delphi', 'Central Greece — home of the Oracle'],
              ['Olympia', 'Peloponnese — home of the ancient Olympics'],
              ['Sparta', 'Southern Peloponnese — fierce warriors'],
              ['Crete (island)', 'Largest Greek island — Minotaur\'s labyrinth'],
            ].map(([place, desc]) => (
              <div key={place} className="bg-white/5 rounded-lg p-2">
                <div className="text-teal-300 font-semibold mb-0.5">{place}</div>
                <div className="text-gray-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {geoQuizzes.map(q => (
            <button
              key={q.id}
              onClick={() => setActive(q.id)}
              className="card-hover rounded-2xl p-5 text-left border border-white/10 flex items-center gap-4"
              style={{ background: 'linear-gradient(135deg, #051a1a, #0a2a2a)' }}
            >
              <span className="text-3xl">{q.icon}</span>
              <div className="flex-1">
                <div className="font-cinzel font-semibold text-teal-300 mb-1">{q.title}</div>
                <div className="text-xs text-yellow-400">🪙 {q.drachmas} drachmas per question</div>
              </div>
              <div className="text-gray-600">›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { godCards, mythQuizzes } from '../data/mythologyData'
import QuizEngine from '../components/QuizEngine'
import Header from '../components/Header'

function GodCard({ god, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6 relative" style={{ background: '#0D2137', border: `2px solid ${god.color}40` }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">✕</button>
        <div className="text-5xl mb-3 text-center">{god.emoji}</div>
        <h3 className="font-cinzel text-xl text-center mb-1" style={{ color: god.color }}>{god.name}</h3>
        <p className="text-center text-gray-400 text-sm mb-4">Roman name: <span className="text-white">{god.roman}</span></p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Domain</div>
            <div className="text-sm text-white">{god.domain}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Weapon</div>
            <div className="text-sm text-white">{god.weapon}</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3 mb-3">
          <div className="text-xs text-gray-500 mb-1">Sacred to</div>
          <div className="text-sm text-white">{god.sacred}</div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed">{god.fact}</p>
        {god.cabin && <div className="mt-3 text-xs text-center text-yellow-400">Camp Cabin #{god.cabin}</div>}
      </div>
    </div>
  )
}

export default function MythologySubject({ onBack }) {
  const [view, setView] = useState('menu') // 'menu' | 'godcards' | quiz id
  const [selectedGod, setSelectedGod] = useState(null)

  if (view !== 'menu' && view !== 'godcards') {
    const quiz = mythQuizzes.find(q => q.id === view)
    return (
      <div className="min-h-screen">
        <Header onBack={() => setView('menu')} title={quiz.title} />
        <div className="max-w-xl mx-auto px-4 py-6">
          <QuizEngine
            questions={quiz.questions}
            drachmasPerQ={quiz.drachmas}
            sectionId={`myth-${quiz.id}`}
            onFinish={() => setView('menu')}
          />
        </div>
      </div>
    )
  }

  if (view === 'godcards') {
    return (
      <div className="min-h-screen">
        <Header onBack={() => setView('menu')} title="God Cards" />
        <div className="max-w-xl mx-auto px-4 py-6">
          <p className="text-gray-400 text-sm mb-4 text-center">Tap any card to learn more</p>
          <div className="grid grid-cols-3 gap-3">
            {godCards.map(god => (
              <button
                key={god.name}
                onClick={() => setSelectedGod(god)}
                className="card-hover rounded-xl p-3 text-center border border-white/10 flex flex-col items-center gap-2"
                style={{ background: god.color + '15', borderColor: god.color + '30' }}
              >
                <div className="text-3xl">{god.emoji}</div>
                <div className="text-xs font-semibold" style={{ color: god.color }}>{god.name}</div>
                <div className="text-xs text-gray-500 leading-tight">{god.domain.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>
        {selectedGod && <GodCard god={selectedGod} onClose={() => setSelectedGod(null)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header onBack={onBack} title="Myth Academy" />
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏛️</div>
          <h2 className="font-cinzel text-2xl text-purple-400 mb-2">Myth Academy</h2>
          <p className="text-gray-400 text-sm">Discover the gods, the myths, and the legends of Ancient Greece</p>
        </div>

        {/* God cards */}
        <button
          onClick={() => setView('godcards')}
          className="card-hover w-full rounded-2xl p-5 text-left border border-purple-500/30 mb-4"
          style={{ background: 'linear-gradient(135deg, #1a0a2e, #2d1052)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🪬</span>
            <div>
              <div className="font-cinzel font-semibold text-purple-300 mb-1">God Cards</div>
              <div className="text-sm text-gray-400">Explore all 12 Olympians + Hades — tap to reveal their secrets</div>
            </div>
          </div>
        </button>

        {/* Quizzes */}
        {mythQuizzes.map(q => (
          <button
            key={q.id}
            onClick={() => setView(q.id)}
            className="card-hover w-full rounded-2xl p-5 text-left border border-white/10 mb-3 flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg, #0D2137, #150d2e)' }}
          >
            <span className="text-3xl">{q.icon}</span>
            <div className="flex-1">
              <div className="font-cinzel font-semibold text-purple-300 mb-1">{q.title}</div>
              <div className="text-xs text-yellow-400">🪙 {q.drachmas} drachmas per question</div>
            </div>
            <div className="text-gray-600">›</div>
          </button>
        ))}
      </div>
    </div>
  )
}

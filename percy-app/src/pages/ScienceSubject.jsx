import { useState } from 'react'
import { scienceSections } from '../data/scienceData'
import QuizEngine from '../components/QuizEngine'
import Header from '../components/Header'

export default function ScienceSubject({ onBack }) {
  const [active, setActive] = useState(null)
  const [view, setView] = useState('facts') // 'facts' | 'quiz'

  if (!active) {
    return (
      <div className="min-h-screen">
        <Header onBack={onBack} title="Science Lab" />
        <div className="max-w-xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔬</div>
            <h2 className="font-cinzel text-2xl text-green-400 mb-2">Science Lab</h2>
            <p className="text-gray-400 text-sm">Discover the real science behind the gods' powers!</p>
          </div>
          <div className="flex flex-col gap-4">
            {scienceSections.map(s => (
              <button
                key={s.id}
                onClick={() => { setActive(s); setView('facts') }}
                className="card-hover rounded-2xl p-5 text-left border border-white/10 flex items-center gap-4"
                style={{ background: 'linear-gradient(135deg, #051a0a, #0a2014)' }}
              >
                <span className="text-3xl">{s.icon}</span>
                <div className="flex-1">
                  <div className="font-cinzel font-semibold mb-1" style={{ color: s.color }}>{s.title}</div>
                  <div className="text-xs text-gray-400">{s.intro.slice(0, 60)}…</div>
                  <div className="text-xs text-yellow-400 mt-1">🪙 {s.drachmas} drachmas per question</div>
                </div>
                <div className="text-gray-600">›</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'quiz') {
    return (
      <div className="min-h-screen">
        <Header onBack={() => setView('facts')} title={active.title + ' — Quiz'} />
        <div className="max-w-xl mx-auto px-4 py-6">
          <QuizEngine
            questions={active.questions}
            drachmasPerQ={active.drachmas}
            sectionId={`sci-${active.id}`}
            onFinish={() => setActive(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header onBack={() => setActive(null)} title={active.title} />
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">{active.icon}</div>
          <h2 className="font-cinzel text-xl mb-2" style={{ color: active.color }}>{active.title}</h2>
          <p className="text-gray-400 text-sm">{active.intro}</p>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          {active.facts.map(f => (
            <div key={f.title} className="rounded-xl p-4 border border-white/10" style={{ background: active.color + '10' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{f.icon}</span>
                <span className="font-semibold" style={{ color: active.color }}>{f.title}</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setView('quiz')}
          className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors font-cinzel"
        >
          Test Your Knowledge →
        </button>
      </div>
    </div>
  )
}

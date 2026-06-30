import { useState } from 'react'
import { mathSections } from '../data/mathQuestions'
import QuizEngine from '../components/QuizEngine'
import Header from '../components/Header'

export default function MathSubject({ onBack }) {
  const [active, setActive] = useState(null)

  if (active) {
    const section = mathSections.find(s => s.id === active)
    return (
      <div className="min-h-screen">
        <Header onBack={() => setActive(null)} title={section.title} />
        <div className="max-w-xl mx-auto px-4 py-6">
          <QuizEngine
            questions={section.questions}
            drachmasPerQ={section.drachmas}
            sectionId={`math-${section.id}`}
            onFinish={() => setActive(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header onBack={onBack} title="Maths Quest" />
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h2 className="font-cinzel text-2xl text-blue-300 mb-2">Maths Quest</h2>
          <p className="text-gray-400 text-sm">Solve Percy Jackson maths challenges to earn drachmas!</p>
        </div>

        <div className="flex flex-col gap-4">
          {mathSections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="card-hover rounded-2xl p-5 text-left border border-white/10 flex items-center gap-4"
              style={{ background: 'linear-gradient(135deg, #0D2137, #0A2847)' }}
            >
              <div className="text-3xl">{s.icon}</div>
              <div className="flex-1">
                <div className="font-cinzel font-semibold mb-1" style={{ color: s.color }}>{s.title}</div>
                <div className="text-sm text-gray-400">{s.desc}</div>
                <div className="text-xs text-yellow-400 mt-1">🪙 {s.drachmas} drachmas per question</div>
              </div>
              <div className="text-gray-600 text-xl">›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

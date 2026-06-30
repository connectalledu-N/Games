import { useState } from 'react'
import { craftProjects } from '../data/craftData'
import Header from '../components/Header'

function ProjectView({ project, onBack }) {
  const [step, setStep] = useState(-1) // -1 = overview

  if (step >= 0 && step < project.steps.length) {
    const s = project.steps[step]
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="progress-bar flex-1">
            <div className="progress-fill" style={{ width: `${((step + 1) / project.steps.length) * 100}%` }} />
          </div>
          <span className="text-sm text-gray-400">Step {step + 1}/{project.steps.length}</span>
        </div>

        <div className="rounded-2xl p-6 mb-5" style={{ background: project.color + '15', border: `1px solid ${project.color}30` }}>
          <div className="font-cinzel text-lg mb-2" style={{ color: project.color }}>Step {s.step}: {s.title}</div>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">{s.desc}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white py-3 rounded-xl transition-colors"
          >
            ← Back
          </button>
          {step < project.steps.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex-1 text-white font-semibold py-3 rounded-xl transition-colors"
              style={{ background: project.color }}
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={() => setStep(project.steps.length)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition-colors"
            >
              Finished! 🎉
            </button>
          )}
        </div>
      </div>
    )
  }

  if (step === project.steps.length) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎨</div>
        <div className="font-cinzel text-2xl text-yellow-400 mb-4">Amazing Work!</div>
        <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
          <div className="text-sm text-yellow-400 font-semibold mb-2">⭐ Bonus Challenge</div>
          <p className="text-gray-300 text-sm">{project.bonus}</p>
        </div>
        <div className="bg-blue-900/30 rounded-xl p-4 mb-6 text-left border border-blue-500/20">
          <div className="text-sm text-blue-400 font-semibold mb-2">📚 This project links to:</div>
          <p className="text-gray-300 text-sm">{project.learnLink}</p>
        </div>
        <button onClick={onBack} className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
          Back to Craft Workshop
        </button>
      </div>
    )
  }

  // Overview
  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">{project.icon}</div>
        <h2 className="font-cinzel text-2xl mb-2" style={{ color: project.color }}>{project.title}</h2>
        <div className="flex justify-center gap-4 text-sm text-gray-400">
          <span>⏱ {project.time}</span>
          <span>⭐ {project.difficulty}</span>
        </div>
      </div>

      <p className="text-gray-300 mb-5 text-center">{project.intro}</p>

      <div className="rounded-xl p-4 mb-5 border border-white/10" style={{ background: '#0D2137' }}>
        <div className="font-semibold text-white mb-2 text-sm">You'll need:</div>
        <ul className="text-sm text-gray-300 space-y-1">
          {project.materials.map(m => <li key={m} className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">•</span>{m}</li>)}
        </ul>
      </div>

      <div className="flex flex-col gap-2 mb-5">
        {project.steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3 text-sm py-2 border-b border-white/5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: project.color + '30', color: project.color }}>
              {s.step}
            </div>
            <span className="text-gray-300">{s.title}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setStep(0)}
        className="w-full text-white font-bold py-3 rounded-xl transition-colors font-cinzel"
        style={{ background: project.color }}
      >
        Start Project →
      </button>
    </div>
  )
}

export default function CraftSubject({ onBack }) {
  const [active, setActive] = useState(null)

  return (
    <div className="min-h-screen">
      <Header onBack={active ? () => setActive(null) : onBack} title={active ? active.title : 'Craft Workshop'} />
      <div className="max-w-xl mx-auto px-4 py-6">
        {active ? (
          <ProjectView project={active} onBack={() => setActive(null)} />
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🎨</div>
              <h2 className="font-cinzel text-2xl text-pink-400 mb-2">Craft Workshop</h2>
              <p className="text-gray-400 text-sm">Step-by-step guides for hands-on Percy Jackson projects</p>
            </div>
            <div className="flex flex-col gap-4">
              {craftProjects.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActive(p)}
                  className="card-hover rounded-2xl p-5 text-left border border-white/10"
                  style={{ background: p.color + '10', borderColor: p.color + '25' }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{p.icon}</span>
                    <div className="flex-1">
                      <div className="font-cinzel font-semibold mb-1" style={{ color: p.color }}>{p.title}</div>
                      <div className="text-xs text-gray-400 mb-2">{p.intro.slice(0, 70)}…</div>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>⏱ {p.time}</span>
                        <span>⭐ {p.difficulty}</span>
                        <span>📦 {p.steps.length} steps</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

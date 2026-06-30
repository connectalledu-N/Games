import { useState } from 'react'
import { spellingSections } from '../data/spellingData'
import QuizEngine from '../components/QuizEngine'
import Header from '../components/Header'
import { useApp } from '../store'

function WordFill({ word, onCorrect }) {
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const correct = input.toLowerCase() === word.missing.toLowerCase()

  const check = () => { setChecked(true); if (correct) onCorrect() }

  return (
    <div className="bg-white/5 rounded-xl p-4 mb-3">
      <div className="text-gray-400 text-sm mb-1">{word.clue}</div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl font-bold tracking-widest text-white">{word.display.replace('_', '').split('').map((c, i) => (
          c === '_' ? <span key={i} className="inline-block border-b-2 border-yellow-400 w-6 mx-1" /> : c
        ))}</span>
      </div>
      <div className="flex gap-2">
        <input
          className="text-input text-center font-bold w-16 text-lg"
          placeholder={word.missing.replace(/./g, '_')}
          value={input}
          maxLength={word.missing.length}
          onChange={e => setInput(e.target.value)}
          disabled={checked}
        />
        {!checked && (
          <button onClick={check} className="bg-teal-600 hover:bg-teal-500 text-white px-4 rounded-lg text-sm">
            Check
          </button>
        )}
        {checked && (
          <span className={correct ? 'text-green-400 self-center' : 'text-red-400 self-center'}>
            {correct ? '✅ Correct!' : `❌ It's "${word.missing}"`}
          </span>
        )}
      </div>
      {word.silent && <div className="text-xs text-gray-500 mt-1">Silent letter: "{word.silent}"</div>}
    </div>
  )
}

export default function SpellingSubject({ onBack }) {
  const [active, setActive] = useState(null)
  const [view, setView] = useState('intro') // 'intro' | 'words' | 'quiz'
  const { addDrachmas } = useApp()

  if (!active) {
    return (
      <div className="min-h-screen">
        <Header onBack={onBack} title="Spelling Scrolls" />
        <div className="max-w-xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📜</div>
            <h2 className="font-cinzel text-2xl text-yellow-400 mb-2">Spelling Scrolls</h2>
            <p className="text-gray-400 text-sm">Master spelling rules with Percy Jackson vocabulary!</p>
          </div>
          <div className="flex flex-col gap-4">
            {spellingSections.map(s => (
              <button
                key={s.id}
                onClick={() => { setActive(s); setView('intro') }}
                className="card-hover rounded-2xl p-5 text-left border border-white/10"
                style={{ background: 'linear-gradient(135deg, #1a0e00, #2d1e00)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{s.icon}</span>
                  <div className="font-cinzel font-semibold" style={{ color: s.color }}>{s.title}</div>
                </div>
                <div className="text-sm text-gray-400">{s.rule.slice(0, 80)}…</div>
                <div className="text-xs text-yellow-400 mt-2">🪙 {s.drachmas} drachmas per question</div>
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
        <Header onBack={() => setView(active.words ? 'words' : 'intro')} title={active.title} />
        <div className="max-w-xl mx-auto px-4 py-6">
          <QuizEngine
            questions={active.quiz}
            drachmasPerQ={active.drachmas}
            sectionId={`spelling-${active.id}`}
            onFinish={() => setActive(null)}
          />
        </div>
      </div>
    )
  }

  if (view === 'words' && active.words) {
    let correctCount = 0
    return (
      <div className="min-h-screen">
        <Header onBack={() => setView('intro')} title={active.title + ' — Practice'} />
        <div className="max-w-xl mx-auto px-4 py-6">
          <div className="bg-blue-900/30 rounded-xl p-4 mb-5 border border-blue-500/20">
            <p className="text-sm text-blue-300">{active.rule}</p>
          </div>
          {active.words.map(w => (
            <WordFill key={w.word} word={w} onCorrect={() => { correctCount++; addDrachmas(2) }} />
          ))}
          <button
            onClick={() => setView('quiz')}
            className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition-colors"
          >
            Now take the quiz →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header onBack={() => setActive(null)} title={active.title} />
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{active.icon}</div>
          <h2 className="font-cinzel text-xl mb-3" style={{ color: active.color }}>{active.title}</h2>
        </div>
        <div className="bg-yellow-900/30 rounded-xl p-5 border border-yellow-600/20 mb-6">
          <div className="font-semibold text-yellow-400 mb-2">The Rule 📜</div>
          <p className="text-gray-300">{active.rule}</p>
        </div>
        <div className="flex flex-col gap-3">
          {active.words && (
            <button
              onClick={() => setView('words')}
              className="bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Practice the words ✏️
            </button>
          )}
          <button
            onClick={() => setView('quiz')}
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Take the quiz 📝
          </button>
        </div>
      </div>
    </div>
  )
}

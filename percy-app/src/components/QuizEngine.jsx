import { useState } from 'react'
import { useApp } from '../store'

export default function QuizEngine({ questions, drachmasPerQ = 5, sectionId, onFinish }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [inputVal, setInputVal] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)
  const { addDrachmas, recordComplete } = useApp()

  const q = questions[idx]
  const isLast = idx === questions.length - 1

  const logAnswer = (given, correct) =>
    setAnswers(a => [...a, { q: q.q, given, correct, answer: q.a }])

  const checkInput = () => {
    const correct = inputVal.trim().toLowerCase() === q.a.toLowerCase()
    setSelected(correct ? '__correct__' : '__wrong__')
    setShowResult(true)
    logAnswer(inputVal.trim(), correct)
    if (correct) { setScore(s => s + 1); addDrachmas(drachmasPerQ) }
  }

  const checkMC = (opt) => {
    const correct = opt === q.a
    setSelected(opt)
    setShowResult(true)
    logAnswer(opt, correct)
    if (correct) { setScore(s => s + 1); addDrachmas(drachmasPerQ) }
  }

  const next = () => {
    if (isLast) {
      const lastCorrect = showResult && (selected === '__correct__' || selected === q.a)
      recordComplete(sectionId, score + (lastCorrect ? 1 : 0), questions.length, answers)
      setDone(true)
    } else {
      setIdx(i => i + 1)
      setSelected(null)
      setInputVal('')
      setShowResult(false)
    }
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '⚔️' : '📜'}</div>
        <div className="font-cinzel text-2xl text-yellow-400 mb-2">Quest Complete!</div>
        <div className="text-gray-300 mb-6">
          You got <span className="text-white font-bold">{score}/{questions.length}</span> correct ({pct}%)
        </div>
        <div className="drachma-coin text-base mx-auto mb-8">🪙 +{score * drachmasPerQ} drachmas earned</div>
        <button onClick={onFinish}
          className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
          Back to Subject
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="progress-bar flex-1">
          <div className="progress-fill" style={{ width: `${(idx / questions.length) * 100}%` }} />
        </div>
        <span className="text-sm text-gray-400">{idx + 1}/{questions.length}</span>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 mb-5">
        <p className="text-lg leading-relaxed">{q.q}</p>
        {q.hint && !showResult && <p className="text-sm text-yellow-400/60 mt-2 italic">💡 Hint: {q.hint}</p>}
      </div>

      {q.type === 'input' ? (
        <div className="mb-5">
          <input
            className="text-input text-2xl font-bold text-center mb-3"
            placeholder="Your answer…"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !showResult) checkInput() }}
            disabled={showResult}
            autoFocus
          />
          {!showResult && (
            <button onClick={checkInput} disabled={!inputVal.trim()}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors">
              Check Answer
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-5">
          {q.options.map(opt => (
            <button key={opt}
              className={`quiz-option ${showResult && opt === q.a ? 'correct' : showResult && opt === selected && opt !== q.a ? 'wrong' : ''}`}
              onClick={() => !showResult && checkMC(opt)}
              disabled={showResult}>
              {opt}
            </button>
          ))}
        </div>
      )}

      {showResult && (
        <div className={`rounded-xl p-4 mb-5 ${selected === '__correct__' || selected === q.a ? 'bg-green-900/40 border border-green-500/40' : 'bg-red-900/40 border border-red-500/40'}`}>
          <div className="font-semibold mb-1">
            {selected === '__correct__' || selected === q.a
              ? '✅ Correct! +' + drachmasPerQ + ' drachmas 🪙'
              : `❌ Not quite! The answer is: ${q.a}`}
          </div>
          {q.explain && <p className="text-sm text-gray-300">{q.explain}</p>}
          {q.fact && <p className="text-sm text-blue-300 mt-1">📚 {q.fact}</p>}
        </div>
      )}

      {showResult && (
        <button onClick={next}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition-colors">
          {isLast ? 'See Results 🏆' : 'Next Question →'}
        </button>
      )}
    </div>
  )
}

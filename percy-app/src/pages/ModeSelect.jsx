import { useState } from 'react'
import { useApp } from '../store'

export default function ModeSelect() {
  const { setMode, setStudentName } = useApp()
  const [nameInput, setNameInput] = useState('')
  const [step, setStep] = useState('pick') // 'pick' | 'name'

  if (step === 'name') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-5xl mb-4 float-anim">⚡</div>
        <h2 className="font-cinzel text-2xl text-yellow-400 mb-2">What is your name, demigod?</h2>
        <p className="text-gray-400 mb-8 text-center">Enter your name to begin your quest</p>
        <input
          className="text-input text-xl text-center mb-4 max-w-xs"
          placeholder="Your name…"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && nameInput.trim()) { setStudentName(nameInput.trim()); setMode('student') } }}
          autoFocus
        />
        <button
          onClick={() => { setStudentName(nameInput.trim()); setMode('student') }}
          disabled={!nameInput.trim()}
          className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-bold px-10 py-3 rounded-xl transition-colors font-cinzel"
        >
          Begin Quest →
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4 float-anim">⚡🌊</div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
          Camp Half-Blood
        </h1>
        <p className="font-cinzel text-lg text-teal-400">Academy</p>
        <p className="text-gray-400 mt-3 max-w-xs mx-auto">An interactive learning adventure for young demigods</p>
      </div>

      {/* Mode cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg w-full">
        <button
          onClick={() => setStep('name')}
          className="card-hover rounded-2xl p-8 text-left cursor-pointer border border-teal-600/40"
          style={{ background: 'linear-gradient(135deg, #0D2137, #0A3D5C)' }}
        >
          <div className="text-4xl mb-3">⚡</div>
          <div className="font-cinzel text-xl text-teal-300 mb-2">I'm a Demigod</div>
          <div className="text-gray-400 text-sm">Start learning — quests, spelling, maths, geography and more</div>
          <div className="mt-4 text-teal-400 text-sm font-semibold">Enter Student Mode →</div>
        </button>

        <button
          onClick={() => setMode('teacher')}
          className="card-hover rounded-2xl p-8 text-left cursor-pointer border border-yellow-600/40"
          style={{ background: 'linear-gradient(135deg, #1a1000, #2d1e00)' }}
        >
          <div className="text-4xl mb-3">🏛️</div>
          <div className="font-cinzel text-xl text-yellow-400 mb-2">I'm Chiron</div>
          <div className="text-gray-400 text-sm">Teacher dashboard — see progress, manage activities, plan sessions</div>
          <div className="mt-4 text-yellow-400 text-sm font-semibold">Enter Teacher Mode →</div>
        </button>
      </div>

      <p className="text-gray-600 text-xs mt-10">Progress is saved automatically on this device</p>
    </div>
  )
}

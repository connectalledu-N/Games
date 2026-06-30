import { useApp } from '../store'

export default function Header({ onBack, title }) {
  const { drachmas, mode, studentName } = useApp()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
      style={{ background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors text-lg">←</button>
        )}
        <span className="font-cinzel font-bold text-sm text-yellow-400">
          {title || 'Camp Half-Blood Academy'}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {studentName && mode === 'student' && (
          <span className="text-sm text-gray-400 hidden sm:block">{studentName}</span>
        )}
        <div className="drachma-coin">🪙 {drachmas}</div>
      </div>
    </header>
  )
}

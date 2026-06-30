import { useState, useEffect, createContext, useContext } from 'react'

const AppContext = createContext(null)

const DEFAULT_STATE = {
  mode: null, // 'student' | 'teacher'
  drachmas: 0,
  completed: {}, // { 'math-tables': { score: 7, total: 8, date: '...' } }
  studentName: '',
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('pj-academy')
      return saved ? JSON.parse(saved) : DEFAULT_STATE
    } catch { return DEFAULT_STATE }
  })

  useEffect(() => {
    localStorage.setItem('pj-academy', JSON.stringify(state))
  }, [state])

  const setMode = (mode) => setState(s => ({ ...s, mode }))
  const setStudentName = (name) => setState(s => ({ ...s, studentName: name }))

  const addDrachmas = (n) => setState(s => ({ ...s, drachmas: s.drachmas + n }))

  const recordComplete = (id, score, total) => {
    setState(s => ({
      ...s,
      completed: {
        ...s.completed,
        [id]: { score, total, date: new Date().toLocaleDateString('en-GB') }
      }
    }))
  }

  const resetProgress = () => setState({ ...DEFAULT_STATE })

  return (
    <AppContext.Provider value={{ ...state, setMode, setStudentName, addDrachmas, recordComplete, resetProgress }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

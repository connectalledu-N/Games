import { useState, useEffect, createContext, useContext } from 'react'

const AppContext = createContext(null)

const DEFAULT_STATE = {
  mode: null,           // 'student' | 'teacher'
  drachmas: 0,
  completed: {},        // { 'math-tables': { score, total, date } }
  studentName: '',
  startDate: null,      // ISO date string 'YYYY-MM-DD' set by teacher
  penaltyApplied: {},   // { 'day-1': true } — one-shot penalty per missed day
}

function toDateStr(date) {
  return date.toISOString().slice(0, 10)
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('pj-academy')
      return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE
    } catch { return DEFAULT_STATE }
  })

  useEffect(() => {
    localStorage.setItem('pj-academy', JSON.stringify(state))
  }, [state])

  const setMode = (mode) => setState(s => ({ ...s, mode }))
  const setStudentName = (name) => setState(s => ({ ...s, studentName: name }))
  const addDrachmas = (n) => setState(s => ({ ...s, drachmas: Math.max(0, s.drachmas + n) }))

  const recordComplete = (id, score, total) => {
    setState(s => ({
      ...s,
      completed: {
        ...s.completed,
        [id]: { score, total, date: new Date().toLocaleDateString('en-GB') },
      },
    }))
  }

  const setStartDate = (isoDate) => setState(s => ({ ...s, startDate: isoDate }))

  const applyDayPenalty = (dayKey) => {
    setState(s => ({
      ...s,
      drachmas: Math.max(0, s.drachmas - 30),
      penaltyApplied: { ...s.penaltyApplied, [dayKey]: true },
    }))
  }

  const resetProgress = () => setState({ ...DEFAULT_STATE })

  // Helpers exposed to consumers
  const getCurrentDay = () => {
    if (!state.startDate) return null
    const start = new Date(state.startDate)
    const today = new Date(toDateStr(new Date()))
    const diff = Math.floor((today - start) / 86400000) + 1
    return diff
  }

  return (
    <AppContext.Provider value={{
      ...state,
      setMode,
      setStudentName,
      addDrachmas,
      recordComplete,
      setStartDate,
      applyDayPenalty,
      resetProgress,
      getCurrentDay,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

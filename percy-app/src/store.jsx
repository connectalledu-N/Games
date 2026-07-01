import { useState, useEffect, createContext, useContext } from 'react'

const AppContext = createContext(null)

const DEFAULT_STATE = {
  mode: null,
  drachmas: 0,
  completed: {},        // { 'math-tables': { score, total, date, answers: [{q,given,correct,answer}] } }
  studentName: '',
  startDate: null,
  penaltyApplied: {},
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

  const recordComplete = (id, score, total, answers = []) => {
    setState(s => ({
      ...s,
      completed: {
        ...s.completed,
        [id]: { score, total, date: new Date().toLocaleDateString('en-GB'), answers },
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

  const exportCode = () => {
    const data = {
      drachmas: state.drachmas,
      completed: state.completed,
      studentName: state.studentName,
      startDate: state.startDate,
      penaltyApplied: state.penaltyApplied,
    }
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))))
  }

  const importCode = (code) => {
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(code.trim()))))
      setState(s => ({
        ...s,
        drachmas: data.drachmas ?? s.drachmas,
        completed: data.completed ?? s.completed,
        studentName: data.studentName ?? s.studentName,
        startDate: data.startDate ?? s.startDate,
        penaltyApplied: data.penaltyApplied ?? s.penaltyApplied,
      }))
      return true
    } catch { return false }
  }

  const resetProgress = () => setState({ ...DEFAULT_STATE })

  const getCurrentDay = () => {
    if (!state.startDate) return null
    const start = new Date(state.startDate)
    const today = new Date(toDateStr(new Date()))
    return Math.floor((today - start) / 86400000) + 1
  }

  return (
    <AppContext.Provider value={{
      ...state,
      setMode, setStudentName, addDrachmas, recordComplete,
      setStartDate, applyDayPenalty, exportCode, importCode,
      resetProgress, getCurrentDay,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

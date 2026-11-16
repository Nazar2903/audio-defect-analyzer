import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { MAX_HISTORY_ITEMS, STORAGE_KEYS } from '../constants/app'
import { forgetAllAudio, forgetAudio } from '../services/audioStore'
import { loadFromStorage, saveToStorage } from '../services/storage'
import type { Analysis } from '../types'
import { isAnalysisList } from '../utils/guards'
import { HistoryContext, type HistoryContextValue } from './historyContext'

type HistoryAction =
  | { type: 'add'; analysis: Analysis }
  | { type: 'remove'; id: string }
  | { type: 'clear' }

function historyReducer(state: Analysis[], action: HistoryAction): Analysis[] {
  switch (action.type) {
    case 'add':
      return [action.analysis, ...state].slice(0, MAX_HISTORY_ITEMS)
    case 'remove':
      return state.filter((item) => item.id !== action.id)
    case 'clear':
      return []
  }
}

function loadHistory(): Analysis[] {
  return loadFromStorage(STORAGE_KEYS.history, [], isAnalysisList)
}

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(historyReducer, undefined, loadHistory)

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.history, items)
  }, [items])

  const value = useMemo<HistoryContextValue>(
    () => ({
      items,
      addAnalysis: (analysis) => dispatch({ type: 'add', analysis }),
      removeAnalysis: (id) => {
        forgetAudio(id)
        dispatch({ type: 'remove', id })
      },
      clearHistory: () => {
        forgetAllAudio()
        dispatch({ type: 'clear' })
      },
    }),
    [items],
  )

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

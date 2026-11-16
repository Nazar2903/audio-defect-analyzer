import { createContext, useContext } from 'react'
import type { Analysis } from '../types'

export interface HistoryContextValue {
  items: Analysis[]
  addAnalysis: (analysis: Analysis) => void
  removeAnalysis: (id: string) => void
  clearHistory: () => void
}

export const HistoryContext = createContext<HistoryContextValue | null>(null)

export function useHistory() {
  const context = useContext(HistoryContext)
  if (!context) {
    throw new Error('useHistory must be used inside HistoryProvider')
  }
  return context
}

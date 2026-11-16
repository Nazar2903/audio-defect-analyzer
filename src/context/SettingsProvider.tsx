import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/app'
import { loadFromStorage, saveToStorage } from '../services/storage'
import type { Settings } from '../types'
import { isSettings } from '../utils/guards'
import { SettingsContext } from './settingsContext'

function loadSettings(): Settings {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const defaults: Settings = { theme: prefersDark ? 'dark' : 'light', minSeverity: 'low' }
  return loadFromStorage(STORAGE_KEYS.settings, defaults, isSettings)
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme
    saveToStorage(STORAGE_KEYS.settings, settings)
  }, [settings])

  const updateSettings = useCallback((changes: Partial<Settings>) => {
    setSettings((current) => ({ ...current, ...changes }))
  }, [])

  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

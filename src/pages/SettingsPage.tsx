import { useState } from 'react'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { SEVERITIES, SEVERITY_KEYS } from '../constants/defects'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useHistory } from '../context/historyContext'
import { useSettings } from '../context/settingsContext'
import { useToast } from '../context/toastContext'
import type { Severity, Theme } from '../types'
import './SettingsPage.css'

const THEMES: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Світла' },
  { value: 'dark', label: 'Темна' },
]

export default function SettingsPage() {
  useDocumentTitle('Налаштування')
  const { settings, updateSettings } = useSettings()
  const { items, clearHistory } = useHistory()
  const { showToast } = useToast()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleClear = () => {
    clearHistory()
    setIsConfirmOpen(false)
    showToast('info', 'Історію аналізів очищено')
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Налаштування</h1>
          <p>Зміни застосовуються одразу й зберігаються в цьому браузері.</p>
        </div>
      </div>

      <section className="card settings-section" aria-labelledby="appearance-title">
        <h2 id="appearance-title">Вигляд</h2>
        <fieldset className="settings-fieldset">
          <legend className="field-label">Тема оформлення</legend>
          <div className="settings-options">
            {THEMES.map((theme) => (
              <label key={theme.value} className="settings-option">
                <input
                  type="radio"
                  name="theme"
                  value={theme.value}
                  checked={settings.theme === theme.value}
                  onChange={() => updateSettings({ theme: theme.value })}
                />
                {theme.label}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="card settings-section" aria-labelledby="analysis-title">
        <h2 id="analysis-title">Відображення результатів</h2>
        <div className="field settings-field">
          <label className="field-label" htmlFor="min-severity">
            Мінімальна серйозність дефектів
          </label>
          <select
            id="min-severity"
            className="select"
            value={settings.minSeverity}
            onChange={(event) => updateSettings({ minSeverity: event.target.value as Severity })}
          >
            {SEVERITY_KEYS.map((severity) => (
              <option key={severity} value={severity}>
                {severity === 'low' ? 'Показувати всі' : `${SEVERITIES[severity].label} і вище`}
              </option>
            ))}
          </select>
          <p className="muted settings-help">Дефекти нижчої серйозності буде приховано в таблиці результатів.</p>
        </div>
      </section>

      <section className="card settings-section" aria-labelledby="data-title">
        <h2 id="data-title">Дані</h2>
        <p className="muted">
          Усі результати зберігаються лише у вашому браузері (localStorage). Аудіофайли не надсилаються на сервер.
          Збережено аналізів: {items.length}.
        </p>
        <button type="button" className="btn btn-danger" disabled={items.length === 0} onClick={() => setIsConfirmOpen(true)}>
          Очистити історію
        </button>
      </section>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Очистити всю історію?"
        message="Усі збережені результати аналізів буде видалено без можливості відновлення."
        confirmLabel="Очистити"
        onConfirm={handleClear}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  )
}

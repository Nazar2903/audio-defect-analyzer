import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { HistoryProvider } from './context/HistoryProvider'
import { SettingsProvider } from './context/SettingsProvider'
import { ToastProvider } from './context/ToastProvider'

const AnalyzePage = lazy(() => import('./pages/AnalyzePage'))
const ResultPage = lazy(() => import('./pages/ResultPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ToastProvider>
          <HistoryProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route index element={<AnalyzePage />} />
                  <Route path="result/:id" element={<ResultPage />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </HistoryProvider>
        </ToastProvider>
      </SettingsProvider>
    </ErrorBoundary>
  )
}

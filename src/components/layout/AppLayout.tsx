import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { APP_NAME } from '../../constants/app'
import Header from './Header'
import './AppLayout.css'

function PageLoader() {
  return (
    <div className="page-loader" role="status">
      <span className="page-loader-spinner" aria-hidden="true" />
      <span>Завантаження…</span>
    </div>
  )
}

export default function AppLayout() {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">
        Перейти до вмісту
      </a>
      <Header />
      <main id="main-content" className="app-main container">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="footer">
        <div className="container">
          <p className="muted">
            {APP_NAME} · Аналіз виконується локально у вашому браузері, файли нікуди не надсилаються.
          </p>
        </div>
      </footer>
    </div>
  )
}

import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { APP_NAME } from '../../constants/app'
import './Header.css'

const NAV_ITEMS = [
  { to: '/', label: 'Новий аналіз' },
  { to: '/history', label: 'Історія' },
  { to: '/settings', label: 'Налаштування' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-brand" onClick={closeMenu}>
          <svg className="logo" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="currentColor" />
            <path
              d="M6 16h2M10 11v10M14 7v18M18 12v8M22 9v14"
              stroke="var(--color-surface)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          <span>{APP_NAME}</span>
        </Link>
        <button
          type="button"
          className="header-burger"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="main-navigation" className={`header-nav${isMenuOpen ? ' is-open' : ''}`} aria-label="Головне меню">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end className="header-link" onClick={closeMenu}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

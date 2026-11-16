import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container error-fallback">
          <h1>Щось пішло не так</h1>
          <p className="muted">У застосунку сталася непередбачена помилка. Спробуйте перезавантажити сторінку.</p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Перезавантажити
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

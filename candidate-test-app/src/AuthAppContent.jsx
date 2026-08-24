import { useAuth } from './features/auth/useAuth'
import { Dashboard } from './features/Dashboard'
import LoginPage from './features/auth/LoginPage'
import './App.css'

export function AuthAppContent() {
  const { session, handleLogin } = useAuth()

  return (
    <section id="center">
      {session ? <Dashboard /> : <LoginPage onLoginSuccess={handleLogin} />}
    </section>
  )
}
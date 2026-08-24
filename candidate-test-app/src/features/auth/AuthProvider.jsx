import { useEffect, useState } from 'react'
import { logout } from '../../api/auth'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('session'))
    } catch {
      return null
    }
  })

  function handleLogin(newSession) {
    localStorage.setItem('session', JSON.stringify(newSession))
    setSession(newSession)
  }

  function handleUnauthorized() {
    localStorage.removeItem('session')
    setSession(null)
  }

  useEffect(() => {
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  async function handleLogout() {
    if (session?.token) {
      try {
        await logout(session.token)
      } finally {
        handleUnauthorized()
      }
    } else {
      handleUnauthorized()
    }
  }

  return (
    <AuthContext.Provider
      value={{ session, handleLogin, handleUnauthorized, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

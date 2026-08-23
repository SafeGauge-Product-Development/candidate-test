import { useState } from 'react'
import { Api } from '../../api/mock-api'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('session')
    return saved ? JSON.parse(saved) : null
  })

  function handleLogin(newSession) {
    localStorage.setItem('session', JSON.stringify(newSession))
    setSession(newSession)
  }

  function handleUnauthorized() {
    localStorage.removeItem('session')
    setSession(null)
  }

  async function handleLogout() {
    if (session?.token) {
      try {
        await Api.logout(session.token)
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

import { useCallback, useState } from 'react'
import { logout, me } from '../../api/auth'
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

  const handleUserSession = useCallback(async (token) => {
    try {
        const user = await me(token)
        setSession(current => current ? { ...current, user } : current)
      } catch (error) {
        console.log('Error fetching user session:', error)
        if (error.status === 401) handleUnauthorized()
      }
  }, [])

  function handleUnauthorized() {
    localStorage.removeItem('session')
    setSession(null)
  }

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
      value={{ session, handleLogin, handleUnauthorized, handleLogout, handleUserSession }}
    >
      {children}
    </AuthContext.Provider>
  )
}

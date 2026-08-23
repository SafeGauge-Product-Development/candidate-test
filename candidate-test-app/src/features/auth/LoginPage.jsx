import { useState } from 'react'
import { login } from '../../api/auth'

function LoginPage({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

async function handleSubmit(e) {
  e.preventDefault()
  setIsSubmitting(true)
  setError(null)
  try {
    const { username, password } = form
    const session = await login(username, password)
    onLoginSuccess(session)
  } catch (error) {
    console.error('Login failed:', error)
    setError(error)
  } finally {
    setIsSubmitting(false)
  }
}

    function handleCancel() {
  setForm({username: '', password: ''})
  setError(null)
}

  return (
    <>
      <h1>Login Page</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
        </label>
        <p />
        <label>
          Password:
          <input type="password" name="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </label>
        <p />
        {error && <p style={{color: 'red'}}>{`Login failed: ${error.message}`}</p>}
        <button type="submit" disabled={isSubmitting}>Login</button> <button type="button" onClick={handleCancel} disabled={isSubmitting}>Cancel</button>
      </form>
    </>
  )
}

export default LoginPage;
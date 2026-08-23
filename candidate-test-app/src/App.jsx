import { AuthProvider } from './features/auth/AuthProvider'
import { AuthAppContent } from './AuthAppContent'

function App() {
  return (
    <div className="center">
    <AuthProvider>
      <AuthAppContent />
    </AuthProvider>
    </div>
  )
}

export default App

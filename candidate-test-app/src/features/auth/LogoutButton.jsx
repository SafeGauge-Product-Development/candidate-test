import { useAuth } from './useAuth'

export function LogoutButton() {
    const { handleLogout } = useAuth()

    return (
        <button onClick={handleLogout}>Logout</button>
    )
}
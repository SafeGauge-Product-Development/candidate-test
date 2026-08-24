import { LogoutButton } from './auth/LogoutButton';
import { useEffect } from 'react'
import { useAuth } from './auth/useAuth'

function UserNav ({ session }) {
    return <nav>
        {session.user.role}
        {session.user.username}
    </nav>
}

export function Dashboard() {
const { session, handleUserSession } = useAuth()

    useEffect(() => {
        if (session?.token) {
            handleUserSession(session.token)
        }
    }, [session?.token, handleUserSession])

    return (
        <>
        <UserNav session={session} />
        <LogoutButton />
        </>
    )
}
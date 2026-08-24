import { LogoutButton } from './auth/LogoutButton';
import { useEffect } from 'react'
import { useAuth } from './auth/useAuth'
import { DevicesDashboard } from './devices/DevicesDashboard'
import './Dashboard.css'

function UserNav ({ session }) {
    return (
        <nav>
            Welcome, {session.user.username}!
            <LogoutButton />
        </nav>
    );
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
        <DevicesDashboard session={session} />

        </>
    )
}
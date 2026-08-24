import { LogoutButton } from './auth/LogoutButton';
import { useAuth } from './auth/useAuth'
import { DevicesDashboard } from './devices/DevicesDashboard'
import './Dashboard.css'

function UserNav({ session }) {
    return (
        <nav>
            Welcome, {session.user.username}!
            <LogoutButton />
        </nav>
    );
}

export function Dashboard() {
    const { session } = useAuth()

    return (
        <>
            <UserNav session={session} />
            <DevicesDashboard session={session} />

        </>
    )
}
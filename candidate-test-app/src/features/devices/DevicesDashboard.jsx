import DevicesForm from './DevicesForm'
import { DevicesList } from './DevicesList'
import { useState } from 'react'
import { AddUpdateDeviceButton } from './AddUpdateDeviceButton'

export function DevicesDashboard({ session }) {  
    const [showForm, setShowForm] = useState(false)
    const [refreshSignal, setRefreshSignal] = useState(0)

    return (
        <>
            <DevicesList token={session?.token} refreshSignal={refreshSignal} />
            <AddUpdateDeviceButton mode="add" onAdd={() => setShowForm(true)} />
            {showForm && (
                <DevicesForm
                    onCancel={() => setShowForm(false)}
                    onSuccess={() => setRefreshSignal(current => current + 1)}
                />
            )}
        </>
    )
}
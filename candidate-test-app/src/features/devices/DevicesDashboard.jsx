import DevicesForm from './DevicesForm'
import { DevicesList } from './DevicesList'
import { useState } from 'react'
import { IndividualDevice } from './IndividualDevice'
import { SensorhubDashboard } from './sensorhub/SensorhubDashboard'

export function DevicesDashboard({ session }) {  
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [deviceToEdit, setDeviceToEdit] = useState(null)
    const [refreshSignal, setRefreshSignal] = useState(0)
    const [selectedDeviceId, setSelectedDeviceId] = useState(null)

    return (
        <div className="devices-dashboard">
            <DevicesList
                token={session?.token}
                refreshSignal={refreshSignal}
                onSelectDevice={setSelectedDeviceId}
                onAddDevice={() => {
                    setDeviceToEdit(null)
                    setShowCreateForm(true)
                }}
            />
            {selectedDeviceId && (
                <IndividualDevice
                    token={session?.token}
                    id={selectedDeviceId}
                    onEdit={(device) => {
                        setShowCreateForm(false)
                        setDeviceToEdit(device)
                    }}
                    onUpdated={() => setRefreshSignal(current => current + 1)}
                    onRemoved={() => {
                        setSelectedDeviceId(null)
                        setDeviceToEdit(null)
                        setRefreshSignal(current => current + 1)
                    }}
                />
            )}
            {showCreateForm && (
                <DevicesForm
                    onCancel={() => setShowCreateForm(false)}
                    onSuccess={() => setRefreshSignal(current => current + 1)}
                />
            )}
            {deviceToEdit && (
                <DevicesForm
                    mode="update"
                    device={deviceToEdit}
                    onCancel={() => setDeviceToEdit(null)}
                    onSuccess={() => {
                        setRefreshSignal(current => current + 1)
                        setDeviceToEdit(null)
                    }}
                />
            )}
            {selectedDeviceId && (
                <SensorhubDashboard
                    key={selectedDeviceId}
                    token={session?.token}
                    selectedDeviceId={selectedDeviceId}
                />
            )}
        </div>
    )
}
import { getDevice } from '../../api/devices'
import { useAuth } from '../auth/useAuth'
import { removeDevice } from '../../api/devices'
import { useCallback, useEffect, useState } from 'react'
import DevicesForm from './DevicesForm'
import { AddUpdateDeviceButton } from './AddUpdateDeviceButton'
import { UserPermissions } from '../auth/UserPermissions'

export function IndividualDevice({ token, id, onUpdated, onRemoved }) {
    const { session, handleUnauthorized } = useAuth();
    const { isAdmin } = UserPermissions({ session });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [device, setDevice] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false)

    const loadDevice = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const device = await getDevice(token, id);
            setDevice(device);
        } catch (error) {
            console.error('Failed to load device', error);
            if (error.status === 401) {
                handleUnauthorized()
            } else {
                setError(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }, [handleUnauthorized, id, token])

    useEffect(() => {
        if (token) Promise.resolve().then(loadDevice)
    }, [loadDevice, token])

    return <>
    {isLoading && <p>Loading device...</p>}
    {error && <p style={{color: 'red'}}>Failed to load device: {error}</p>}
    {!isLoading && !error && device && (
        <div>
            <p>Device ID: {device.id}</p>
            <p>Device Name: {device.name}</p>
            <p>Sensor Count: {device.sensorCount}</p>
            <p>Site: {device.site}</p>
            <AddUpdateDeviceButton
                mode="update"
                deviceId={device.id}
                onUpdate={() => setShowUpdateForm(true)}
            />
            <span title={!isAdmin ? 'User role allows read only' : undefined}>
                <button disabled={!isAdmin} onClick={async () => {
                    await removeDevice(token, device.id)
                    onRemoved?.()
                    await onUpdated?.()
                }}>Remove Device</button>
            </span>
            {showUpdateForm && (
                <DevicesForm
                    mode="update"
                    device={device}
                    onCancel={() => setShowUpdateForm(false)}
                    onSuccess={async () => {
                        await loadDevice()
                        await onUpdated?.()
                    }}
                />
            )}
        </div>
    )}
    <button onClick={loadDevice} disabled={isLoading}>Reload Device</button>
    </>
}
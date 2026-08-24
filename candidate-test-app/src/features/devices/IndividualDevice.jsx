import { getDevice } from '../../api/devices'
import { useAuth } from '../auth/useAuth'
import { removeDevice } from '../../api/devices'
import { useCallback, useEffect, useState } from 'react'
import { AddUpdateDeviceButton } from './AddUpdateDeviceButton'
import { UserPermissions } from '../auth/UserPermissions'

export function IndividualDevice({ token, id, onUpdated, onRemoved, onEdit }) {
    const { session } = useAuth();
    const { isAdmin } = UserPermissions({ session });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [device, setDevice] = useState(null);

    const loadDevice = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const device = await getDevice(token, id);
            setDevice(device);
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }, [id, token])

    useEffect(() => {
        if (token) Promise.resolve().then(loadDevice)
    }, [loadDevice, token])

    return (
        <div className="individual-device">
            <h4>Selected Device</h4>
            {isLoading && <p>Loading device...</p>}
            {error && <p style={{ color: 'red' }}>Failed to load device: {error}</p>}
            {!isLoading && !error && device && (
                <div>
                    <p>Device ID: {device.id}</p>
                    <p>Device Name: {device.name}</p>
                    <p>Sensor Count: {device.sensorCount}</p>
                    <p>Site: {device.site}</p>
                    <AddUpdateDeviceButton
                        mode="update"
                        deviceId={device.id}
                        onUpdate={() => onEdit?.(device)}
                    />
                    <span title={!isAdmin ? 'User role allows read only' : undefined}>
                        <button disabled={!isAdmin} onClick={async () => {
                            setError(null)
                            try {
                                await removeDevice(token, device.id)
                                onRemoved?.()
                                await onUpdated?.()
                            } catch (error) {
                                setError(error.message)
                            }
                        }}>Remove Device</button>
                    </span>
                </div>
            )}
            <button onClick={loadDevice} disabled={isLoading}>Reload Device</button>
        </div>
    )
}
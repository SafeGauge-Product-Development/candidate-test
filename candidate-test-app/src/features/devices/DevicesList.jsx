import { getAllDevices } from '../../api/devices'
import { useAuth } from '../auth/useAuth'
import { useCallback, useEffect, useState } from 'react'
import { AddUpdateDeviceButton } from './AddUpdateDeviceButton'

export function DevicesList({ refreshSignal = 0, onSelectDevice, onAddDevice }) {
    const { session } = useAuth();
    const token = session?.token;
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadDevices = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const devices = await getAllDevices(token);
            setDevices(devices);
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }, [token])

    useEffect(() => {
        if (token) Promise.resolve().then(loadDevices)
    }, [loadDevices, refreshSignal, token])

    return (
        <div className="devices-list">
            <h4>Devices List</h4>
            {isLoading && <p>Loading devices...</p>}
            {error && <p style={{ color: 'red' }}>Failed to load devices: {error}</p>}
            {!isLoading && !error && devices.length === 0 && <p>No devices yet.</p>}
            {!isLoading && !error && devices.map(device => (
                <div key={device.id}>
                    <li onClick={() => onSelectDevice?.(device.id)}>{device.name}, {device.sensorCount}, {device.site}
                    </li>
                </div>
            ))}
            <button onClick={loadDevices} disabled={isLoading}>Reload Devices</button>
            <AddUpdateDeviceButton mode="add" onAdd={onAddDevice} />
        </div>
    )
}
import { getAllDevices } from '../../api/devices'
import { useAuth } from '../auth/useAuth'
import { useCallback, useEffect, useState } from 'react'
import { IndividualDevice } from './IndividualDevice';

export function DevicesList({ refreshSignal = 0 }) {
    const { session, handleUnauthorized } = useAuth();
    const token = session?.token;
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);

    const loadDevices = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const devices = await getAllDevices(token);
            setDevices(devices);
        } catch (error) {
            console.error('Failed to load devices', error);
            if (error.status === 401) {
                handleUnauthorized()
            } else {
                setError(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }, [handleUnauthorized, token])

    useEffect(() => {
        if (token) Promise.resolve().then(loadDevices)
    }, [loadDevices, refreshSignal, token])

    return <>
    {isLoading && <p>Loading devices...</p>}
    {error && <p style={{color: 'red'}}>Failed to load devices: {error}</p>}
    {!isLoading && !error && devices.map(device => (
        <div key={device.id}>
            <li onClick={() => setSelectedDevice(device)}>{device.name}, {device.sensorCount}, {device.site}
            </li>
        </div>
    ))} 
    <button onClick={loadDevices} disabled={isLoading}>Reload Devices</button>
    {selectedDevice && (
        <IndividualDevice
            token={token}
            id={selectedDevice.id}
            onUpdated={loadDevices}
            onRemoved={() => setSelectedDevice(null)}
        />
    )}
    </>
}
import { useEffect, useMemo, useState } from 'react'
import { getDevice } from '../../../api/devices'
import { connectHub } from '../../../api/hub'

export function SensorhubDashboard({ token, selectedDeviceId }) {
    const [status, setStatus] = useState('disconnected')
    const [sensorCount, setSensorCount] = useState(null)
    const [readingsBySensor, setReadingsBySensor] = useState({})
    const [device, setDevice] = useState(null)
    const [deviceLoadError, setDeviceLoadError] = useState(false)

    useEffect(() => {
        if (!token || !selectedDeviceId) return

        let isCancelled = false
        getDevice(token, selectedDeviceId)
            .then(device => {
                if (!isCancelled) {
                    setDevice(device)
                    setSensorCount(Number.isFinite(device?.sensorCount) ? device.sensorCount : null)
                }
            })
            .catch(() => {
                if (!isCancelled) {
                    setSensorCount(null)
                    setDeviceLoadError(true)
                }
            })

        return () => {
            isCancelled = true
        }
    }, [selectedDeviceId, token])

    useEffect(() => {
        if (!selectedDeviceId || !Number.isFinite(sensorCount)) return

        const connection = connectHub({
            sensors: sensorCount,
            channelKey: 'demo',
            onStatus: nextStatus => setStatus(nextStatus),
            onReading: reading => {
                setReadingsBySensor(current => ({ ...current, [reading.sensorId]: reading }))
            }
        })
        if (!connection) return

        return () => {
            connection.disconnect()
        }
    }, [selectedDeviceId, sensorCount])

    const readings = useMemo(() => {
        return Object.values(readingsBySensor)
            .sort((a, b) => a.sensorId.localeCompare(b.sensorId))
    }, [readingsBySensor])

    return (
        <div className="sensorhub-dashboard">
            <h4>SensorHub Dashboard</h4>
            <h5> {device?.name}: {selectedDeviceId} </h5>
            <p>Status: {status}</p>
            {deviceLoadError && <p style={{color: 'red'}}>Unable to load device metadata for stream configuration.</p>}
            {readings.length === 0 && <p>Waiting for live readings...</p>}
            <div className="sensor-grid">
                {readings.map(reading => (
                    <div key={reading.sensorId} className="sensor-tile">
                        <p>Sensor ID: {reading.sensorId}</p>
                        <p>Type: {reading.type}</p>
                        <p>Value: {reading.value} {reading.unit}</p>
                        <p>Last updated: {new Date(reading.ts).toLocaleTimeString()}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
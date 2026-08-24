import { useAuth } from '../auth/useAuth';
import { UserPermissions } from '../auth/UserPermissions'
import './devices.css';
import { createDevice, updateDevice } from '../../api/devices';


export default function DevicesForm({ mode = 'add', device = null, onCancel, onSuccess }) {
    const { session } = useAuth();
    const { isAdmin } = UserPermissions({ session });
    const isUpdate = mode === 'update';

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget
        const name = form['device-name'].value.trim()
        const site = form['device-site'].value.trim()
        const sensorCount = Number(form['device-sensor-count'].value)
        const firmwareVersion = form['device-firmware-version'].value.trim()

        if (!name || !site || Number.isNaN(sensorCount) || sensorCount < 1 || sensorCount > 12) {
            form.reportValidity()
            return
        }

        if (isUpdate) {
            try {
                await updateDevice(session?.token, device.id, {
                    name,
                    sensorCount,
                    site,
                    firmwareVersion,
                });
                await onSuccess?.()
                onCancel?.()
            } catch (error) {
                console.error('Failed to update device', error);
            }
        } else {
            try {
                await createDevice(session?.token, {
                    name,
                    sensorCount,
                    site,
                    firmwareVersion,
                });
                await onSuccess?.()
                onCancel?.()
            } catch (error) {
                console.error('Failed to create device', error);
            }
        }
    };

    return (
        <div className="device-form-container">
            <h4>{isUpdate ? 'Update Form' : 'Create Form'}</h4>
            <form onSubmit={handleSubmit} className="device-form">
                <fieldset disabled={!isAdmin}> 
                    {isUpdate && (
                        <div className="form-row">
                            <label htmlFor="device-id">Device ID:</label>
                            <input id="device-id" type="text" defaultValue={device?.id || ''} disabled />
                        </div>
                    )}
                    <div className="form-row">
                        <label htmlFor="device-name">Device Name:</label>
                        <input id="device-name" type="text" placeholder="Device Name" defaultValue={isUpdate ? device?.name || '' : ''} required />
                    </div>
                    <div className="form-row">
                        <label htmlFor="device-sensor-count">Sensor Count:</label>
                        <input id="device-sensor-count" type="number" placeholder="Sensor Count" defaultValue={isUpdate ? device?.sensorCount || '' : ''} min="1" max="12" required />
                    </div>
                    <div className="form-row">
                        <label htmlFor="device-site">Site:</label>
                        <input id="device-site" type="text" placeholder="Site" defaultValue={isUpdate ? device?.site || '' : ''} required />
                    </div>
                    <div className="form-row">
                        <label htmlFor="device-firmware-version">Firmware Version:</label>
                        <input id="device-firmware-version" type="text" placeholder="Firmware Version" defaultValue={isUpdate ? device?.firmwareVersion || '' : ''} />
                    </div>
                    {isUpdate && (
                        <div className="form-row">
                            <label htmlFor="device-created-at">Created Time:</label>
                            <input id="device-created-at" type="text" value={device?.createdAt ? new Date(device.createdAt).toLocaleString() : ''} disabled readOnly />
                        </div>
                    )}
                    <div className="form-row">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onCancel}>Cancel</button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}
import { useAuth } from '../auth/useAuth';
import { UserPermissions } from '../auth/UserPermissions'
import './devices.css';
import { createDevice, updateDevice } from '../../api/devices';
import { useState } from 'react';


export default function DevicesForm({ mode = 'add', device = null, onCancel, onSuccess }) {
    const { session } = useAuth();
    const { isAdmin } = UserPermissions({ session });
    const isUpdate = mode === 'update';
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget
        const name = form['device-name'].value.trim()
        const site = form['device-site'].value.trim()
        const sensorCount = Number(form['device-sensor-count'].value)
        const firmwareVersion = form['device-firmware-version'].value.trim()

        const validationErrors = {};
        if (!name) validationErrors.name = 'Name is required';
        if (!site) validationErrors.site = 'Site is required';
        if (!Number.isInteger(sensorCount) || sensorCount < 1 || sensorCount > 12) {
            validationErrors.sensorCount = 'Sensor count must be a whole number from 1 to 12';
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);
        try {
            if (isUpdate) {
                await updateDevice(session?.token, device.id, {
                    name,
                    sensorCount,
                    site,
                    firmwareVersion,
                });
            } else {
                await createDevice(session?.token, {
                    name,
                    sensorCount,
                    site,
                    firmwareVersion,
                });
            }
            await onSuccess?.();
            onCancel?.();
        } catch (error) {
            setErrors(error.status === 422 ? error.body : { form: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="device-form-container">
            <h4>{isUpdate ? 'Update Form' : 'Create Form'}</h4>
            <form noValidate onSubmit={handleSubmit} className="device-form">
                <fieldset disabled={!isAdmin || isSubmitting}>
                    {isUpdate && (
                        <div className="form-row">
                            <label htmlFor="device-id">Device ID:</label>
                            <input id="device-id" type="text" defaultValue={device?.id || ''} disabled />
                        </div>
                    )}
                    <div className="form-row">
                        <label htmlFor="device-name">Device Name:</label>
                        <input id="device-name" type="text" placeholder="Device Name" defaultValue={isUpdate ? device?.name || '' : ''} />
                        {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>
                    <div className="form-row">
                        <label htmlFor="device-sensor-count">Sensor Count:</label>
                        <input id="device-sensor-count" type="number" placeholder="Sensor Count" defaultValue={isUpdate ? device?.sensorCount || '' : ''} />
                        {errors.sensorCount && <span className="field-error">{errors.sensorCount}</span>}
                    </div>
                    <div className="form-row">
                        <label htmlFor="device-site">Site:</label>
                        <input id="device-site" type="text" placeholder="Site" defaultValue={isUpdate ? device?.site || '' : ''} />
                        {errors.site && <span className="field-error">{errors.site}</span>}
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
                        <button type="submit">{isSubmitting ? 'Saving...' : 'Submit'}</button>
                        <button type="button" onClick={onCancel}>Cancel</button>
                    </div>
                    {errors.form && <p className="form-error">{errors.form}</p>}
                </fieldset>
            </form>
        </div>
    );
}
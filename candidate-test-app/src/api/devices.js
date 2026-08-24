import { Api } from './mock-api'
import { retryTransient } from './apiRequest'

export function getAllDevices(token) {
    return retryTransient(() => Api.devices.list(token))
}

export function getDevice(token, id) {
    return retryTransient(() => Api.devices.get(token, id))
}

export function createDevice(token, data) {
    return retryTransient(() => Api.devices.create(token, data))
}

export function updateDevice(token, id, data) {
    return retryTransient(() => Api.devices.update(token, id, data))
}

export function removeDevice(token, id) {
    return retryTransient(() => Api.devices.remove(token, id))
}
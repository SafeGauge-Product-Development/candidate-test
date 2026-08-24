import { Api } from './mock-api'
import { retryTransient } from './apiRequest'

export async function login(username, password) {
        const response = await retryTransient(() => Api.login(username, password))
        return response
};

export async function me(token) {
        const response = await retryTransient(() => Api.me(token))
        return response
};

export function logout(token) {
        return retryTransient(() => Api.logout(token))
}


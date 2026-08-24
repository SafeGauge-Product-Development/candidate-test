import { Api } from './mock-api'
import { retryTransient } from './apiRequest'

export function login(username, password) {
        return retryTransient(() => Api.login(username, password), { handleUnauthorized: false })
};

export function logout(token) {
        return retryTransient(() => Api.logout(token))
}


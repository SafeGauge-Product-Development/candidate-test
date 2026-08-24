import { Api } from './mock-api'
import { retryTransient } from './apiRequest'

export function login(username, password) {
        return retryTransient(() => Api.login(username, password))
};

export function me(token) {
        return  retryTransient(() => Api.me(token))
         
};

export function logout(token) {
        return retryTransient(() => Api.logout(token))
}


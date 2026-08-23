import { Api } from './mock-api'

export function login(username, password) {
    return Api.login(username, password)
};
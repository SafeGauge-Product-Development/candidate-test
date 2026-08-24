export function retryTransient(request, { attempts = 3, handleUnauthorized = true } = {}) {
    return request().catch(error => {
        if (error.status === 500 && attempts > 1) {
            return retryTransient(request, { attempts: attempts - 1, handleUnauthorized })
        }
        if (error.status === 401 && handleUnauthorized && typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth:unauthorized'))
        }
        throw error
    })
}
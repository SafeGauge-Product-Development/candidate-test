export function retryTransient(request, attempts = 3) {
    console.log('api call', request)
    return request().catch(error => {
        if (error.status === 500 && attempts > 1) {
            console.log(`${request} transient error occurred, retrying... (${attempts - 1} attempts left)`)
            return retryTransient(request, attempts - 1)
        }
        throw error
    })
}
export function connectHub({ sensors, channelKey = 'demo', onStatus, onReading }) {
	const hubApi = typeof window !== 'undefined' ? window.SensorHub : null
	if (!hubApi?.connect) {
		return null
	}

	const hub = hubApi.connect({ sensors, channelKey })
	const offStatus = hub.onStatus(status => onStatus?.(status))
	const offReading = hub.onReading(reading => onReading?.(reading))

	return {
		disconnect: () => {
			offStatus?.()
			offReading?.()
			hub.disconnect()
		}
	}
}

/**
 * @description handles refresh status
 *
 * @param data - object retrieved from the pos when status changes
 * @param cbList - callback functions for order states
 */
export default function handleRefreshStatus(data: {Header}, cbList: {posClose, posOpen, pause, active}): void {
    
    if(!data.Header){
        console.warn('handleRefreshStatus invalid Header', data)
        return undefined
    }
    
    let header = data.Header[0],
        ksStatus = parseInt(header.$.ksStatus),
        operatorId = parseInt(header.$.operatorId),
        operatorName = header.$.operatorName

        // Day hasn't been opened, no one logged in
		if (ksStatus === 4 && !operatorId) {
            (cbList.posClose) && cbList.posClose()
        }

        // Day has been opened, but POS is paused
        else if (ksStatus === 1 && operatorId > 0 && operatorName.length > 0) {
			(cbList.pause) && cbList.pause()
        }

        // Day has been opened, but no operator logged in
        else if (ksStatus === 1 && !operatorId && operatorName === '') {
			(cbList.active) && cbList.active()
        }

        // Day opened, operator logged in. Ready for business.
        else if (ksStatus === 2 && operatorId > 0 && operatorName.length > 0) {
			(cbList.posOpen) && cbList.posOpen()
		}
}

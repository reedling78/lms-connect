/**
 * @description handles the order status
 *
 * @export { function }
 * @param header - header object retrieved from the pos when an order is made
 * @param order - order object retrieved from the pos when an order is made
 * @returns status type
 */
export default function getOrderStatus(header: {OrderState, ksStatus}, order: {status}): string {
    if (header.hasOwnProperty('OrderState')){
        let orderState = header.OrderState

        switch(orderState){
            case '1':
                return 'update'

            case '2':
                return 'confirm'

            case '3':
            case '5':
                return 'complete'

            default:
                return 'unknown'
        }
    } else {
        let ksStatus = header.ksStatus,
            status = order.status

        // TODO: may need to redo, some status is invalid
        // code taken from old library
        if (ksStatus == 3 && status == 1) {
            return 'update'
        } else if (ksStatus == 2 && status == 2) {
            return 'confirm'
        } else if (ksStatus == 2 && status == 8) {
            return 'update'
        } else if (ksStatus == 3 && status == 2) {
            return 'confirm'
        } else if (ksStatus == 2 && status == 64) {
            return 'complete'
        } else if (ksStatus == 3 && status == 64) {
            return 'complete'
        } else {
            return 'unknown'
        }
    }
}

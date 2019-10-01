import getOrderStatus from './order-status'
import sanitize from './sanitize'
import getCustomInfo from './custom-info'

/**
 * @description handles order view
 *
 * @param data - data retrieved from the pos when order is placed
 * @param lane - current lane
 * @param posMarket - france or global market
 * @param cbList - callback functions for order states
 */ 
export default function handleOrderView(data: {Header, Order}, lane: string, posMarket: string, cbList: {update, confirm, complete, custom, subscribe, use}): void {

    if (cbList.use){
        data = cbList.use(data);
        if(!data){ throw 'lms.cod.use middle ware returned undefined' }
    }
    
    const orderstate = getOrderStatus(data.Header[0].$, data.Order[0].$)
    const customInfo = getCustomInfo(data)
    const order = data.Order[0].Item
    const totalPrice = data.Order[0].$
    const sanitized = posMarket == 'fr' ? sanitize.france.clean(order) : sanitize.global.clean(order, cbList.subscribe)
    
    if(customInfo) {
        cbList.custom({ customInfo })
    }

    switch(orderstate) {
        case 'update':
            cbList.update({items: sanitized, totalPrice, lane})
            break

        case 'confirm':
            cbList.confirm({items: sanitized, totalPrice, lane})
            break

        case 'complete':
            if(posMarket === 'fr') { sanitize.france.cleanOrderHistory() }
            cbList.complete()
            break
            
        default:
            console.info('lms-connect: Cannot match order status: ', orderstate)
    }
}

import socket from '../socket'
import getLane from './get-lane'
import handleOrderView from './order-view'
import handleRefreshStatus from './refresh-status'
import { getEnvLane } from './env-variables'

export default class {
    private static _confirm: () => void
    private static _complete: () => void
    private static _update: () => void
    private static _active: () => void
    private static _pause: () => void
    private static _posOpen: () => void
    private static _posClose: () => void
    private static _subscribe: () => void
    private static _dataSubscribe: () => void
    private static _custom: () => void
    private static _executed: boolean = false

    public static onConfirm(cb: () => void): void {
        this.attachListener('_confirm', cb)
    }

    public static onComplete(cb: () => void): void {
        this.attachListener('_complete', cb)
    }

    public static onUpdate(cb: () => void): void {
        this.attachListener('_update', cb)
    }

    public static onActive(cb: () => void): void {
        this.attachListener('_active', cb)
    }

    public static onPause(cb: () => void): void {
        this.attachListener('_pause', cb)
    }

    public static onPosOpen(cb: () => void): void {
        this.attachListener('_posOpen', cb)
    }

    public static onPosClosed(cb: () => void): void {
        this.attachListener('_posClose', cb)
    }
    
    public static subscribe(cb: () => void): void {
        this._subscribe = cb;
    }

    public static use(cb: () => void): void {
        this._dataSubscribe = cb;
    }

    public static onCustom(cb: () => void): void {
        this.attachListener('_custom', cb)
    }

    /**
     * @description attaches callback function to property state
     * @param property - property state eg pos open close etc
     * @param cb - callback function to attach to corresponding property
     */
    private static attachListener(property: string, cb: () => void): void {
        this[property] = cb
        if (!this._executed){
            this._executed = !this._executed
            this.addListener()
        }
    }

    /**
     * @description attaches listener event when any of the states is set
     */
    private static addListener(): void {
        socket.add('notification', this.checkType.bind(this))
    }

    /**
     * @description handles the state, whether it's an order placed or status change
     *
     * @param data - data retrieved from the pos when order is placed
     */
    private static checkType(data: any): void {

        const { classification, payload } = data.data.attributes;

        const lane = getLane(data)

        const envLane = getEnvLane()

        if(envLane === lane) {
            switch (classification) {
                case 'cod':
                    console.info('lms-connect: Handling NGCOOD message: ', data)
                    
                    //TODO: remove support for old france 
                    let market = 'us'
                    if(payload.hasOwnProperty('data') && payload.data.hasOwnProperty('eCOCsaleInfo')) {
                        market = 'fr'
                        console.info('lms-connect: Added NGCOOD support to old France project')
                    }
                    //TODO: remove support for old france
    
                    this.handleNgcod(data, payload, lane, market)
                    break;
    
                case 'hubhook':
                    console.info('lms-connect: Handling HUBHOOK message: ', data)
                    this.handleHubhook(payload, lane, 'fr')
                    break;

                case 'decision-interpreter':
                    console.info('lms-connect: decision-interpreter: ', classification, data)
                    break;

                default:
                    console.info('lms-connect: Invalid classification: ', classification, data)
                    break;
            }
        }
    }

    /**
     * Handle NGCOD protocol messages
     * @param data - data retrieved from the pos when order is placed
     * @param payload - only the payload retrieved from the pos when order is placed
     * @param lane - lane that the message was sent
     * @param posMarket - which market the message came from
     */
    private static handleNgcod(data, payload, lane, posMarket) {

        //TODO: remove payload.data.eCOCsaleInfo (support for Old France project)
        const saleInfo = payload.data.Command || payload.data.eCOCsaleInfo

        const type = payload.type

        const envLane = getEnvLane()

        if(envLane === lane) { 

            switch(type){
                case 'order_view':
                    handleOrderView(saleInfo, lane, posMarket, {
                        update: this._update,
                        confirm: this._confirm,
                        complete: this._complete,
                        custom: this._custom,
                        subscribe: this._subscribe,
                        use: this._dataSubscribe,
                    })
                    break

                case 'refresh_status':
                    handleRefreshStatus(payload.data.Command, {
                        posClose: this._posClose,
                        posOpen: this._posOpen,
                        pause: this._pause,
                        active: this._active
                    })
                    break

                default:
                    console.error('error cannot match type')
                    break
            }
            
        }

    }

    /**
     * Handle HUBHOOK protocol messages
     * @param payload - only the payload retrieved from the pos when order is placed
     * @param lane - lane that the message was sent
     * @param posMarket - which market the message came from
     */
    private static handleHubhook(payload, lane, posMarket) {
        
        const saleInfo = payload.eCOCsaleInfo;

        handleOrderView(saleInfo, lane, posMarket, {
            update: this._update,
            confirm: this._confirm,
            complete: this._complete,
            custom: this._custom,
            subscribe: this._subscribe,
            use: this._dataSubscribe,
        })

    }
}

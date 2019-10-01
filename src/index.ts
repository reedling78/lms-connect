import cod from './cod'
import listener from './listener'
import socket from './socket'

export default class {
    public static cod = cod
    public static listener = listener

    /**
     * @description this method is used to set the ip address for listening to incoming messages or/and
     * sending messages
     */
    public static setup(ip: string): void {
        socket.set(ip)
    }

    /**
     * @description used to send messages
     */
    public static send(event: string, message: any): void {
        socket.send(event, message)
    }

    public static upsell = {
        /**
         * @description listens to upsell/suggestive sell event
         *
         * @param callback - callback function will be executed when upsell event is triggered
         */
        listen: (callback: () => void): void => {
            socket.add('suggestion', callback)
            console.info('listening to suggestions')
        }
    }
}

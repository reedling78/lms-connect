import socket from './socket'

export default class {
    /**
     * adds listener
     *
     * @param msg - keyword to listen
     * @param { function } cb - callback function will execute when msg event is triggered
     */
    public static add(msg: string, cb: () => void): void {
        //msg = msg.indexOf('switchboard.') > -1 ? msg : `switchboard.${msg}`
        socket.add(msg, this.handlesDecrypts.bind(this, cb))
    }

    /**
     * removes listener
     *
     * @param msg - keyword to listen
     * @param { function } cb - callback function will execute when msg event is triggered
     */
    public static remove(msg: string, cb: () => void): void {
        socket.remove(msg, cb)
    }

    /**
     * decrypts the data
     *
     * @param msg - data
     * @returns decrypted msg
     */
    private static decrypt(msg: any){
        return typeof msg === "object" ? msg : JSON.parse(atob(msg))
    }

    /**
     * executes callback function with decrypted data
     *
     * @param data
     */
    private static handlesDecrypts(cb, data: any){
        cb(this.decrypt(data))
    }
}

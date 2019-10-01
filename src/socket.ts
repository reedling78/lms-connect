import io from 'socket.io-client'
import $ from 'jquery'
import { getEnvLane } from './cod/env-variables'

export default class {
    private static _ip: string
    private static _socket: { on, removeListener, removeAllListeners }

    /**
     * @description encrypts message/data to be transmitted over network more securely
     *
     * @param msg - message / data to boardcast
     * @returns encrypted message/data
     */
    private static encodeMessage(msg: any): {} {
        return btoa(JSON.stringify(msg))
    }

    // handles connection state
    private static connected(): void {
        console.info(`lms connected to ${this._ip} and filtering lane ${getEnvLane()}`)
    }
    private static reconnecting(): void {
        console.info(`reconnecting to ${this._ip}`)
    }
    private static connectError(err: {}): void {
        console.info('connection error', err)
    }
    private static connectFailed(): void {
        console.info('connection failed')
    }

    /**
     * @description setups the connect to socketio
     *
     * @param ip - ip address
     */
    public static set(ip: string): void {
        let envIp

        // first try to use the master ip
        try {
            envIp = window['SB'].Env.get('master-ip')
        } catch(err){}

        // otherwise use the ip from the user
        this._ip = envIp ? envIp : ip
        this._socket = io.connect(`${this._ip}:22599`, {'reconnect': true, 'reconnection delay': 60})

        // connection states
        this._socket.on('connect', this.connected.bind(this))
        this._socket.on('reconnecting', this.reconnecting.bind(this))
        this._socket.on('connect_error', this.connectError)
        this._socket.on('reconnect_failed', this.connectFailed)
    }

    /**
     * @description attach listener event
     *
     * @param message - message to add to listener event
     * @param callback - callback function executes when message event is triggered
     */
    public static add(message: string, callback: () => void): void {
        this._socket.on(message, callback)
    }

    /**
     * @description sends/broadcast message
     *
     * @param event - broadcasts to event name
     * @param message - message/data to transmit
     */
    public static send(event: string, message: string): void {
        this._ip
            ? $.get(`http://${this._ip}/createNotification/${event}/${this.encodeMessage(message)}`)
            : console.error('cannot send, please setup ip first')
    }

    /**
     * @description removes listener event
     *
     * @param message - message to remove listener event
     * @param callback [optional] - callback function to execute final time
     */
    public static remove(message: string, callback: () => void): void {
        callback && (callback instanceof Function)
            ? this._socket.removeListener(message, callback)
            : this._socket.removeAllListeners(message)
    }
}

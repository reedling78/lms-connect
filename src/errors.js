import socket from './socket'

export default class Error {
    constructor(functionName, type, value, error, solution) {
        this.functionName = functionName
        this.type = type
        this.value = value
        this.error = error
        this.solution = solution

        this.logErrors()
    }

    getErrors() {
        return this
    }

    logErrors() {
        // console.error(JSON.stringify(this, null, 4))
        socket.send('error', {
            error: this.error,
        })
    }
}

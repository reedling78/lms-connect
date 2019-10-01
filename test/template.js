import socket from '../src'
import { ip } from './config'
// import mockIo, {serverSocket, cleanUp } from 'socket.io-client'

// beforeEach(function(done) {
//     socket.setup(ip)
//     done()
// })

// afterEach(function(done) {
//     console.log('called aftereach')
//     done()
// })

describe('switchboard connect', () => {
    it('able to send and receive', done => {
        socket.listener.add('switchboard.test', () => done())
        socket.send('test', '')
    })
})

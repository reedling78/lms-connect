import { orderComplete, orderUpdate, Fake } from './mock-data/fr/order1'
import socket from '../src'

socket.setup('localhost')

describe('cod connect', () => {
    const update = new Fake(1)
    const complete = new Fake(5)
    const confirm = new Fake(2)

    it('able to trigger complete state', done => {
        socket.cod.onComplete(() => done())
        socket.send('notification', complete.getData())
    })

    it('able to trigger update state', done => {
        socket.cod.onUpdate(() => done())
        socket.send('notification', update.getData())
    })

    it('able to trigger confirm state', done => {
        socket.cod.onConfirm(() => done())
        socket.send('notification', confirm.getData())
    })
})

describe('lms connect', () => {
    it('able to send and receive', done => {
        socket.listener.add('switchboard.test1', () => done())
        socket.send('switchboard.test1', '')
    })

    it('can handle prefix label', done => {
        socket.listener.add('test2', () => done())
        socket.send('switchboard.test2', '')
    })

    it('able send and receive messages', done => {
        socket.listener.add('switchboard.test3', data => data == 'message' ? done() : '')
        socket.send('switchboard.test3', 'message')
    })
})

// describe('france', () => {
//     it('fuck france', done => {
//         socket.listener.add('switchboard.test1', () => true)
//         socket.send('switchboard.test1', '')
//     })
// })

// describe('us', () => {
//     it('fuck us', done => {
//         socket.listener.add('switchboard.test1', () => true)
//         socket.send('switchboard.test1', '')
//     })
// })

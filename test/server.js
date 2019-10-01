const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
let _socket

app.listen(80)
server.listen(22599)

app.get('/createNotification/:label/:data', (req, res) => {
    if (_socket) {
        if (req.params){
            _socket.emit(req.params.label, req.params.data)
        }

        res.send(true)
        return
    }

    res.send(false)
})

// when connection is established then set socket globally
io.on('connection', socket => _socket = socket)

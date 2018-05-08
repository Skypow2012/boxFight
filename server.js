var fs = require('fs'),
    http = require('http'),
    sio = require('socket.io');

var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(fs.readFileSync('./boxFight.html'));
});
server.listen(8888, function() {
    console.log('Server listening at http://localhost:8888/');
});
// Attach the socket.io server
io = sio.listen(server);
// store messages
var messages = [];
var sockets = {};
// Define a message handler
io.sockets.on('connection', function(socket) {
    console.log(socket.id);
    sockets[socket.id] = socket;
    socket.on('message', function(msg) {
        if (msg.indexOf('@') > -1) {
            sockets[msg.substr(msg.indexOf('@'),4)] = socket;
            if (sockets['@110']!=undefined) {
                sockets['@110'].send(msg.substr(msg.indexOf('@'),4) + '加入');    
            }
            
        } else {
            console.log('Received: ', msg);
            messages.push(msg);
            socket.broadcast.emit('message', msg);
        }
    });
    // send messages to new clients
    messages.forEach(function(msg) {
        socket.send(msg);
    })
});
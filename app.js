var config = require('./config.js');
var http = require('http');
var io = require('socket.io');

process.on('uncaughtException', function globalErrorCatch(error, p){
    console.error(error);
    console.error(error.stack);
});


server = http.createServer();

server.listen(config.port);
server.on('request', function(req, resp){
    resp.end('');
});

function userObject(userName, credentials) {
    this.userName = userName;
    this.credentials = credentials;

    this.export = function() {
        return {
            userId: this.userName,
            userData: this.credentials
        }
    }
}

var USERS = {};

var socketServer = io.listen(server);

socketServer.configure(function configureSocketIO(){
    socketServer.enable('browser client minification');  // send minified client
    socketServer.enable('browser client expiration');  // send minified client
    socketServer.enable('browser client etag');          // apply etag caching logic based on version number
    socketServer.enable('browser client gzip');          // gzip the file
    //socketServer.set('log level', 1);                    // reduce logging
});

socketServer.sockets.on('connection', function (socket) {
    console.log("Connection");
    socket.on('join', function joinUser(data){
        var newUser = null;
        var n = true;
        if (typeof USERS[data.userId] !== 'undefined') {
            newUser = USERS[data.userId];
            if (typeof newUser.timeOut !== 'undefined') {
                clearTimeout(newUser.timeOut);
                delete(newUser.timeOut);
            }
            n = false;
        } else {
            newUser = new userObject(data.userId, data.userData);
        }
        USERS[newUser.userName] = newUser;
        this.join(data.chatName);
        this.user = newUser;
        if (n) {
            this.manager.sockets.in(data.chatName).emit('sys-message', {type: 'user-join', user: this.user.export()});
        }

    });

    socket.on('leave', function kickUser(data){
        this.leave(data.chatName);
        this.manager.sockets.in(data.chatName).emit('sys-message', {type: 'user-leave', user: this.user.export()});
    });

    socket.on('message', function sendMessage(data){
        var text = data.message;

        var replaces = {
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            "\"": "&quot;"
        };
        for (var p in replaces) {
            text = text.split(p).join(replaces[p]);
        }

        var message = {
            user:  this.user.export(),
            message: text

        };
        socket.manager.sockets.in(data.chatName).emit('message', message);
    });
    socket.on('disconnect', function(sock){
        var user = this.user;
        if (typeof this.user !== 'undefined') {
            this.user.timeOut = setTimeout(function(){
                delete(USERS[user.userName]);
            }, 30000);

            delete(this.user);
        }
    });
});
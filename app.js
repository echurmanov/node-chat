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

function userObject(userId, credentials) {
    this.userId = userId;
    this.credentials = credentials;

    this.sockets = [];

    this.export = function() {
        return this.credentials;
    };


}


function Chat (name, socketManager) {
    this.socketManager = socketManager;
    this.name = name;
    this.users = {};
    this.sockets = {};


    this.kickUser = function (user, socket) {
        if (typeof this.sockets[user.userId] !== 'undefined') {
            if (this.sockets[user.userId].indexOf(socket) != -1) {
                this.sockets[user.userId].splice(this.sockets[user.userId].indexOf(socket),1);
                if (typeof this.sockets[user.userId] == 'undefined' || this.sockets[user.userId].length == 0) {
                    var chat = this;
                    var u = user;
                    (function () {

                    user.timeOut = setTimeout(function(){
                        if (typeof chat.sockets[u.userId] !== 'undefined') {
                            delete(chat.sockets[u.userId]);
                        }
                        if (typeof chat.users[u.userId] != 'undefined') {
                            delete(chat.users[u.userId]);
                            chat.socketManager.sockets.in(chat.name).emit('sys-message', {type: 'user-leave', user: u.export()});
                            chat.socketManager.sockets.in(chat.name).emit('sys-message', {type: 'user-list', users: chat.exportUsers()});
                        }
                    }, 30000);
                    })();
                }
            }
        }

    };

    this.joinUser = function(user, socket) {
        socket.join(this.name);
        socket.user = user;
        if (typeof this.users[user.userId] == 'undefined') {
            this.users[user.userId] = user;
            this.socketManager.sockets.in(this.name).emit('sys-message', {type: 'user-join', user: user.export()});
            this.socketManager.sockets.in(this.name).emit('sys-message', {type: 'user-list', users: this.exportUsers()});

        } else {
            if (typeof user.timeOut !== 'undefined') {
                clearTimeout(user.timeOut);
                delete(user.timeOut);
            }
        }
        if (typeof this.sockets[user.userId] == 'undefined') {
            this.sockets[user.userId] = [];
        }
        if (this.sockets[user.userId].indexOf(socket) == -1) {
            this.sockets[user.userId].push(socket);
        }


        var chat = this;

        socket.on('disconnect', function(sock){
            if (typeof this.user !== 'undefined') {
                var user = this.user;
                chat.kickUser(user, this);
            }
        });


        socket.on('leave', function kickUser(data){
            this.leave(data.chatName);
            if (data.chatName == chat.name) {
                chat.kickUser(this.user, this);
            }
        });
        socket.on('get-user-list', function(data){
            if (data.chatName == chat.name) {
                this.emit('sys-message', {type: 'user-list', users: chat.exportUsers()});
            }
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

            if (chat.name == data.chatName) {
                socket.manager.sockets.in(data.chatName).emit('message', message);
            }
        });

    };

    this.getUser = function (userId) {
        if (typeof this.users[userId] !== 'undefined') {
            return this.users[userId];
        }
        return null;
    };

    this.exportUsers = function () {
        var data = [];
        for (var userIndex in this.users) {
            data.push(this.users[userIndex].credentials);
        }
        return data;
    }
}

var CHATS = {};

var socketServer = io.listen(server);

socketServer.configure(function configureSocketIO(){
    socketServer.enable('browser client minification');  // send minified client
    socketServer.enable('browser client expiration');  // send minified client
    socketServer.enable('browser client etag');          // apply etag caching logic based on version number
    socketServer.enable('browser client gzip');          // gzip the file
    socketServer.set('log level', 1);                    // reduce logging
});

socketServer.sockets.on('connection', function (socket) {
    console.log("Connection");
    socket.on('join', function joinUser(data){


        if (typeof CHATS[data.chatName] == 'undefined') {
            CHATS[data.chatName] = new Chat(data.chatName, this.manager);
        }

        var user = CHATS[data.chatName].getUser(data.userId);
        if (user == null) {
            user = new userObject(data.userId, data.userData);
        }
        CHATS[data.chatName].joinUser(user, this);
    });




});
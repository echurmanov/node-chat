if (typeof window.Chat === 'undefined') {
    window.Chat = function (user, host) {
        if (typeof host == 'undefnined') {
            host = window.location.host;
        }
        this.socket = io.connect('http://' + host);
        this.user = user;

        this._event = {
            onmessage: null,
            onsysmessage: null
        };

        this.addEventListener = function (eventType, handler) {
            if (typeof this._event[eventType] !== 'undefined') {
                this._event[eventType] = handler;
            }
        };

        this.join = function(chatname) {
            this.socket.emit('join', {userId: user.userId, userData: this.userData, chatname: chatname});
        };

        this.message = function (chatname, message) {
            this.socket.emit('message', {chatname: chatname, message: message});
        };

        var chat = this;
        this.socket.on('message', function(data) {
            if (typeof chat._event['onmessage'] === 'function') {
                chat._event['onmessage'](data);
            }
        });

        this.socket.on('message', function(data) {
            if (typeof chat._event['onsysmessage'] === 'function') {
                chat._event['onsysmessage'](data);
            }
        });
    }
}


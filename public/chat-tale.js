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
            this.socket.emit('join', {userId: this.user.userId, userData: this.user.userData, chatName: chatname});
        };

        this.getList = function(chatname) {
            this.socket.emit('get-user-list', {chatName: chatname});
        };

        this.message = function (chatname, message) {
            this.socket.emit('message', {chatName: chatname, message: message});
        };

        var chat = this;
        this.socket.on('message', function(data) {
            if (typeof chat._event['onmessage'] === 'function') {
                chat._event['onmessage'](data);
            }
        });

        this.socket.on('sys-message', function(data) {
            if (typeof chat._event['onsysmessage'] === 'function') {
                chat._event['onsysmessage'](data);
            }
        });
    }
}

//Example:


var chat = null;
function TaleChatInit() {
    var userName = prompt("Введите ваше имя", "Вася Пупкин");
    if (userName) {
        $('#chat-init-button').remove();
        chat = new Chat({userId: userName, userData: {name: userName}}, 'chat.webtricks.pro:8084');
        chat.join('Tale');
        chat.addEventListener('onmessage', function(data){
            document.getElementById('chat').innerHTML = '<strong>' + data.user.name + '</strong>: ' + data.message + '<br/>' + document.getElementById('chat').innerHTML;
        });
        chat.addEventListener('onsysmessage', function(data){
            var cnt = document.getElementById('chat');
            switch (data.type) {
                case 'user-join':
                    cnt.innerHTML = ('<span style="color:gray;"><em>' + data.user.name + '</em> вошел в чат</span><br/>' + cnt.innerHTML);
                    break;
                case 'user-leave':
                    cnt.innerHTML = ('<span style="color:gray;"><em>' + data.user.name + '</em> покинул чат</span><br/>' + cnt.innerHTML);
                    break;
                case 'user-list':
                    var innerHTML = '';
                    for (var userIndex in data.users) {
                        innerHTML += '<li>'+data.users[userIndex].name+'</li>';
                    }
                    document.getElementById('user-list').innerHTML = innerHTML;
                    break;
            }
        });
        chat.getList('Tale');
    }
}
function send() {
    chat.message('Tale', $('#message').val());
    $('#message').val('');
}
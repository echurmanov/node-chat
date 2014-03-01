function addTaleChat(event){
    kango.removeMessageListener("addTaleChat",addTaleChat );
    if (window.location.href.indexOf('http://the-tale.org/game') == 0) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://chat.webtricks.pro:8084/socket.io/socket.io.js';
        document.getElementsByTagName('head')[0].appendChild(script);

        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://chat.webtricks.pro/chat-tale.js';
        document.getElementsByTagName('head')[0].appendChild(script);
        var cnt = $("#content");

        var row = $(document.createElement("div")).attr(
            {
                class: "row"
            }
        );
        row.html('<div class="span8"><div id="chat" class="block" style="height: 250px; overflow-y: scroll;"></div></div><div class="span4"><div class="block" style="height:250px; overflow-y: scroll;"><h5>Кто в чате:</h5><ul id="user-list"></ul></div></div></div><div><div class="span12"><div class="block"><input id="message" class="span10" onkeypress="if (event.keyCode == 13) send();"><button class="btn btn-success" onclick="send()">Отправить</button><button id="chat-init-button" class="btn btn-warning" onclick="TaleChatInit()">Включить</button></div></div>');
        row.appendTo(cnt);
    }
}

(function(){
    kango.addMessageListener("addTaleChat", addTaleChat);
    kango.addMessageListener('errorMessage', function(msg){
        alert(msg.data);
    });
})();
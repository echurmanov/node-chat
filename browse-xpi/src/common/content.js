function addTaleChat(event){
    kango.removeMessageListener("addTaleChat",addTaleChat );
    console.log("Page URL: " + window.location.href);
    if (window.location.href.indexOf('http://the-tale.org/game') == 0) {
        var cnt = $("#content");
        $(document.createElement('script')).attr(
            {
                type: 'text/javascript',
                src: 'http://chat.webtricks.pro:8084/socket.io/socket.io.js'
            }
        ).appendTo(document.getElementsByTagName('head')[0]);
        $(document.createElement('script')).attr(
            {
                type: 'text/javascript',
                src: 'http://chat.webtricks.pro/chat-tale.js'
            }
        ).appendTo(document.getElementsByTagName('head')[0]);

        cnt.html(cnt.html() + '<div class="row"><div class="span8"><div id="chat" class="block" style="height: 250px; overflow-y: scroll;"></div></div><div class="span4"><div class="block" style="height:250px; overflow-y: scroll;"><h5>Кто в чате:</h5><ul id="user-list"></ul></div></div></div><div class="row"><div class="span12"><div class="block"><input id="message" class="span10" onkeypress="if (event.keyCode == 13) send();"><button class="btn btn-success" onclick="send()">Отправить</button><button id="chat-init-button" class="btn btn-warning" onclick="TaleChatInit()">Включить</button></div></div></div>');
    }
}

(function(){
    kango.addMessageListener("addTaleChat", addTaleChat);
    kango.addMessageListener('errorMessage', function(msg){
        alert(msg.data);
    });
})();
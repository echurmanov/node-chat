function TheTaleChat() {
    var self = this;
    kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
        self._onCommand();
    });
}

TheTaleChat.prototype = {

    _onCommand: function() {
        kango.browser.tabs.getCurrent(function(tab) {
            // tab is KangoBrowserTab object
            if (tab.getUrl().indexOf("http://the-tale.org/game") == 0) {
                tab.dispatchMessage('addTaleChat', kango.io.getResourceUrl('res/tale-widgets-reinit.js'));
            } else {
                tab.dispatchMessage('errorMessage', 'Данный функционал доступен только на странице http://the-tale.org/game');
            }
        });
    }
};

var extension = new TheTaleChat();
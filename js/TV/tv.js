/* Created by vitalii on 21.12.17. */
function TV() {
    this.container = $("#menu");
    this.isActive = false;
    this.isVisible = false;
    this.widgets = [
        new TVCategories,
        new TVChannels,
        new TVPrograms
    ];
    this.widgets[0].channelWidget = this.widgets[1];
    this.widgets[0].programsWidget = this.widgets[2];
    this.widgets[1].categoryWidget = this.widgets[0];
    this.widgets[1].programsWidget = this.widgets[2];
    this.currentIndex = 2;
}
TV.prototype.show = function () {
    this.container.show();
    this.isVisible = true;
    this.widgets[1].scrollForMiddle();
};
TV.prototype.hide = function () {
    this.container.hide();
    this.isVisible = false;
};
TV.prototype.setActive = function (active) {

    this.container.show();
    this.isActive = this.isVisible =  active;
    if(!active)
    	this.widgets[this.currentIndex].setActive(active);
    // this.currentIndex = 2;
    this.widgets[this.currentIndex].setActive(active);
};

TV.prototype.upKeyHandler = function() {
    if (this.isActive && this.widgets[this.currentIndex])
        this.widgets[this.currentIndex].upKeyHandler();
};

TV.prototype.downKeyHandler = function() {
    if (this.isActive && this.widgets[this.currentIndex])
        this.widgets[this.currentIndex].downKeyHandler();
};

TV.prototype.upKeyHandlerUp = function() {
    if (this.isActive && this.widgets[this.currentIndex])
        this.widgets[this.currentIndex].upKeyHandlerUp();
};

TV.prototype.downKeyHandlerUp = function() {
    if (this.isActive && this.widgets[this.currentIndex])
        this.widgets[this.currentIndex].downKeyHandlerUp();
};

TV.prototype.okKeyHandler = function() {
    if (this.isActive && this.widgets[this.currentIndex])
        this.widgets[this.currentIndex].okKeyHandler();
    // if(this.currentIndex < 2) {
    //     this.rightKeyHandler();
    // }
};
TV.prototype.rightKeyHandler = function () {

    if(this.currentIndex >= 2)
        return;
    this.widgets[this.currentIndex].rightKeyHandler();
    this.widgets[this.currentIndex].setActive(false);
    this.currentIndex++;
    this.widgets[this.currentIndex].setActive(true);
};
TV.prototype.leftKeyHandler = function () {
    if(this.currentIndex == 0 ) {
//    	this.widgets[0].setActive(false);
//        Main.popWidget();
        return; // TODO выход с виджета ТВ
    }
    this.widgets[this.currentIndex].setActive(false);
    this.currentIndex--;
    this.widgets[this.currentIndex].setActive(true);
};

TV.prototype.checkChannel = function (channelData, callback, errorCallback) {
    if(!channelData.is_free){
        Main.pushWidget('message', {
            type: 'noFree',
            subs: channelData.subs,
            onSuccess: function () {
                Main.popWidget();
                if(errorCallback)
                    errorCallback();
            },
            hideLastWidget: 1
        });
        return;
    }
    if(channelData.channel_parental_protect){
        Main.pushWidget("checkKey",{
            successCallback: function () {
                Main.popWidget();
                if(callback)
                    callback();
            }.bind(this),
            cancelCallback: function () {
                Main.popWidget();
                if(errorCallback)
                    errorCallback();
            }.bind(this)
        });
    }else{
        if(callback)
            callback();
    }
};
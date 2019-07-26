function MainControl(){
    ListBase.call(this, $('#bar'));
    this.playerContainer = $('#bar');
    this.name = 'MainControl';
    this.isVisible = false;
    this.isActive = false;
    this.createBar();
    this.playerBackground = $('#player');
    $(document).on('custom.changeLang', function () {this.createBar()}.bind(this));
}

MainControl.prototype = Object.create(ListBase.prototype);
MainControl.prototype.constructor = MainControl;


MainControl.prototype.init = function () {
    this.isVisible = true;
    this.createBar();
    
    //TODO infoblock show
};
MainControl.prototype.createBar = function () {

    var temp = '<div class="progressBar" >\n' +
    '                <div class="timeline">\n' +
    '                    <div class="timeline_watched"></div>\n' +
    '                    <div class="timeline_live">' +
        '                   <div id="pointer">' +
        '                       <div id="infoSeek"></div>' +
        '                   </div>' +
        '               </div>\n' +
'                       <div class="placeholderSeek" >' +
'                           <img class="view" src=""  alt=""><div class="seek">+1:40</div></img>' +
'                       </div>' +
    '                </div>\n' +
    '            </div>\n' +
                '<div class="buttons pause_live_buttons">\n' +
                    '<div data-id="continue" class="btn"><span>'+LocaleManager.tr('continu')+'</span></div>\n' +
                    '<div data-id="tolive" class="btn"><span>'+LocaleManager.tr('onAir')+'</span></div>\n' +
                '</div>\n' +
    '            <div class="control">\n' +
    '                <div class="left " data-id="tv">\n' +
    '                    <div class="icon"></div>\n' +
    '                    <span class="name">'+LocaleManager.tr('tv')+'</span></div>\n' +
    '                <div class="prev icon " data-id="prev"><img class="prview" src="" alt=""></div>\n' +
    '                <div class="backf icon "  data-id="rew"></div>\n' +
    '                <div class="pause icon " data-id="playpause"></div>\n' +
    '                <div class="jumpf icon "  data-id="ff"></div>\n' +
    '                <div class="next icon " data-id="next"><img class="prview" src="" alt=""></div>\n' +
    '                <div class="right " data-id="setting">\n' +
    '                    <div class="icon"></div>\n' +
    '                    <span class="name">'+LocaleManager.tr('settings')+'</span></div>\n' +
    '                </div>\n' +
    '            </div>';
    this.container.html(temp);
    
    temp = "";
    this.listContainer = $('.control');
    Player.bar =  $("#bar");
    Player.prview = $('#bar .placeholderSeek');
    Player.seek = $('#bar .placeholderSeek .seek');
    Player.infoSeek = $("#infoSeek");
    Player.seekView = $('#bar .placeholderSeek .view');
    this.prevProgram = $('#bar .prev .prview');
    this.nextProgram = $('#bar .next .prview');


    this.currentItem = this.listContainer.children().first();
    this.setItemSelected(true);
    
    //TODO infoblock show
};

MainControl.prototype.show = function () {
	// this.playerBackground.css('background', 'rgba(0, 0, 0, 0.8)');
	Main.infoblock.show();
    this.isVisible = true;
    this.playerContainer.show();
    Main.hideAllWidgets();
};

MainControl.prototype.hide = function () {
	// this.playerBackground.css('background', 'rgba(0, 0, 0, 0)');
    Main.infoblock.hide();
    this.isVisible = false;
    this.playerContainer.hide();
};

MainControl.prototype.updatePrview = function (prev, next) {
    this.prevProgram.attr('src', prev);
    this.nextProgram.attr('src', next);
};

MainControl.prototype.setActive = function(active){
    ListBase.prototype.setActive.apply(this, arguments);
    this.isActive = this.isVisible = active;
    this.setFocused(active);
};

MainControl.prototype.focusPlay = function(){
    this.listContainer.children('.focus').removeClass('focus');
    this.currentItem = this.listContainer.children('[data-id=playpause]');
    this.setFocused(true);
};
MainControl.prototype.focusItem = function(item){
    if(this.listContainer.children('[data-id='+item+']').hasClass('none'))
        return false;
    this.listContainer.children('.focus').removeClass('focus');
    this.currentItem = this.listContainer.children('[data-id='+item+']');
    this.setFocused(true);
    return true;
};

MainControl.prototype.rightKeyHandler = function (currentItem) {

    if(currentItem)
        this.currentItem = currentItem;
    else
        this.currentItem = this.listContainer.children('.focus');

    var nextItem = this.currentItem.next();
    if(nextItem.hasClass("none")){
        this.currentItem.removeClass('focus');
        this.currentItem = nextItem;
        this.rightKeyHandler(this.currentItem);
        return;
    }
    if(!nextItem.length)
        return;

    this.currentItem.removeClass('focus');

    nextItem.addClass('focus');
    this.currentItem = nextItem;
    Main.hideAllWidgets();
};

MainControl.prototype.leftKeyHandler = function (currentItem) {
    if(currentItem)
        this.currentItem = currentItem;
    else
        this.currentItem = this.listContainer.children('.focus');

    var prevItem = this.currentItem.prev();
    if(prevItem.hasClass("none")){
        this.currentItem.removeClass('focus');
        this.currentItem = prevItem;
        this.leftKeyHandler(this.currentItem);
        return;
    }
    if(!prevItem.length)
        return;
    this.currentItem.removeClass('focus');
    prevItem.addClass('focus');
    this.currentItem = prevItem;
    Main.hideAllWidgets();
};

MainControl.prototype.upKeyHandler = function (currentItem) { Player.nextChannel();};

MainControl.prototype.downKeyHandler = function (currentItem) { Player.prevChannel();};

MainControl.prototype.okKeyHandler = function () {

    var id = this.currentItem.data("id");
    console.log(id);
    // return;
    switch (id) {
        case "tv":
        case "setting":
            Main.pushWidget(this.currentItem.data("id"));
            break;
        case "playpause":
            if (this.currentItem.hasClass("pause") ) {
                Player.pause();
//                if (!Player.playingDVR)
//                    this.upKeyHandler();
            } else if (this.currentItem.hasClass("play")) {
                Player.play();
                if (!Player.playingDVR)
                    $(".pause_live_buttons").hide();
            }
            break;
        case "next":
            Player.nextProgram();
            break;
        case "prev":
            Player.prevProgram();
            break;
        case "ff":
            // if(Player.playingDVR){
                Player.ff();
            // }else{
            //     Player.playChannel(Main.currentChannel.id);
            // }
            break;
        case "rew":
            Player.rew();
            break;
        case "continue":
            this.hidePauseLiveButtons();
            Player.play();
            break;
        case "tolive":
            this.hidePauseLiveButtons();
            Player.playChannel(Main.currentChannel.id);
            break;
    }
    Main.hideAllWidgets();
};
MainControl.prototype.hidePauseLiveButtons = function () {
    this.listContainer.hide();
    this.listContainer = $(".control");
    this.currentItem.removeClass('focus');
    this.listContainer.find(".hidden_focus").removeClass("hidden_focus");
    this.currentItem = this.listContainer.find('[data-id="playpause"]');
    this.currentItem.addClass('focus');
};

MainControl.prototype.controlPlayLivewithoutProgram = function () {
    this.container.find(".progressBar").hide();
    this.listContainer.find(".jumpf").addClass("none");
    this.listContainer.find(".next").addClass("none");
    this.listContainer.find(".backf").addClass("none");
    this.listContainer.find(".prev").addClass("none");
    this.listContainer.find('[data-id="playpause"]').css("margin-left", "468px");
    if(this.listContainer.find(".next").hasClass("focus") )
        this.focusPlay();
};

MainControl.prototype.controlPlayLive = function () {
        this.container.find(".progressBar").show();
       this.listContainer.find(".jumpf").addClass("none");
       this.listContainer.find(".next").addClass("none");
       this.listContainer.find(".backf").toggleClass("none", false)
       this.listContainer.find(".prev").toggleClass("none", false).css("margin-left", "252px");
       this.listContainer.find('[data-id="playpause"]').css("margin", "0 30px");
       if(this.listContainer.find(".next").hasClass("focus") || this.listContainer.find(".jumpf").hasClass("focus"))
           this.focusPlay();
};

MainControl.prototype.controlPlayLiveSeek = function () {
    this.container.find(".progressBar").show();
    this.listContainer.find(".jumpf").toggleClass("none", false);
    this.listContainer.find(".next").addClass("none");
    this.listContainer.find(".backf").toggleClass("none", false);
    this.listContainer.find(".prev").toggleClass("none", false).css("margin-left", "252px");
    this.listContainer.find('[data-id="playpause"]').css("margin", "0 30px");
    if(this.listContainer.find(".next").hasClass("focus"))
        this.focusPlay();
};

MainControl.prototype.controlPlayDVR = function () {
        this.container.find(".progressBar").show();
       this.listContainer.find(".jumpf").removeClass("none");
       this.listContainer.find(".next").removeClass("none");
       this.listContainer.find(".backf").removeClass("none");
       this.listContainer.find(".prev").toggleClass("none", false);
       this.listContainer.find(".prev").css("margin-left", "252px");
        this.listContainer.find('[data-id="playpause"]').css("margin", "0 30px");
};




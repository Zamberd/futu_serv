function Infoblock() {
    this.isVisible = false;
    this.infoblock = $('#info');
    this.timeid = null;
    this.data = null;
    this.timerHide = null;
}
Infoblock.prototype.show = function (item) {

    if(!this.data && !item ){
        return;
    }
    if(item){
        // if(this.data && this.data.programm_id == item.programm_id && this.data.channel_id == item.channel_id && item.channelNumForm){
        //     return;
        // }
        this.data = item;
    }
    this.isVisible = true;
    this.infoblock.show();
    if(arguments.length ){
        this.createInfo(item);
    }else{
        this.startClock();
    }
    Main.hideAllWidgets();

    this.timeoutHide();
    if(Main.programs.isVisible)
        this.hide();
};

Infoblock.prototype.createInfo = function (item) {
    if(!item){
        return
    }
    clearTimeout(this.timeid);
    console.log(item);
    var time = "";
    var startTime = "";
    var endTime = "";

    if(item.start && item.stop ){
        startTime = moment.unix(item.start).format('HH:mm');
        endTime = moment.unix(item.stop).format('HH:mm');
        time = startTime+' — '+endTime;
    }

    var channelIcon  = item.channelIcon || (Main.currentChannel ? Main.currentChannel.channelIcon : "");
    // var channelPoster  = item.poster_url || (Main.currentChannel ? Main.currentChannel.channelPoster : "");
    var channelTitle = item.channelTitle || Main.currentChannel.title;
    var channelNumber = item.channelNumber || Main.channelNumber+1;

    if(!item.channelNumForm){
        channelNumber / 10 < 10 ? (channelNumber / 10 >= 1 ? channelNumber = '0' + channelNumber : channelNumber = '00' + channelNumber) : channelNumber;
    }else{
        channelNumber / 10 < 10 ? (channelNumber / 10 >= 1 ? channelNumber = '_' + channelNumber : channelNumber = '__' + channelNumber) : channelNumber;
    }

    var icon = item.hasOwnProperty('is_free') && item.hasOwnProperty('channel_parental_protect') ? (item.is_free ? (item.channel_parental_protect ? ' parControl': ' ') : 'noFree') : ' ';
    //        '  <img src="'+channelPoster+'" alt="">\n' +
    var tmpList = "";
    item.name = item.name || item.title;
    /**
     * '<div class="logo">\n' +
        '	<div style="background: url(\'' +channelPoster+ '\'); height: 200px; width: 358px; background-size: cover;" ></div>\n' +
        '</div>\n' +
     * */
    tmpList += '<div class="infoChannel">\n' +
        ' <div class="channel">\n' +
        '   <span class="channel_icon"><img src="'+channelIcon+'" alt=""></span>\n' +
        '   <span class="channel_title number" id="channelNum"> '+channelNumber+'</span>\n' +
        '   <span class="channel_title"> '+channelTitle+'</span>\n' +
        '   <span class="icon '+ icon +'"></span>\n' +
        ' </div>\n' +

        ' <div class="program"><span class="program_title">';
    tmpList += item.name && item.name.length > 50 ? subStr(item.name, 49) : item.name;
    tmpList +='</span><br>\n' +
        '  <span class="program_time">'+time+'</span>\n' +
        ' </div>\n' +
        '<div class="clock"><span class="channel_title number" id="clock"></span></div>\n' +
    '</div>';
    this.infoblock.html(tmpList);
    this.startClock();

};
Infoblock.prototype.hide = function() {
    clearTimeout(this.timeid);
    clearTimeout(this.timerHide);
    this.isVisible = false;
    this.infoblock.hide();
};
Infoblock.prototype.timeoutHide = function (){

    clearTimeout(this.timerHide);
    this.timerHide = setTimeout( function () {
        if(Main.currentWidget !== Main.mainControl)
            this.hide()
    }.bind(this) , 15000);
};
Infoblock.prototype.startClock = function() {
    var timeNow = moment();
    var time = timeNow.format('HH:mm');
    $('#clock').text(time);
    if(!this.timeid)
        this.timeid = setTimeout(function() {Main.infoblock.startClock()},1000);
};

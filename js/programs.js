/**
 * Created by vitalii on 22.12.17.
 */
function Programs() {
    ListBase.call(this, $("#programs"));
    this.containerWrapper = $("#programContainer");
    this.titleLogo = $("#programContainer .titlePrograms .logo");
    this.titleTime = $("#programContainer .titlePrograms .titleDate");
    this.titleClock = $("#programContainer .titlePrograms .clock");
    this.isActive = false;
    this.isVisible = false;
    this.programsData = null;
    this.createWidget();
    this.timer = null;
    this.timerRefreshProgram = null;
    this.timerHide = null;

    this.indexCurrentItem = 0;
    this.indexRender  = 0;
    this.countItemRender  = 12;
    // this.timerShowDesc = null;
    $(document).on("custom.focusLive", function() {this.focusLive()}.bind(this));
    $(document).on("custom.nextLive", function() {this.nextLive()}.bind(this));
    $(document).on("custom.nextProgram", function() {this.nextProgram()}.bind(this));
    $(document).on("custom.prevProgram", function() {this.prevProgram()}.bind(this));
    $(document).on("custom.updateOnProgram", function() {this.updateOnProgram()}.bind(this));
}
Programs.prototype = Object.create(ListBase.prototype);
Programs.prototype.constructor = Programs;


Programs.prototype.show = function () {
    this.containerWrapper.show();
    this.container.show();

    this.isVisible = true;
    this.scrollForMiddle();
    this.setFocused(true);

    Main.infoblock.hide();
    this.timerHideWidget();
};
Programs.prototype.hide = function () {
    this.containerWrapper.hide();
    this.container.hide();
    this.isVisible = false;
    clearTimeout(this.timerHide);
};
Programs.prototype.setActive = function (active) {

    this.container.show();
    this.isActive = this.isVisible =  active;
    this.setItemSelected(true);
    if(active){
        // if(this.currentItem.find('.desc').text() !== "")
        //     this.currentItem.toggleClass('showDesc', true);
        this.container.addClass("active");

        this.scrollForMiddle();
    }else{
        // this.currentItem.toggleClass('showDesc', false);
        this.container.removeClass("active");
    }
};
Programs.prototype.timerHideWidget = function () {
    clearTimeout(this.timerHide);
    this.timerHide = setTimeout(function () {
        if(Main.currentWidget === Main.programs)
            Main.popWidget();
    }, 15000);
};
Programs.prototype.updatePosterPrview = function () {
    var prevPr, nextPr;
    var temp = getItemByProgramId(this.programsData.program, this.currentItem.prev().data("id"), true);
    if(temp && temp.program){
        prevPr = temp.program.poster_url;
        nextPr = this.programsData.program[temp.id+2];
        if(nextPr)
            nextPr = nextPr.poster_url;
        else
            nextPr = "";//TODO placeholder http://cdn.teleset.iptvapi.net/i/37/68/90/376890poster-test.jpg
    }else{
        prevPr = nextPr = ""; // http://cdn.teleset.iptvapi.net/i/37/68/90/376890poster-test.jpg
    }
    Main.mainControl.updatePrview(prevPr, nextPr);
};

Programs.prototype.prevProgram = function () {

    this.currentItem = this.listContainer.find('[data-id='+Main.currentProgram.programm_id+']');
    if(!this.currentItem.prev().length)
        return;
    console.log(this.currentItem.prev());
    this.setFocused(false);
    this.currentItem = this.currentItem.prev();

    // this.updatePosterPrview();

    this.playCurrentProgram();
    if(this.isActive)
        this.setFocused(true);
    else
        this.setFocused(false)

};

Programs.prototype.nextProgram = function () {

    this.currentItem = this.listContainer.find('[data-id='+Main.currentProgram.programm_id+']');
    if(!this.currentItem.next().length){

        return;
    }
    this.setFocused(false);
    this.currentItem = this.currentItem.next();

    // this.updatePosterPrview();

    this.playCurrentProgram();
    if(this.isActive)
        this.setFocused(true);
    else
        this.setFocused()
};

Programs.prototype.focusLive = function () {
    if(this.isActive)
        this.setFocused(true, this.listContainer.children(".live"));
    else
        this.currentItem = this.listContainer.children(".live")
    this.setItemSelected(true, this.currentItem);
    this.listContainer.children('.on').removeClass('on');
    this.currentItem.addClass('on');
    // this.refreshProgressBar();
};

Programs.prototype.nextLive = function () {
    this.listContainer.find('.live').removeClass('live');
    this.listContainer.find('[data-id=' +Player.liveProgram.programm_id + ']').addClass('live');

    // var item = this.listContainer.find('.live');
    // var newLive = item.next();
    // item.removeClass('live');
    // newLive.addClass('live');
};

Programs.prototype.updateOnProgram = function () {
    this.listContainer.find('.on').removeClass('on');
    this.currentItem = this.listContainer.find('[data-id='+Main.currentProgram.programm_id+']');
    this.currentItem.addClass('on');
    // this.setFocused(false);
};

Programs.prototype.createWidget = function () {
    this.container.html('<ul class="wrapper"></ul>');
    this.listContainer =  this.container.find('ul');
};


Programs.prototype.changeLang = function () {

    var channel = getItemById(Main.channels, Main.currentChannel.id);
    if(channel)
        Main.currentChannel = channel;
    console.log(channel)
    var program = getItemByProgramId(this.programsData.program, Main.currentProgram.programm_id);
    if(program) {
        Main.currentProgram = program;
        Player.progressBar();
        Main.changeLang = false;
    }
};

Programs.prototype.addLiveProgram = function(){
    var str = '';
    var now = moment().unix();
    str += '<li class="list_header hr" data-day="'+moment.unix(now).format('YYYY-MM-DD')+'"><h3>'+moment.unix(now).format('DD MMMM, dd')+'</h3></li>';
    str += '<li class="itemProgram live" data-id="0" data-idChannel="'+this.channelData.id+'">';
    str += '<div class="time_container"><div class="icon"></div>\
                <div class="progressBar" style="display: none;"><i class="progress"></i></div>\
            </div>';
    str += '<div class="programTitle">'+LocaleManager.tr("live")+'</div>\
            <div class="desc">'+LocaleManager.tr("live")+'</div>';
    return str;
};

Programs.prototype.refreshTitle = function () {
    var timeDay, timeMonth, item;
    this.startClock();
    this.titleLogo.html('<img src="'+Main.currentChannel.channelIcon+'" alt="">');
    if(this.currentItem.data('id') !== 0){
        // item = getItemByProgramId(this.programsData.program, this.currentItem.data('id'));
        item = this.programsData.program[this.indexCurrentItem];

        var time = moment.unix(item.start);
        if(moment(moment().format('YYYY-MM-DD')).isSame(time.format('YYYY-MM-DD'), 'day'))
            timeDay = 'Сегодня, ' + time.format(" D ");
        else
            timeDay = time.format("dddd,  D");
        timeMonth = time.format("MMMM");
    }else{
        timeDay = 'Сегодня, ' + moment().format(" D ");
        timeMonth = moment().format("MMMM");
    }
    this.titleTime.html('<span>'+timeDay +' </span>' + timeMonth);
};

Programs.prototype.startClock = function() {
    var timeNow = moment();
    var time = timeNow.format('HH:mm');
    this.titleClock.text(time);
    if(!this.timeid)
        this.timeid = setTimeout(function() {this.startClock()}.bind(this),1000);
};

Programs.prototype.render = function () {
    var tmpDate = -1,
        tmpList = "";

    if(!this.programsData.program.length){
        tmpList += this.addLiveProgram();

        this.listContainer.html(tmpList);

        this.currentItem = this.listContainer.children("[data-id='0']");
    }else{
        var dateNow = moment();
        var start = this.indexRender - this.countItemRender;
        if(start < 0){
            start = 0;
        }
        var stop = this.indexRender + this.countItemRender;
        if(stop >= this.programsData.program.length){
            stop = this.programsData.program.length-1;
        }
        for( var j = start; j <= stop; j++){
            var item = this.programsData.program[j];
            var dateStartArr = moment.unix(item.start).format('YYYY-MM-DD');
            var mom = moment.unix(item.start);
            if (tmpDate != dateStartArr) {
                tmpDate = dateStartArr;
                tmpList += '<li class="list_header hr" data-day="'+ tmpDate+'"><h3>'+ mom.format('DD MMMM, dd ') +'</h3></li>';
            }
            var dateEnd = moment.unix(item.stop);

            if(mom.diff(dateNow) < 0  &&  dateNow.diff(dateEnd) < 0){
                tmpList += '<li class="itemProgram live" data-id="'+item.programm_id+'" data-idChannel="'+this.channelData.id+'">';
            }else if(item.dvr && mom.diff(dateNow) < 0 ){
                tmpList += '<li class="itemProgram play" data-id="'+item.programm_id+'" ' +
                    'data-idChannel="'+this.channelData.id+'">';
            }else {
                tmpList += '<li class="itemProgram " data-id="'+item.programm_id+'" data-idChannel="'+this.channelData.id+'">';
            }
            var timeS = mom.format('HH:mm');
            // var itemName = subStr(item.name, 40);
            tmpList += '<div class="time_container"><div class="icon"></div><div class="time">'+timeS+'</div>\
                            <div class="progressBar"><div class="progress"></div></div>\
                        </div>';
            tmpList += '<div class="programTitle">'+ (item.name && item.name.length > 31 ? subStr(item.name, 30) : item.name) + '</div>';
            // tmpList += '<span class="genre">США, 2016, фантастика, фантастика</span>';
            tmpList += '<div class="desc">' + (item.description && item.description.length > 151 ? subStr(item.description, 150) : item.description) +'</div>';
            tmpList += '</li>';
        }
        this.listContainer.html(tmpList);

        this.currentItem = this.listContainer.children("[data-id='"+this.programsData.program[this.indexCurrentItem].programm_id+"']");


    }
    if(Main.currentChannel.channel_id == this.channelData.channel_id && this.currentItem.data("id") == Main.currentProgram.programm_id || this.currentItem.data("id") == 0){
        this.currentItem.addClass('on');
    }
    if(this.isActive) {
        this.setFocused(true);
    }else
        this.setItemSelected(true);

};


Programs.prototype.playLive = function () {
    this.currentItem = this.listContainer.children('.live');
    Main.currentChannel = this.channelData;
    this.listContainer.children('.selected').removeClass('selected');
    this.listContainer.children('.on').removeClass('on');
    this.setItemSelected(true, this.currentItem);
    this.setFocused(true);
    this.currentItem.addClass('on');

    this.updatePosterPrview();

    var currentItemProgram;
    if(this.currentItem.data('id') == '0'){
        currentItemProgram = {
            "live": true,
            "name": LocaleManager.tr('live'),
            "description" :LocaleManager.tr('live'),
            "is_free": this.channelData.is_free,
            "channel_parental_protect": this.channelData.channel_parental_protect
        }
    }else{
        currentItemProgram = getItemByProgramId(this.programsData.program, this.currentItem.data("id"));
        currentItemProgram.is_free = this.channelData.is_free;
        currentItemProgram.channel_parental_protect = this.channelData.channel_parental_protect;
    }
    if(currentItemProgram)
        Player.progressBarLive(currentItemProgram);

    // this.okKeyHandler();
    // this.okKeyHandler();
};

Programs.prototype.okKeyHandler = function () {

    if(!this.currentItem.hasClass('on')){
        if(!this.currentItem.hasClass('live') && !this.currentItem.hasClass('play'))
            return;
        // console.log(this.channelData);
        Main.prevChannel = Main.currentChannel;
        Main.currentChannel = this.channelData;
        Main.updateChannelNumber();

        Main.tv.checkChannel(this.channelData, function () {
            this.playCurrentProgram();
        }.bind(this) );
        Main.popWidget();
    }else{
        // Main.currentWidget.hide();
        //TODO переход в плеер
        Main.popWidget();
    }
};

Programs.prototype.playCurrentProgram = function() {

    if(!this.currentItem.hasClass('live') && !this.currentItem.hasClass('play'))
        return;
    this.listContainer.children('.selected').removeClass('selected');
    this.listContainer.children('.on').removeClass('on');
    var notLiveProgram = false;
    var currentItemProgram;

    if(this.currentItem.data('id') == '0'){
        currentItemProgram = {
            "live": true,
            "name": LocaleManager.tr('live'),
            "description" :LocaleManager.tr('live')
        };
        notLiveProgram = true;
    }else{
        currentItemProgram = getItemByProgramId(this.programsData.program, this.currentItem.data("id"));
    }
    // if(!currentItemProgram){
    //     currentItemProgram = {"name": LocaleManager.tr('live')};
    //     notLiveProgram = true;
    // }
    this.setItemSelected(true, this.currentItem);
    this.setFocused(true);
    this.currentItem.addClass('on');

    this.updatePosterPrview();

    // Main.currentProgram = currentItemProgram;
    if(notLiveProgram){
        Player.playChannel(this.channelData.id, currentItemProgram);
    }else if(this.currentItem.hasClass('live')){
        Player.playChannel(this.channelData.id, currentItemProgram);
        Main.currentProgram = currentItemProgram;
        // Player.playDVR(false, currentItemProgram, true);
    }else if(this.currentItem.hasClass('play')){
        Player.playDVR(this.channelData.id, currentItemProgram);
    }
    $(document).trigger("custom.updateOnProgram");
};


Programs.prototype.downKeyHandler = function (){

    // clearTimeout(this.timerShowDesc);
    // this.currentItem.toggleClass('showDesc', false);

    if(this.indexCurrentItem < this.programsData.program.length - 1){
        this.indexCurrentItem++;
        ListBase.prototype.downKeyHandler.apply(this);
        if(this.indexCurrentItem > this.indexRender +  this.countItemRender - 2){
            this.indexRender = this.indexCurrentItem;
            this.render();
            this.listContainer.scrollTop(this.listContainer.scrollTop() - this.listContainer.height());
            this.updateListPosition();
        }
    }else{
        this.indexCurrentItem = 0;
        this.indexRender = this.indexCurrentItem;
        this.render();
        this.listContainer.scrollTop(this.listContainer.scrollTop() - this.listContainer.height());
        this.updateListPosition();

    }
    // this.timerShowDesc = setTimeout(function () {
    //     if(this.isActive){
    //         if(this.currentItem.find('.desc').text() !== "")
    //             this.currentItem.toggleClass('showDesc', true);
    //         this.updateListPosition();
    //     }
    //
    // }.bind(this), 600);
    this.refreshTitle();
    this.setItemSelected(true);
    this.timerHideWidget();
};

Programs.prototype.upKeyHandler = function (){

    // clearTimeout(this.timerShowDesc);
    // this.currentItem.toggleClass('showDesc', false);
    if(this.indexCurrentItem > 0) {
        this.indexCurrentItem--;
        ListBase.prototype.upKeyHandler.apply(this);
        if(this.indexCurrentItem < this.indexRender -  this.countItemRender + 2){
            this.indexRender = this.indexCurrentItem;
            this.render();
            this.listContainer.scrollTop(this.listContainer.scrollTop() + this.listContainer.height());
            this.updateListPosition();
        }
    }else{
        this.indexCurrentItem = this.programsData.program.length - 1;
        this.indexRender = this.indexCurrentItem;
        this.render();
        this.listContainer.scrollTop(this.listContainer.scrollTop() + this.listContainer.height());
        this.updateListPosition();

    }
    // this.timerShowDesc = setTimeout(function () {
    //     if(this.isActive){
    //         if(this.currentItem.find('.desc').text() !== "")
    //             this.currentItem.toggleClass('showDesc', true);
    //
    //     }
    // }.bind(this), 600);
    this.refreshTitle();
    this.setItemSelected(true);

    this.timerHideWidget();
    console.log(this.indexCurrentItem)
};

Programs.prototype.scrollForMiddle = function () {

    if(this.currentItem.length == 0)
        return;
    var wrapperScrollTop = this.listContainer.scrollTop();
    var itemTop = this.currentItem.position().top + wrapperScrollTop;
    var itemTopWithHeight = itemTop + ($('.itemProgram').height()*8);
    var wrapperH = this.listContainer.height();
    var wrapper = wrapperScrollTop + wrapperH;
    var delta = (itemTopWithHeight - wrapper);
    this.listContainer.scrollTop(wrapperScrollTop + delta);
};


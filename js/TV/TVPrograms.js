/**
 * Created by vitalii on 22.12.17.
 */
function TVPrograms() {
    ListBase.call(this, $("#program"));
    this.swipeRight  = $('#br2');
    this.swipeLeft  = $('#br1');

    this.programsData = null;

    this.cloneContainer = $("#programs");
    this.clone = Main.programs;

    this.createWidget();
    this.timer = null;
    this.timerRefreshProgram = null;

    this.indexCurrentItem = 0;
    this.indexRender  = 0;
    this.countItemRender  = 12;
    this.timerShowDesc = null;
    $(document).on("custom.focusLive", function() {this.focusLive()}.bind(this));
    $(document).on("custom.nextLive", function() {this.nextLive()}.bind(this));
    $(document).on("custom.nextProgram", function() {this.nextProgram()}.bind(this));
    $(document).on("custom.prevProgram", function() {this.prevProgram()}.bind(this));
    $(document).on("custom.updateOnProgram", function() {this.updateOnProgram()}.bind(this));
}
TVPrograms.prototype = Object.create(ListBase.prototype);
TVPrograms.prototype.constructor = TVPrograms;

TVPrograms.prototype.updatePosterPrview = function () {
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



TVPrograms.prototype.prevProgram = function () {

    this.currentItem = this.listContainer.find('[data-id='+Main.currentProgram.programm_id+']');
    if(!this.currentItem.prev().length)
        return;
    console.log(this.currentItem.prev());
    this.setFocused(false);
    this.currentItem = this.currentItem.prev();
    
    this.updatePosterPrview();
    this.playCurrentProgram();
    if(this.isActive)
        this.setFocused(true);
    else
        this.setFocused(false)

};

TVPrograms.prototype.nextProgram = function () {

    this.currentItem = this.listContainer.find('[data-id='+Main.currentProgram.programm_id+']');
    if(!this.currentItem.next().length){

        return;
    }
    this.setFocused(false);
    this.currentItem = this.currentItem.next();

    this.updatePosterPrview();

    this.playCurrentProgram();
    if(this.isActive)
        this.setFocused(true);
    else
        this.setFocused()
};

TVPrograms.prototype.focusLive = function () {
    if(this.isActive)
        this.setFocused(true, this.listContainer.children(".live"));
    else
        this.currentItem = this.listContainer.children(".live")
    this.setItemSelected(true, this.currentItem);
    this.listContainer.children('.on').removeClass('on');
    this.currentItem.addClass('on');
    this.refreshProgressBar();
};

TVPrograms.prototype.nextLive = function () {
    this.listContainer.find('.live').removeClass('live');
    this.listContainer.find('[data-id=' +Player.liveProgram.programm_id + ']').addClass('live');

    // var item = this.listContainer.find('.live');
    // var newLive = item.next();
    // item.removeClass('live');
    // newLive.addClass('live');
};

TVPrograms.prototype.updateOnProgram = function () {
    this.listContainer.find('.on').removeClass('on');
    this.currentItem = this.listContainer.find('[data-id='+Main.currentProgram.programm_id+']');
    this.currentItem.addClass('on');
    // this.setFocused(false);
};

TVPrograms.prototype.createWidget = function () {
    this.container.html('<div class="titlePrograms">\n' +
        '  <div class="logo"></div>\n' +
        '  <div class="text titleDate" ></div>\n' +
        '  <div class="text clock"></div>\n' +
        '</div>' +
        '<ul class="wrapper"></ul>');
    this.listContainer =  this.container.find('ul');
    this.containerWrapper = $("#program");
    this.titleLogo = $("#program .titlePrograms .logo");
    this.titleTime = $("#program .titlePrograms .titleDate");
    this.titleClock = $("#program .titlePrograms .clock");
};

TVPrograms.prototype.refreshProgressBar = function () {
    var liveProgram = getItemByProgramId(this.programsData.program, this.listContainer.children('.live').data("id"));
    if(liveProgram) {
        Player.progressBarforMenu(liveProgram, this.listContainer);
    }
};

TVPrograms.prototype.changeLang = function () {

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

TVPrograms.prototype.addLiveProgram = function(){
    var str = '';
    var now = moment().unix();
    str += '<li class="list_header hr" data-day="'+moment.unix(now).format('YYYY-MM-DD')+'"><h3>'+moment.unix(now).format('DD MMMM, dd')+'</h3></li>';
    str += '<li class="itemProgram live" data-id="0" data-idChannel="'+this.channelData.id+'">';
    str += '<div class="time_container"><div class="icon"></div>\
                <div class="progressBar" style="display: none;"><i class="progress"></i></div>\
            </div>';
    str += '<div class="programTitle">'+LocaleManager.tr("live")+'</div>\
            <div class="desc">'+LocaleManager.tr("live")+'</div>';
    // <span class="genre">США, 2016, фантастика, фантастика</span>
    return str;
};

TVPrograms.prototype.render = function () {
    var tmpDate = -1,
        tmpList = "";

    if(!this.programsData.program.length){
        tmpList += this.addLiveProgram();

        this.listContainer.html(tmpList);
        this.currentItem = this.listContainer.children("[data-id='0']");

        if(Main.currentChannel.channel_id == this.channelData.channel_id ){
            this.clone.listContainer.html(tmpList);
            this.clone.currentItem = this.clone.listContainer.children("[data-id='0']");
            this.clone.refreshTitle();

        }

    }else{
        var dateNow = moment();
        if(this.indexRender === this.programsData.program.length){
            this.indexRender = this.programsData.program.length;
            this.indexCurrentItem = this.programsData.program.length;
            this.programsData.program[this.indexCurrentItem] = {
                "live": true,
                "name": LocaleManager.tr('live'),
                "description" :LocaleManager.tr('live'),
                "programm_id" : 0,
                "start": moment().unix()
            }

        }
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

            if(mom.diff(dateNow) < 0  &&  dateNow.diff(dateEnd) < 0  || item.programm_id == 0){
                tmpList += '<li class="itemProgram live" data-id="'+item.programm_id+'" data-idChannel="'+this.channelData.id+'">';
            }else if( item.dvr && mom.diff(dateNow) < 0){
                tmpList += '<li class="itemProgram play" data-id="'+item.programm_id+'" data-idChannel="'+this.channelData.id+'">';
            }else {
                tmpList += '<li class="itemProgram " data-id="'+item.programm_id+'" data-idChannel="'+this.channelData.id+'">';
            }
            var timeS = mom.format('HH:mm');
            // var itemName = subStr(item.name, 40);
            if(item.programm_id == 0) {
                tmpList += '<div class="time_container"><div class="icon"></div>\
                    <div class="progressBar" style="display: none;"><i class="progress"></i></div>\
                </div>';
            }else{
                tmpList += '<div class="time_container"><div class="icon"></div><div class="time">'+timeS+'</div>\
                            <div class="progressBar"><div class="progress"></div></div>\
                        </div>';
            }
            tmpList += '<div class="programTitle">'+ (item.name && item.name.length > 31 ? subStr(item.name, 30) : item.name) + '</div>';
            // tmpList += '<span class="genre">США, 2016, фантастика, фантастика</span>';
            tmpList += '<div class="desc">' + (item.description && item.description.length > 151 ? subStr(item.description, 150) : item.description) +'</div>';
            tmpList += '</li>';
        }

        this.listContainer.html(tmpList);

        this.currentItem = this.listContainer.children("[data-id='"+this.programsData.program[this.indexCurrentItem].programm_id+"']");

        if(Main.currentChannel.channel_id == this.channelData.channel_id ) {
            this.clone.listContainer.html(tmpList);
            this.clone.currentItem = this.clone.listContainer.children("[data-id='" + this.clone.programsData.program[this.clone.indexCurrentItem].programm_id + "']");
            this.clone.refreshTitle();
        }
    }

    if(Main.currentChannel.channel_id == this.channelData.channel_id ){
        var now = moment().unix();
        // console.log(this.programsData)

       if( this.programsData.program[this.indexCurrentItem] && this.programsData.program[this.indexCurrentItem].start < now && now < this.programsData.program[this.indexCurrentItem].stop || this.currentItem.data("id") == 0){
           this.currentItem.addClass('on');
           this.clone.currentItem.addClass('on');
       }
    }
    if(this.isActive) {
        this.setFocused(true);
    }else
        this.setItemSelected(true);


};

TVPrograms.prototype.loadDataForChannelId = function (channelId, playLive ) {



	if( typeof channelId === "undefined" )
        return;
	else if (typeof channelId === "object" ) {
	    if(this.channelData && channelId.id === this.channelData.id && !playLive)
	        return;
		this.channelData = channelId;
		channelId = channelId.id;// - id
	} else{
        if(this.channelData && channelId === this.channelData.id && !Main.changeLang)
            return;
        this.channelData = getItemById(Main.channels, channelId);
    }
    if(Main.currentChannel.channel_id == this.channelData.channel_id ){
	    this.clone.channelData = this.channelData;
    }
    // console.log(this.channelData)
    var dateNow = moment();
    // this.currentItem = null;
    // this.listContainer.html("");

//, afterDays: 2, beforeDays: 2,
   apiService.get("tvPrograms", {item_id: this.channelData.id}, function(data) {

        if(data.status == "ok"){

            this.programsData  = data.data;

            console.log(this.programsData)
            Main.currentChannelProgram = this.programsData;
            if (!this.programsData)
                return;
            var tmpDate = -1,
                tmpList = "";

            this.indexCurrentItem = this.indexRender = 0;

            var now = moment().unix();

            if(Player.playingDVR && Main.currentChannel.id == this.channelData.id ){
                //find dvr
                for(var i = 0; i < this.programsData.program.length; i++){
                    if(  Main.currentProgram.programm_id == this.programsData.program[i].programm_id ){
                        this.indexCurrentItem = this.indexRender = i;
                        break;
                    }
                }
            }else{

                //find live
                if(this.programsData.program && this.programsData.program.length && this.programsData.program[this.programsData.program.length-1].stop <= now){
                    this.indexCurrentItem = this.indexRender = this.programsData.program.length;

                }else{
                    for(var i = 0; i < this.programsData.program.length; i++){
                        if(this.programsData.program[i].start <= now &&  now <= this.programsData.program[i].stop ){
                            this.indexCurrentItem = this.indexRender = i;
                            break;
                        }
                    }
                }
            }

            if(Main.currentChannel.channel_id == this.channelData.channel_id ){

                this.clone.programsData = data.data;
                this.clone.indexCurrentItem = this.clone.indexRender =  this.indexCurrentItem;
                if(Main.currentProgram)
                    this.clone.currentItem = this.clone.listContainer.children("[data-id='"+Main.currentProgram.programm_id+"']");
                else
                    this.clone.currentItem = this.clone.listContainer.children(".live");

            }
            if(Main.currentProgram) {
                this.currentItem = this.listContainer.children("[data-id='" + Main.currentProgram.programm_id + "']");
            }
            else{


                this.currentItem = this.listContainer.children(".live");
            }

            // console.log(this.currentItem);
            this.setItemSelected(true);

            // if(!this.currentItem.length){
            //
            //     tmpList = "";
            //     tmpList += this.addLiveProgram();
            //     this.listContainer.append(tmpList);
            //     this.clone.listContainer.append(tmpList);
            //
            //     this.currentItem = this.listContainer.children(".live");
            //     this.clone.currentItem = this.clone.listContainer.children(".live");
            //
            //     if(!this.currentItem.length){
            //         this.currentItem = this.listContainer.children(".itemProgram").last();
            //         this.clone.currentItem = this.clone.listContainer.children(".itemProgram").last();
            //     }
            // }

            this.render();

            // console.log(this.currentItem);
            // if(Main.currentChannel.channel_id == this.channelData.channel_id ){
            //     this.currentItem.addClass('on');
            //     this.clone.currentItem.addClass('on');
            // }
            if(!this.currentItem.length){
                this.currentItem = this.listContainer.children(".itemProgram").last();
                this.clone.currentItem = this.listContainer.children(".itemProgram").last();
            }

            this.setItemSelected(true);
            this.clone.setItemSelected(true);

            // this.listContainer.scrollTop(this.listContainer.scrollTop() + this.listContainer.height());
            this.scrollForMiddle();


            if(this.isActive){
                this.setFocused(true);
                if(this.currentItem.find('.desc').text() !== "")
                    this.currentItem.toggleClass('showDesc', true);
            }

            this.refreshProgressBar();
            this.updatePosterPrview();
            this.refreshTitle();
            if(playLive){
            	this.playLive();
            	this.clone.playLive()
            	Main.updateChannelNumber();
            }

            if(Main.changeLang){
                this.clone.changeLang();
                this.changeLang();
            }

        }else{
            return false;
        }
    }.bind(this));
};

TVPrograms.prototype.playLive = function () {
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

TVPrograms.prototype.okKeyHandler = function () {

    if(this.channelData.id !== this.programsData.item_id) {
        Main.currentChannel = this.channelData;

        Main.updateChannelNumber();
        Main.tv.checkChannel(this.channelData, function () {
            Main.popWidget();
            Player.playChannel(this.channelData.id);
        }.bind(this));
        return;
    }
    if(!this.currentItem.hasClass('on') ){
        if(!this.currentItem.hasClass('live') && !this.currentItem.hasClass('play'))
            return;
        // console.log(this.channelData);
        Main.prevChannel = Main.currentChannel;
        Main.currentChannel = this.channelData;
        Main.updateChannelNumber();

        Main.tv.checkChannel(this.channelData, function () {
            if(!Main.currentProgram){
                Main.currentProgram = this.programsData.program[this.indexCurrentItem];
            }
            if(this.programsData.item_id != this.clone.programsData.item_id){
                this.clone.channelData = this.channelData;
                this.clone.programsData = this.programsData;
                this.clone.indexCurrentItem = this.clone.indexRender =  this.indexCurrentItem;
                this.clone.currentItem = this.clone.listContainer.children("[data-id='"+Main.currentProgram.programm_id+"']");
                this.clone.render();
                this.clone.refreshTitle();
            }
            // this.clone.updateOnProgram();
            this.playCurrentProgram();
        }.bind(this) );
        Main.popWidget();
    }else{
        // Main.currentWidget.hide();
        //TODO переход в плеер
        Main.popWidget();
    }
};

TVPrograms.prototype.playCurrentProgram = function() {

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
    $(document).trigger("custom.updateChannelOn");
    Main.infoblock.show(currentItemProgram);
    if(notLiveProgram){
        Player.playChannel(this.channelData.id, currentItemProgram);
    }else if(this.currentItem.hasClass('live')){
        Player.playChannel(this.channelData.id, currentItemProgram);
        Main.currentProgram = currentItemProgram;
        // Player.playDVR(false, currentItemProgram, true);
    }else if(this.currentItem.hasClass('play')){
        Player.playDVR(this.channelData.id, currentItemProgram);
    }
    this.clone.updateOnProgram();

};

TVPrograms.prototype.setActive = function (active) {
    ListBase.prototype.setActive.apply(this, arguments);

    this.setItemSelected(true);
    if(active){
        if(this.currentItem.find('.desc').text() !== "")
            this.currentItem.toggleClass('showDesc', true);
        this.container.addClass("active");
        this.scrollForMiddle();
        this.setBrDirection('left', this.swipeRight, true);
        this.setBrDirection('left', this.swipeLeft, false);
    }else{
        this.currentItem.toggleClass('showDesc', false);
        this.container.removeClass("active");
    }
};

TVPrograms.prototype.downKeyHandler = function (){
    clearTimeout(this.timerShowDesc);
    this.currentItem.toggleClass('showDesc', false);

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
    this.timerShowDesc = setTimeout(function () {
        if(this.isActive){
            if(this.currentItem.find('.desc').text() !== "")
                this.currentItem.toggleClass('showDesc', true);
            this.updateListPosition();
        }

    }.bind(this), 600);
    this.refreshTitle();
    this.setItemSelected(true);
};

TVPrograms.prototype.upKeyHandler = function (){
    clearTimeout(this.timerShowDesc);
    this.currentItem.toggleClass('showDesc', false);
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
    this.timerShowDesc = setTimeout(function () {
        if(this.isActive){
            if(this.currentItem.find('.desc').text() !== "")
                this.currentItem.toggleClass('showDesc', true);

        }
    }.bind(this), 600);
    this.refreshTitle();
    this.setItemSelected(true);
    // console.log(this.indexCurrentItem)
};

TVPrograms.prototype.scrollForMiddle = function () {

    if(this.currentItem.length == 0)
        return;
    var wrapperScrollTop = this.listContainer.scrollTop();
    var itemTop = this.currentItem.position().top + wrapperScrollTop;
    var itemTopWithHeight = itemTop + ($('.itemProgram').height()*6 + 10);
    var wrapperH = this.listContainer.height();
    var wrapper = wrapperScrollTop + wrapperH;
    var delta = (itemTopWithHeight - wrapper);
    this.listContainer.scrollTop(wrapperScrollTop + delta);
};

TVPrograms.prototype.refreshTitle = function () {
    var timeDay, timeMonth, item;
    this.startClock();
    this.titleLogo.html('<img src="'+this.programsData.channelIcon+'" alt="">');
    if(this.currentItem.data('id') !== 0){
        // item = getItemByProgramId(this.programsData.program, this.currentItem.data('id'));
        item = this.programsData.program[this.indexCurrentItem];
        // console.log(item)
        var time = moment.unix(item.start);
        if(moment(moment().format('YYYY-MM-DD')).isSame(time.format('YYYY-MM-DD'), 'day'))
            timeDay = ''+LocaleManager.tr("today")+' ' + time.format(" D ");
        else
            timeDay = time.format("dddd,  D");
        timeMonth = time.format("MMMM");
    }else{
        timeDay = ''+LocaleManager.tr("today")+' ' + moment().format(" D ");
        timeMonth = moment().format("MMMM");
    }
    this.titleTime.html('<span>'+timeDay +' </span>' + timeMonth);
};

TVPrograms.prototype.startClock = function() {
    var timeNow = moment();
    var time = timeNow.format('HH:mm');
    this.titleClock.text(time);
    if(!this.timeid)
        this.timeid = setTimeout(function() {this.startClock()}.bind(this),1000);
};


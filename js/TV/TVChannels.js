/**
 * Created by vitalii on 22.12.17.
 */
function TVChannels() {
    ListBase.call(this, $("#channel"));
    this.swipeRight = $('#br2');
    this.swipeLeft = $('#br1');
    this.categoryWidget = null;
    this.programsWidget = null;
    this.createWidget();
    this.timer = null;
    this.intervalRefreshChannels = null;

    this.timerLoadprogram = null;

    this.indexCurrentItem = 0;
    this.indexRender  = 0;
    this.countItemRender  = 10;
    $(document).on("custom.nextChannel", function() {this.nextChannel()}.bind(this));
    $(document).on("custom.prevChannel", function() {this.nextChannel()}.bind(this));
    $(document).on("custom.updateChannelOn", function() {this.updateChannelOn()}.bind(this));
    $(document).on('custom.changeLang', function () {this.createWidget()}.bind(this));
}
TVChannels.prototype = Object.create(ListBase.prototype);
TVChannels.prototype.constructor = TVChannels;

TVChannels.prototype.checkCurrentNextThree = function (channel) {
    var currentProgram;


    if(channel.nextThree &&  channel.nextThree.length == 0){

        return null;
    }
    var now = moment().unix();
    // console.log(channel)
    // console.log(channel.nextThree)
    $.each(channel.nextThree, function (i, item) {

        if(item.start <= now && now <= item.stop){

            currentProgram = item;
        }
    });
    if(currentProgram)
        return currentProgram;
    else
        return null;
};

TVChannels.prototype.render = function () {

    var tempStr = '';
    var genr = -1;
    var currentNextThree;
    var start = this.indexRender - this.countItemRender;
    if(start < 0)
        start = 0;
    var stop = this.indexRender + this.countItemRender;
    if(stop >= Main.channels.length)
        stop = Main.channels.length-1;

    for( var j = start; j <= stop; j++){
        var item = Main.channels[j];
        var i = j+1;
        if (genr != item.genres[0]) {
            genr = item.genres[0];
            tempStr += '<li class="itemChannel br hr" id="category_id_' + item.genres[0] + '"><span>' + item.genre + '</span></li>';
        }
        tempStr += '<li class="itemChannel " data-id="' + item.id + '" data-category_id="'+item.genres[0]+'">';
                                                                                                             //<img src="' + item.channelIcon + '" alt="">     style="background-image: url(' + item.channelIcon + '); background-size: contain; background-position: center center"
        var num = (i / 10 < 10) ? (i / 10 >= 1 ? '0' + i : '00' + i) : i;
        tempStr += '<span class="numChannel">'+ num +'</span><span class="channelIcon" > <img src="' + item.channelIcon + '" alt=""> </span><span class="channelInfo"><i>';
        tempStr +=    item && item.title.length > 24  ? subStr(item.title , 21) : item.title ;
        tempStr +=   '</i><br>';
        currentNextThree = this.checkCurrentNextThree(item);
        // tempStr += item.nextThree.length != 0 && item.nextThree[0].name.length > 21 ? '<i>' + subStr(item.nextThree[0].name, 21) + '</i>' : item.nextThree.length != 0 ? '<i>' + item.nextThree[0].name + '</i>' : '<i></i>';
        tempStr += currentNextThree && currentNextThree.name.length > 29 ? '<i>' + subStr(currentNextThree.name, 27) + '</i>' : currentNextThree ? '<i>' + currentNextThree.name + '</i>' : '<i></i>';
        tempStr += '</span><span class="itemChannel_icon';

        tempStr += !item.is_free ? ' noFree' : (item.channel_parental_protect ? ' parControl' : ' ');

        tempStr += '"></span>';

        tempStr += '</li>';
    }

    this.listContainer.html(tempStr);



    console.log(this.indexCurrentItem);
    this.currentItem = this.listContainer.find('.itemChannel[data-id='+ Main.channels[this.indexCurrentItem].id +']');
    console.log(this.currentItem);
    if(Main.currentChannel)
        this.listContainer.find('[data-id='+Main.currentChannel.id+']').addClass('on');


    if(this.isActive)
        this.setFocused(true);
    else
        this.setItemSelected(true);
};

TVChannels.prototype.createWidget = function () {
    this.container.html('<div class="titleChannels">\n' +
        '  <div class="text titleDate" ></div></div>\n' +
        '<ul class="wrapper"></ul>');
    this.listContainer = this.container.find('ul');
    this.titleChannel = $("#channel .titleChannels .titleDate");
    var tempStr = '';

    Main.getChannelList(function () {
        debugger
        // var tempStr = '';
        // var genr = -1;
        // Main.channels.forEach(function (item, i) {
        //     var num;
        //     i++;
        //     if (genr != item.genres[0]) {
        //         genr = item.genres[0];
        //         tempStr += '<li class="itemChannel br hr" id="category_id_' + item.genres[0] + '"><span>' + item.genre + '</span></li>';
        //     }
        //
        //     tempStr += '<li class="itemChannel " data-id="' + item.id + '">';
        //     if(  i > this.indexRender - this.countItemRender &&  i < this.indexRender + this.countItemRender  ){
        //         num = (i / 10 < 10) ? (i / 10 >= 1 ? '0' + i : '00' + i) : i;
        //         tempStr += '<span class="numChannel">'+ num +'</span><span class="channelIcon"><img src="' + item.channelIcon + '" alt=""></span><span class="channelInfo"><i>' + item.title + '</i><br>';
        //         tempStr += item.nextThree.length != 0 && item.nextThree[0].name.length > 21 ? '<i>' + subStr(item.nextThree[0].name, 21) + '</i>' : item.nextThree.length != 0 ? '<i>' + item.nextThree[0].name + '</i>' : '<i></i>';
        //         tempStr += '</span><span class="itemChannel_icon';
        //         tempStr += !item.is_free ? ' noFree' : (item.channel_parental_protect ? ' parControl' : ' ');
        //         tempStr += '"></span>';
        //     }
        //     tempStr += '</li>';
        // }.bind(this));

        // var start = this.indexRender - this.countItemRender;
        // if(start < 0)
        //     start =0;
        // var stop = this.indexRender + this.countItemRender;
        // for( var j = start; j < stop; j++){
        //     var item = Main.channels[j];
        //     var i = j+1;
        //     if (genr != item.genres[0]) {
        //         genr = item.genres[0];
        //         tempStr += '<li class="itemChannel br hr" id="category_id_' + item.genres[0] + '"><span>' + item.genre + '</span></li>';
        //     }
        //     tempStr += '<li class="itemChannel " data-id="' + item.id + '">';
        //     var num = (i / 10 < 10) ? (i / 10 >= 1 ? '0' + i : '00' + i) : i;
        //     tempStr += '<span class="numChannel">'+ num +'</span><span class="channelIcon"><img src="' + item.channelIcon + '" alt=""></span><span class="channelInfo"><i>' + item.title + '</i><br>';
        //     tempStr += item.nextThree.length != 0 && item.nextThree[0].name.length > 21 ? '<i>' + subStr(item.nextThree[0].name, 21) + '</i>' : item.nextThree.length != 0 ? '<i>' + item.nextThree[0].name + '</i>' : '<i></i>';
        //     tempStr += '</span><span class="itemChannel_icon';
        //
        //     tempStr += !item.is_free ? ' noFree' : (item.channel_parental_protect ? ' parControl' : ' ');
        //
        //     tempStr += '"></span>';
        //
        //     tempStr += '</li>';
        // }

        // Main.channels.forEach(function (item, i) {
        //     var num;
        //     i++;
        //     if (genr != item.genres[0]) {
        //         genr = item.genres[0];
        //         tempStr += '<li class="itemChannel br hr" id="category_id_' + item.genres[0] + '"><span>' + item.genre + '</span></li>';
        //     }
        //
        //     tempStr += '<li class="itemChannel " data-id="' + item.id + '">';
        //     if(  i > this.indexRender - this.countItemRender &&  i < this.indexRender + this.countItemRender  ){
        //         num = (i / 10 < 10) ? (i / 10 >= 1 ? '0' + i : '00' + i) : i;
        //         tempStr += '<span class="numChannel">'+ num +'</span><span class="channelIcon"><img src="' + item.channelIcon + '" alt=""></span><span class="channelInfo"><i>' + item.title + '</i><br>';
        //         tempStr += item.nextThree.length != 0 && item.nextThree[0].name.length > 21 ? '<i>' + subStr(item.nextThree[0].name, 21) + '</i>' : item.nextThree.length != 0 ? '<i>' + item.nextThree[0].name + '</i>' : '<i></i>';
        //         tempStr += '</span><span class="itemChannel_icon';
        //
        //         tempStr += !item.is_free ? ' noFree' : (item.channel_parental_protect ? ' parControl' : ' ');
        //
        //         tempStr += '"></span>';
        //     }
        //     tempStr += '</li>';
        // }.bind(this));
        // ;
        // this.listContainer.html(tempStr);
        // this.currentItem = this.listContainer.find('.itemChannel:not(.br)').first();

        this.indexCurrentItem = this.indexRender = Main.channelNumber;
        this.render();

        this.programsWidget.loadDataForChannelId(this.currentItem.data("id"));

        var channelData = getItemById(Main.channels, this.currentItem.data("id"));
        this.categoryWidget.selectCategoryWithId(channelData.genres[0]);

        this.scrollForMiddle();

        // this.currentItem = this.listContainer.find('.itemChannel[data-id='+ Main.channels[this.indexCurrentItem].id +']');
        // this.updateListPosition();
        // if(this.isActive)
        //     this.setFocused(true);
        // else
        //     this.setItemSelected(true);
        this.refreshTitle();
        this.refreshChannels();
    }.bind(this));
};

TVChannels.prototype.refreshChannels = function() {
    clearInterval(this.intervalRefreshChannels);
    this.intervalRefreshChannels = setInterval(function () {
        Main.getChannelList(function () {
            this.render();
        }.bind(this));
    }.bind(this), 600000);
};

TVChannels.prototype.setActive = function (active) {
    ListBase.prototype.setActive.apply(this, arguments);
    // console.log(this.currentItem);

    this.setItemSelected(true);
    if (active) {
        this.container.addClass("active");
        this.setBrDirection('right', this.swipeRight, true);
        this.setBrDirection('left', this.swipeLeft, true);
        this.scrollForMiddle();
        this.programsWidget.loadDataForChannelId(this.currentItem.data("id"));
    } else{
        this.container.removeClass("active");
    }
};

TVChannels.prototype.downKeyHandler = function () {
    clearTimeout(this.timer);
    if(this.indexCurrentItem < Main.channels.length - 1){
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
    this.refreshTitle();
    this.setItemSelected(true);

    clearTimeout(this.timerLoadprogram);
    this.timerLoadprogram = setTimeout(function () {
        var channelData = Main.channels[this.indexCurrentItem] ;
        this.programsWidget.loadDataForChannelId(channelData);
        this.categoryWidget.selectCategoryWithId(channelData.genres[0]);
    }.bind(this), 300);

};


TVChannels.prototype.upKeyHandler = function () {

    clearTimeout(this.timer);
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
        this.indexCurrentItem = Main.channels.length - 1;
        this.indexRender = this.indexCurrentItem;
        this.render();
        this.listContainer.scrollTop(this.listContainer.scrollTop() + this.listContainer.height());
        this.updateListPosition();
    }
    this.refreshTitle();
    this.setItemSelected(true);

    clearTimeout(this.timerLoadprogram);
    this.timerLoadprogram = setTimeout(function () {
        var channelData = Main.channels[this.indexCurrentItem] ;
        this.programsWidget.loadDataForChannelId(channelData);
        this.categoryWidget.selectCategoryWithId(channelData.genres[0]);
    }.bind(this), 300);

};

TVChannels.prototype.rightKeyHandler = function () {
    clearTimeout(this.timerLoadprogram);
    var channelData = getItemById(Main.channels, this.currentItem.data("id"));
    this.programsWidget.loadDataForChannelId(channelData);
};

TVChannels.prototype.downKeyHandlerUp = function () {
	// clearTimeout(this.timer);
	// this.timer = setTimeout(function() {
	// 	// var channelData = getItemById(Main.channels, this.currentItem.data("id"));
	// 	var channelData = Main.channels[this.indexCurrentItem] ;
	// 	// this.programsWidget.loadDataForChannelId(channelData);
	//     this.categoryWidget.selectCategoryWithId(channelData.genres[0]);
	// }.bind(this), 50);
};

TVChannels.prototype.upKeyHandlerUp = function () {
	// clearTimeout(this.timer);
	// this.timer = setTimeout(function() {
	// 	// var channelData = getItemById(Main.channels, this.currentItem.data("id"));
    //     var channelData = Main.channels[this.indexCurrentItem] ;
	// 	// this.programsWidget.loadDataForChannelId(channelData);
	//     this.categoryWidget.selectCategoryWithId(channelData.genres[0]);
	// }.bind(this), 50);
};
TVChannels.prototype.nextChannel = function () {
	this.currentItem = this.listContainer.find('[data-id='+Main.currentChannel.id+']');
	this.setItemSelected(true);
	this.programsWidget.loadDataForChannelId(Main.currentChannel.id, true);

};
//TVChannels.prototype.prevChannel = function () {
//    this.currentItem = this.listContainer.find('[data-id='+Main.currentChannel.id+']');
//    if(this.currentItem.prev().hasClass("br") ){
//        this.currentItem = this.currentItem.prev();
//        if(!this.currentItem.prev().length )
//            this.currentItem = this.listContainer.find('.itemChannel:not(.br)').last();
//        else
//            this.currentItem = this.currentItem.prev();
//    }else{
//        this.currentItem = this.currentItem.prev();
//    }
//    this.okKeyHandler();
//};
TVChannels.prototype.okKeyHandler = function () {

    var channelData = getItemById(Main.channels, this.currentItem.data("id"));
    Main.currentChannel = channelData;

    Main.updateChannelNumber();
    Main.tv.checkChannel(channelData,function () {
        this.playCurrentChannel(channelData);
    }.bind(this) );

};
TVChannels.prototype.updateChannelOn = function () {
    
    for(var i = 0; i < Main.channels.length; i++){
        if(Main.channels[i].id === Main.currentChannel.id){
            this.indexCurrentItem = this.indexRender = i;
            break;
        }
    }
    this.render();
    // this.listContainer.find('.on').removeClass('on');
    this.currentItem = this.listContainer.find('[data-id='+Main.currentChannel.id+']');
    this.currentItem.addClass('on');
};
TVChannels.prototype.playCurrentChannel = function (channelData) {
    // this.setActive(false);
    // this.setFocused(false);

    Main.popWidget();
    clearTimeout(this.timer);

    var currentProgram = Player.currentNextThree(Main.currentChannel);
    Main.infoblock.show(currentProgram);
    this.updateChannelOn();
    this.programsWidget.loadDataForChannelId(channelData, true);
    Player.playChannel(this.currentItem.data("id"));
};

TVChannels.prototype.scrollToCategoryWithId = function (categoryId) {
    // clearTimeout(this.timer2);
    for(var i = 0; i < Main.channels.length; i++){
        if(Main.channels[i].genres[0] == categoryId){

            this.indexCurrentItem = this.indexRender = i;
            break;
        }
    }
    // this.indexCurrentItem = this.indexRender;
    this.render();


    var header =  this.listContainer.children("#category_id_"+categoryId);
    // var itemTop = header.position().top + this.listContainer.scrollTop();
    // this.listContainer.scrollTop(itemTop);
    this.currentItem = header.next();
    this.setItemSelected(true);
    this.scrollForMiddle();
    if(this.isActive)
        this.programsWidget.loadDataForChannelId(this.currentItem.data("id"));
    this.refreshTitle();

	// this.timer2 = setTimeout(function() {
	// 	this.programsWidget.loadDataForChannelId(this.currentItem.data("id"));
	// }.bind(this), 600);
};

TVChannels.prototype.scrollForMiddle = function () {

    if(this.currentItem.length == 0)
        return;
    var wrapperScrollTop = this.listContainer.scrollTop();
    var itemTop = this.currentItem.position().top + wrapperScrollTop;
    var itemTopWithHeight = itemTop + ($('.itemChannel').height()*5 + 15);
    var wrapperH = this.listContainer.height();
    var wrapper = wrapperScrollTop + wrapperH;
    var delta = (itemTopWithHeight - wrapper);
    this.listContainer.scrollTop(wrapperScrollTop + delta);
};

TVChannels.prototype.refreshTitle = function () {
    var category = getItemById(Main.channelsCategories, this.currentItem.data("category_id"));
    this.titleChannel.html(category.name);

};
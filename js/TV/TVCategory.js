/**
 * Created by vitalii on 21.12.17.
 */
function TVCategories() {
    ListBase.call(this, $("#category"));
    this.leftBr  = $('#br1');
    this.rightBr = $('#br2');
    this.transform = $(".transform");
    this.channelWidget = null;
    this.programsWidget = null;
    this.timer = null;
    this.createWidget();
    $(document).on('custom.changeLang', function () {this.createWidget()}.bind(this));
}
TVCategories.prototype = Object.create(ListBase.prototype);
TVCategories.prototype.constructor = TVCategories;

TVCategories.prototype.createWidget = function () {
    this.container.addClass('transform noActive');
    this.container.html('<ul class="wrapper"></ul>');
    this.listContainer =  this.container.find('ul');

    Main.getChannelList(function () {

        return;
        var tempStr = '';
        Main.channelsCategories.forEach(function (item, i){
            tempStr += '<li class="itemCategory" data-id="'+item.id+'"><em><span><img src="img/genr/'+item.id+'.png" alt=""></span><span class="catName">'+item.name+'</span></em></li>';
        });
        this.listContainer.html(tempStr);
//        console.log(this.listContainer.find('.itemCategory:first'));

        // this.setFocused(true, this.listContainer.find('.itemCategory:first'));
    }.bind(this));
};
TVCategories.prototype.setActive = function (active) {
    ListBase.prototype.setActive.apply(this, arguments);
    this.setItemSelected(true);

    if(active){
        this.setBrDirection('right', this.leftBr, true);
        this.setBrDirection('right', this.rightBr, false);
//        this.listContainer.find('.itemCategory .catName').fadeIn();
        this.container.removeClass("transform").toggleClass('noActive', false).addClass("active")
//        this.programsWidget.container.fadeOut();

    // this.listContainer.animate({width: "602px"}, 500);
        // this.container.toggleClass('noActive', false).addClass("active")
        //     .find('.itemCategory .catName').hide(600);
        // this.container.find('.itemCategory').animate({width: "600px"}, 500);

        // this.container.animate({margin: "54px 0 0 210px"}, 500)
        // this.programsWidget.container.animate({"margin-left": "185px"}, 500);
    }else{

        this.container.addClass("transform")
            .toggleClass("active", false).addClass('noActive')
//        	.find('.itemCategory .catName').fadeOut();
//        this.programsWidget.container.fadeIn();
        // this.listContainer.animate({width: "125px"}, 500);
        // this.container.animate({margin: "54px 0 0 100px"}, 500);
        // this.container.find('.itemCategory').animate({width: "135px"}, 500);
        // this.container.find('.itemCategory .catName').fadeOut(600);
    }


    // if(active){
    //     this.setBrDirection('right', this.leftBr, true);
    //     this.setBrDirection('right', this.rightBr, false);
    //
    //     this.container.toggleClass('noActive', false).addClass("active")
    //     .find('.itemCategory .catName').fadeIn(600);
    //     this.container.find('.itemCategory').animate({width: "600px"}, 500);
    //
    //     this.container.animate({margin: "54px 0 0 210px"}, 500)
    //     this.programsWidget.container.animate({"margin-left": "185px"}, 500);
    // }else{
    //     this.container.toggleClass("active", false).addClass('noActive');
    //
    //     this.container.animate({margin: "54px 0 0 100px"}, 500);
    //     this.container.find('.itemCategory').animate({width: "135px"}, 500);
    //     this.container.find('.itemCategory .catName').fadeOut(600);
    // }
};
TVCategories.prototype.downKeyHandler = function (){
    ListBase.prototype.downKeyHandler.apply(this);
};

TVCategories.prototype.upKeyHandler = function (){
    ListBase.prototype.upKeyHandler.apply(this);
};


TVCategories.prototype.downKeyHandlerUp = function (){
	clearTimeout(this.timer);
	this.timer = setTimeout(function() {
		this.setItemSelected(true);
		this.channelWidget.scrollToCategoryWithId(this.currentItem.data("id"));
	}.bind(this), 600);
};

TVCategories.prototype.upKeyHandlerUp = function (){
	clearTimeout(this.timer);
	this.timer = setTimeout(function() {
		this.setItemSelected(true);
		this.channelWidget.scrollToCategoryWithId(this.currentItem.data("id"));
	}.bind(this), 600);
};

TVCategories.prototype.selectCategoryWithId = function (cat_id) {
	
    this.currentItem = this.listContainer.find('[data-id="'+ cat_id +'"]');
    this.setItemSelected(true);
    this.updateListPosition();
};
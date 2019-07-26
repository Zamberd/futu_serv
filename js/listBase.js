function ListBase(container){
    this.name = 'ListBase';
    this.isActive = false;
    this.isVisible = false;
    this.container = container;
    this.listContainer = this.container.find("ul");
    this.currentItem = this.listContainer.children('.focus');
    this.selectedItem = this.listContainer.children('.selected');
}

ListBase.prototype.downKeyHandler = function() {
	if (!this.currentItem || (this.currentItem && this.currentItem.length == 0))
		this.currentItem = this.listContainer.children('.focus');
	var nextitem = this.currentItem.next();
	if(nextitem.hasClass('hr'))
		nextitem = nextitem.next();
	this.currentItem.removeClass('focus');
	if(!nextitem.length)
		nextitem = this.listContainer.children().not(".hr").first();
	nextitem.addClass('focus');
	this.currentItem = nextitem;
	this.updateListPosition();
};

ListBase.prototype.upKeyHandler = function(){
	if (!this.currentItem || (this.currentItem && this.currentItem.length == 0))
		this.currentItem = this.listContainer.children('.focus');
	var previtem = this.currentItem.prev();
	if(previtem.hasClass('hr')){
		previtem = previtem.prev();
	}
	this.currentItem.removeClass('focus');
	
	if(!previtem.length)	
		previtem = this.listContainer.children().not(".hr").last();
	previtem.addClass('focus');
	this.currentItem = previtem;
	this.updateListPosition();
//	console.log(this.currentItem)
};

ListBase.prototype.downKeyHandlerUp = function() {
};

ListBase.prototype.upKeyHandlerUp = function() {
};

// ListBase.prototype.updateListPosition = function() {
// 	if (!this.currentItem || !this.currentItem.length)
// 		return;
//
// 	var wrapperScrollTop = this.listContainer.scrollTop();
//     var itemTop = this.currentItem.position().top + wrapperScrollTop;
//     var itemTopWithHeight = itemTop + this.currentItem.height() + parseInt(this.currentItem.css("padding-bottom"));
// 	var wrapperH = this.listContainer.height();
// 	var wrapper = wrapperScrollTop + wrapperH;
//
// 	// var correction = wrapperH % this.currentItem.height();
// 	var delta = (itemTopWithHeight - wrapper);
//
//     if(itemTopWithHeight > wrapperH && delta > 0) {
// 		this.listContainer.scrollTop(wrapperScrollTop + delta + 4); //4 - border
// 	} else if  (itemTop < wrapperScrollTop) {
// 		if (this.currentItem.prev().hasClass("list_header"))
// 			itemTop -= this.currentItem.prev().height();
//         this.listContainer.scrollTop(itemTop);
//     }
// };

ListBase.prototype.updateListPosition = function() {
    if (!this.currentItem || !this.currentItem.length)
        return;
    var itemHeight = this.currentItem.height();
    var wrapperScrollTop = this.listContainer.scrollTop();
    var itemTop = this.currentItem.position().top + wrapperScrollTop;
    var itemTopWithHeight = itemTop + this.currentItem.height() + parseInt(this.currentItem.css("padding-bottom"));
    var wrapperH = this.listContainer.height() - itemHeight;
    var wrapper = wrapperScrollTop + wrapperH;

    // var correction = wrapperH % this.currentItem.height();
    var delta = (itemTopWithHeight - wrapper);

    if(itemTopWithHeight > wrapperH && delta > 0) {
        this.listContainer.scrollTop(wrapperScrollTop + delta + 3); //4 - border
    } else if  (itemTop - itemHeight < wrapperScrollTop ) {
        if (this.currentItem.prev().hasClass("list_header"))
            itemTop -= this.currentItem.prev().height();
        this.listContainer.scrollTop(itemTop - itemHeight);
    }
};

ListBase.prototype.rightKeyHandler = function() {
};

ListBase.prototype.okKeyHandler = function() {
    // this.rightKeyHandler();
};

ListBase.prototype.show = function(){
    this.isVisible = true;
    this.container.show();
};

ListBase.prototype.hide = function(){
    this.isVisible = false;
    this.container.hide();
};

ListBase.prototype.setItemSelected = function(selected, item){
    this.listContainer.children().removeClass("selected");
  	if (selected) {
		this.selectedItem = item || this.currentItem;
		this.selectedItem.addClass("selected");
  	} else {
  		this.selectedItem = null;
  	}
};


ListBase.prototype.setFocused = function(focused, item){
    this.listContainer.children().removeClass("focus");
  	if (focused) {
  		this.currentItem = item || (this.currentItem && this.currentItem.length ? this.currentItem : null) || (this.selectedItem && this.selectedItem.length ? this.selectedItem : null) || this.listContainer.children().not(".list_header").first();
		this.currentItem.addClass("focus");
  		this.updateListPosition();
  	}
};

ListBase.prototype.setActive = function(active){
  	this.isActive = active;
  	this.setFocused(active);
};
ListBase.prototype.setBrDirection = function (direction, el, active) {
	if(direction == false){
		el.toggleClass("brRight brLeft", false);
		return;
	}
	if(direction == "right")el.toggleClass('brLeft', false).addClass('brRight');
	if(direction == "left")el.toggleClass('brRight', false).addClass('brLeft');
	if(active)
		el.addClass('active');
	else
		el.removeClass('active');
};





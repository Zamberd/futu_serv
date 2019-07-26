function SLanguage() {
    this.name = 'language';
    ListBase.call(this, $("#language"));
//    this.leftBr  = $('#lang_br1');
//    this.rightBr = $('#lang_br2');
    this.isVisible = false;
    this.isActive = false;
    this.language = null;
//    console.log('language');
    $(document).on("custom.changeLang", function() {this.refresh()}.bind(this));
}
SLanguage.prototype = Object.create(ListBase.prototype);
SLanguage.prototype.constructor = SLanguage;
  
SLanguage.prototype.reset = function() {
    this.setActive(false);
    this.hide();
    this.language = null;
    this.isActive = false;
    this.isVisible = false;
};

SLanguage.prototype.refresh = function() {
	this.createWidget(true);
};

SLanguage.prototype.show = function() {
//	console.log('show')

	if(this.language == null)
		this.createWidget();
	else{
		this.isVisible = true;
		this.container.show();
	}
    $("#lang_br1").removeClass("brLeft").addClass("brRight").show();
};
SLanguage.prototype.hide = function() {
//	console.log('hide')
	
	if(this.language != null && this.container.is(":visible")){	
		this.container.hide();
		this.isVisible = false;
        $("#lang_br1").hide();
	}
};
SLanguage.prototype.okKeyHandler = function(){
	LocaleManager.changeLang(this.currentItem.data('id'));
};

SLanguage.prototype.createWidget = function(refresh) {
	var tmpList = "";
	LocaleManager.dict.langTitle.forEach(function (item, i){
		tmpList += '\
		<li class="itemCategory' + (LocaleManager.lang == i ? ' selected' : '') + ' " data-id="'+i+'">\
			<em><span class="iconSelectLang"></span><span class="catName">'+item+'</span></em>\
		</li>';
	});
	this.container.html('\
		<div class="content">\
			<ul class="wrapper">' + tmpList + '</ul>\
		</div>');
	tmpList = null;
	this.language = this.container;
	
	this.listContainer = this.container.find("ul");
	this.container.show();
	this.isVisible = true;
	this.currentItem = this.listContainer.find('.selected');
	if(refresh)
		this.setFocused(true, this.currentItem);
};

SLanguage.prototype.setActive = function(active){
    this.container.toggleClass("active", active);
    this.isActive = active;
    $("#lang_br1").toggleClass("brRight brLeft");
    if (!active) {
        this.setFocused(false);
        this.currentItem = this.listContainer.find('.selected');
    }
    ListBase.prototype.setActive.apply(this, arguments);
}
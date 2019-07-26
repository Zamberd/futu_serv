Keyboard = {
	container:null,
	isActive: false,
	currentItem: null,
	callbackHandler: null,
	index: 0,
	init: function(){			
		this.container = $("#keyboard");
		if (this.container.length == 0)
			this.container = $('<div id="keyboard" class="keyboard" />').appendTo('body');
		this.isActive = false;
		
		this.create();
		this.currentItem = null;
	},
 
	show: function (callbackHandler) {
		this.callbackHandler = callbackHandler;
		this.isActive = true;
		
		this.container.show();
		this.currentItem = this.container.find('.current');
		if(this.currentItem.length == 0){			
			this.currentItem = this.container.find('.key').first();
			this.currentItem.addClass('current');
		}
	},
	
	hide: function () {
		this.isActive = false;
		this.container.hide();
	},
	create: function() {
		var html = '';
		html += '<div class="keys">\
					<div class="key" data-id="1"><span>1</span></div>\
					<div class="key" data-id="2"><span>2</span></div>\
					<div class="key" data-id="3"><span>3</span></div>\
					<div class="key" data-id="4"><span>4</span></div>\
					<div class="key" data-id="5"><span>5</span></div>\
					<div class="key backspace" data-id="backspace"><span>&nbsp;</span></div>\
					<div class="key" data-id="6"><span>6</span></div>\
					<div class="key" data-id="7"><span>7</span></div>\
					<div class="key" data-id="8"><span>8</span></div>\
					<div class="key" data-id="9"><span>9</span></div>\
					<div class="key" data-id="0"><span>0</span></div>\
					<div class="key cancel" data-id="cancel" ><span>' + LocaleManager.tr('cancel') + '</span></div>\
				</div>';
		this.container.html(html);
		html = null;
	},
	okKeyHandler: function () {
        this.callbackHandler(this.currentItem.data("id"))
		// this.currentItem.click();
	},
	pressKeyHandler: function(num){
		this.callbackHandler(num)
//		this.currentItem.click();
	},
	leftKeyHandler: function () {
		
		if (this.currentItem.prev().length > 0) {
			this.currentItem.removeClass('current');
			this.currentItem = this.currentItem.prev();
			this.currentItem.addClass('current');
			this.index--;
		}else{
			this.currentItem.removeClass('current');
			this.currentItem = this.container.find('.key').last();
			this.currentItem.addClass('current');
			this.index = this.container.find('.key').length-1;
		}
		
	},
	
	rightKeyHandler: function () {
		if (this.currentItem.next().length > 0) {
			this.currentItem.removeClass('current');
			this.currentItem = this.currentItem.next();
			this.currentItem.addClass('current');
			this.index++;
		}else{
			this.currentItem.removeClass('current');
			this.currentItem = this.container.find('.key').first();
			this.currentItem.addClass('current');
			this.index = 0;
		}

	},
	downKeyHandler: function () {
		
		this.currentItem.removeClass('current');
		if(this.index+6 < this.container.find('.key').length){
			this.index = this.index+6;
		}else{
			this.index = this.index-6;
		}
		this.currentItem = this.container.find('.key').eq(this.index);
		this.currentItem.addClass('current');
	},
	upKeyHandler: function () {
		
		this.currentItem.removeClass('current');
		if(this.index-6 >= 0){
			this.index = this.index-6;
		}else{
			this.index = this.index+6;
		}
		this.currentItem = this.container.find('.key').eq(this.index);
		this.currentItem.addClass('current');
	},
	
}
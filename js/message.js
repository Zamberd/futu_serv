Message = function () {
	this.container = $('<div class="message" />').appendTo('body');
	this.isActive = false;
	this.currentItem = null;
    this.isVisible = false;
}

Message.prototype = {
	container:null,
	isActive: false,
    isVisible: false,
    currentItem: null,
	param: null,

	setActive: function(active){
        this.isActive = active;
    },

	show: function (param) {
		this.isActive = true;
        this.isVisible = true;
		this.container.show();
		if (param) {
			this.param = param;
			this.updateContent();
			this.initNav();
		}
	},

	hide: function () {
		this.isActive = false;
        this.isVisible = false;
		this.container.hide();
	},

	reset: function () {
		this.currentItem = null;
		$('#cancel_btn',this.container).off('click');
		$('#update_btn',this.container).off('click');
		$('#ok_btn',this.container).off('click');
		this.container.html('');
	},

	updateContent: function () {
		var html = '';
		this.param.type = this.param.type || 'text'; 
		switch (this.param.type)	{
            case 'pause':
                html += '<div class="buttons">\
					<div id="cancel_btn" class="btn cancel_btn"><span>Продолжить</span></div>\
					<div id="ok_btn" class="btn ok_btn"><span>'+LocaleManager.tr('onAir')+'</span></div>\
				</div>';
                break;


 

			case 'disconnected':	
				html += '<div class="messageTitle">'+LocaleManager.tr('warning')+'</div>\
					<div class="messageDescr">'+LocaleManager.tr('disconnected')+'</div>\
					<div class="buttons one_btns">\
						<div id="update_btn" class="btn ok_btn"><span>Обновить</span></div>\
						<div id="ok_btn" class="btn ok_btn"><span>'+LocaleManager.tr('ok')+'</span></div>\
					</div>';
			break;
			case 'setPassword':	
				html += '<div class="messageTitle">'+LocaleManager.tr('warning')+'</div>\
				<div class="messageDescr">'+LocaleManager.tr('newKeySave')+'</div>\
				<div class="buttons one_btns">\
					<div id="ok_btn" class="btn ok_btn"><span>'+LocaleManager.tr('ok')+'</span></div>\
				</div>';
			break;
			case 'authError':	
				html += '<div class="messageTitle">'+LocaleManager.tr('warning')+'</div>\
				<div class="messageDescr">'+LocaleManager.tr('messageauthError')+'</div>\
				<div class="buttons one_btns">\
					<div id="ok_btn" class="btn ok_btn"><span>'+LocaleManager.tr('ok')+'</span></div>\
				</div>';
			break;
			case 'notSetPassword':
				html += '<div class="messageTitle">'+LocaleManager.tr('warning')+'</div>\
				<div class="messageDescr">'+LocaleManager.tr('notSetPassword')+'</div>\
				<div class="buttons one_btns">\
					<div id="ok_btn" class="btn ok_btn"><span>'+LocaleManager.tr('ok')+'</span></div>\
				</div>';
			break;
			case 'noFree':
				html += '<div class="messageTitle">'+LocaleManager.tr('dearUser')+'</div>\
				<div class="messageDescr">'+LocaleManager.tr('upsellMessage1')+this.param.subs.name + LocaleManager.tr('upsellMessage2') + this.param.subs.price + LocaleManager.tr('upsellMessage3')+'</div>\
				<div class="buttons one_btns">\
					<div id="ok_btn" class="btn ok_btn"><span>'+LocaleManager.tr('ok')+'</span></div>\
				</div>';
			break;
			case 'limiteTimePause':
				html += '<div class="messageTitle">'+LocaleManager.tr('warning')+'</div>\
				<div class="messageDescr">'+LocaleManager.tr('limiteTimePause')+'</div>\
				<div class="buttons one_btns">\
					<div id="ok_btn" class="btn ok_btn"><span>'+LocaleManager.tr('onAir')+'</span></div>\
				</div>';
			break;
			case 'errorPlayDVR':
				html += '<div class="messageTitle">'+LocaleManager.tr('warning')+'</div>\
				<div class="messageDescr">'+LocaleManager.tr('errorPlayDVR')+'</div>\
				<div class="buttons one_btns">\
					<div id="ok_btn" class="btn ok_btn"><span>'+LocaleManager.tr('onAir')+'</span></div>\
					<div id="cancel_btn" class="btn cancel_btn"><span>'+LocaleManager.tr('cancel')+'</span></div>\
				</div>';
			break;
			case 'exitPopup':
				html += '<div class="messageDescr">'+LocaleManager.tr('exitApp')+'</div>\
				<div class="buttons one_btns">\
					<div id="ok_btn" class="btn ok_btn"><span>'+LocaleManager.tr('yes')+'</span></div>\
					<div id="cancel_btn" class="btn cancel_btn"><span>'+LocaleManager.tr('cancel')+'</span></div>\
				</div>';
			break;
			case 'errorPlay':
				html += '<div class="messageDescr">'+LocaleManager.tr('errorPlay')+'</div>\
				<div class="buttons one_btns">\
					<div id="ok_btn" class="btn ok_btn"><span>'+LocaleManager.tr('ok')+'</span></div>\
				</div>';
			break;
			case 'unBindDevice':
                html += '<div class="messageTitle">'+LocaleManager.tr('warning')+'</div>\
					<div class="messageDescr">'+LocaleManager.tr('unBindDevice')+'</div>\
					<div class="buttons two_btns">\
						<div id="cancel_btn" class="btn cancel_btn"><span>'+LocaleManager.tr('cancel')+'</span></div>\
						<div id="ok_btn" class="btn ok_btn"><span>'+LocaleManager.tr('unBind')+'</span></div>\
					</div>';
                break;

		}			
		this.container.addClass(this.param.type).html(html);
	},
	
	initNav: function () {
		this.currentItem = $('#ok_btn',this.container);
		if (!this.currentItem.length)
			this.currentItem = $('.buttons .btn',this.container).first();
		this.currentItem.addClass('current');	
		var self = this;
		$('#cancel_btn',this.container).on('click',function(e){
			this.hide();
			if (this.param.onCancel)
				this.param.onCancel();
			this.param = null;
			return true;
		}.bind(this));
		$('#ok_btn',this.container).on('click',function(e){
			this.hide();
			this.param.onSuccess();
			this.param = null;
			return true;
		}.bind(this));
		$('#update_btn',this.container).on('click',function(e){
			e.preventDefault();
			if (self.param.onUpdate)
				self.param.onUpdate();
			return true;
		});
	},

	leftKeyHandler: function () {
		if (this.currentItem.prev().length > 0) {
			this.currentItem.removeClass('current');
			this.currentItem = this.currentItem.prev();
			this.currentItem.addClass('current');
            return true;
		}
		return false;
	},

	rightKeyHandler: function () {
		if (this.currentItem.next().length > 0) {
			this.currentItem.removeClass('current');
			this.currentItem = this.currentItem.next();
			this.currentItem.addClass('current');
            return true;
		}
        return false;
	},

	okKeyHandler: function () {
		this.currentItem.click();
	}

}
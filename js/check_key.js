CheckKey = {
	container:null,
	isActive: false,
    isVisible: false,
	currentItem: null,
	param: null,
	key: null,
	new_password: null,
	old_password: null,
    successCallback: null,
	cancelCallback: null,
	type: null,
	errorTimer: null,
	 
	init: function(){			
		this.container = $("#check_key");
		if (this.container.length == 0)
			this.container = $('<div id="check_key" class="check_key" />').appendTo('body');
		this.setActive(false);
		this.currentItem = null;
		this.key = null;
	},

    setActive: function(active){
        this.isActive = active;
    },

	show: function (param) {
		this.isActive = true;
        this.isVisible = true;

		this.container.show();
		if (param) {
            if (typeof param.type == 'function') {
                this.cancelCallback = param.type;
                this.type = 0;
            } else {
                this.cancelCallback = param.cancelCallback;
                this.type = param.type;
            }
            this.successCallback = param.successCallback;
        }
		this.initNav();
		Keyboard.show(function(val){ this.inputText(val) }.bind(this));
	},
	
	hide: function () {
		this.isActive = false;
        this.isVisible = false;
		this.container.hide();
		Keyboard.hide();
        this.reset();
	},

	reset: function () {
		this.currentItem = null;
		this.key = null;
        this.clearTimer();
        this.container.removeClass('error errorMessage');
	},

	initNav: function () {
		this.type = this.type || 0;
		this.updateContent();
		this.currentItem = this.container.find('.input').first();
		this.currentItem.addClass('current s');
		this.focusInput();
	},

	inputText: function (num){
        this.clearTimer();
        this.container.removeClass('errorMessage');

		if(num == 'backspace'){
            this.currentItem.find('input').attr('value', "")
            if (this.currentItem.prev().length > 0) {
                this.currentItem.removeClass('current s');
                this.currentItem = this.currentItem.prev();
                this.currentItem.addClass('current s');
            }
            this.currentItem.find('input').attr('value',"")
            return;
		}
		if(num == 'cancel'){
            if(this.cancelCallback)
                this.cancelCallback();
            Main.popWidget();
            return;
		}
        this.currentItem.find('input').attr('value', num);
        if (this.currentItem.next().length > 0) {
            this.currentItem.removeClass('current s');
            this.currentItem = this.currentItem.next();
            this.currentItem.addClass('current s');
            this.focusInput();
        } else {
            if(this.container.find('input[value=""]').length != 0){
                this.currentItem.removeClass('current s');
                this.currentItem = this.container.find('div input[value=""]').first()
                this.currentItem.addClass('current s');
                this.focusInput();
            }
            if(this.container.find('input[value=""]').length == 0){
                this.checkKey()
                Keyboard.hide();
            }
        }
	},

	clearTimer: function () {
        if (this.errorTimer) {
            clearTimeout(this.errorTimer);
            this.errorTimer = null;
        }
	},

	checkKey: function () {
		var key = this.getKey();
		LoadBar.show();
		switch (this.type) {
			case 1:
				apiService.get("checkKey", {password: key}, function(data) {
					if(data.status === "ok"){
						this.old_password = key;
						this.type = 2;
						this.initNav();
					}else{
						this.container.addClass('error errorMessage');
						setTimeout(function(){this.container.removeClass('error');}.bind(this), 1000);
                        this.clearTimer();
						this.errorTimer = setTimeout(function(){this.container.removeClass('errorMessage');}.bind(this), 4000);
						this.initNav();
					}
					LoadBar.hide();
				}.bind(this));
				break;
			case 2:
				apiService.get("setKey", {new_password: key, old_password: this.old_password}, function(data) {
                    if(data.status === "ok"){
                        Main.popWidget();
                        Main.pushWidget("message",{
                            "type": 'setPassword',
                            "onSuccess": function(){
                                Main.popWidget();
                            }.bind(this)
                        });
					} else {
                        Main.pushWidget("message",{
                            "type": 'notSetPassword',
                            "onSuccess": function(){
                                Main.popWidget();
                            }.bind(this)
                        });
					}
                    LoadBar.hide();
				}.bind(this));
				break;
			default:
                apiService.get("checkKey", {password: key}, function(data) {
                    if (data.status === "ok") {
                        Main.popWidget();
                        this.successCallback(true);
                    } else {
                    	this.container.addClass('error errorMessage');
                        setTimeout(function(){this.container.removeClass('error');}.bind(this), 1000);
                        this.clearTimer();
                        this.errorTimer = setTimeout(function(){this.container.removeClass('errorMessage');}.bind(this), 4000);
                        this.initNav();
                    }
                    LoadBar.hide();
                }.bind(this));
			}
	},
	updateContent: function () {
		var html = '', title, subtitle;

        switch (this.type) {
            case 1:
            	title = LocaleManager.tr('changePass');
                subtitle = LocaleManager.tr('enterOldPass');
                break;
            case 2:
            	title = LocaleManager.tr('changePass');
                subtitle = LocaleManager.tr('enterNewPass');
                break;
            default:
            	title = LocaleManager.tr('enterPassTitle');
                subtitle = LocaleManager.tr('enterPass');
        }

		html += '<div class="popupTitle">' + title + '</div>\
				<div class="popupDescr">'+ subtitle +'</div>\
				<div class="inputList">\
					<div class="input "><input type="text"  name="" readonly="true" value=""></div>\
					<div class="input "><input type="text"  name="" readonly="true" value=""></div>\
					<div class="input "><input type="text"  name="" readonly="true" value=""></div>\
					<div class="input "><input type="text"  name="" readonly="true" value=""></div>\
				</div>\
				<div id="error">'+LocaleManager.tr('errorPass')+'</div>';
		this.container.html(html);
	},


    focusInput: function(){
        if(this.currentItem.find('input').length != 0){
            Keyboard.show(function(val){ this.inputText(val) }.bind(this));
            this.currentItem.find('input').attr('value', "")
        }
        else{
            Keyboard.hide();
        }
    },
    okKeyHandler: function () {
        if(Keyboard.isActive){
            Keyboard.okKeyHandler()
            return;
        }
        // this.currentItem.click();
    },
    leftKeyHandler: function () {
        if(Keyboard.isActive){
            Keyboard.leftKeyHandler()
            return;
        }
    },

    rightKeyHandler: function () {
        if(Keyboard.isActive){
            Keyboard.rightKeyHandler()
            return;
        }
    },
    downKeyHandler: function () {
        if(Keyboard.isActive){
            Keyboard.downKeyHandler()
            return;
        }
    },
    upKeyHandler: function () {
        if(Keyboard.isActive){
            Keyboard.upKeyHandler()
            return;
        }
    },
    getKey: function(){
        var str = "";
        if(this.container.find('input[value=""]').length != 0){
            return false;
        }
        this.container.find('input').each(function(i, item){
            str+=$(this).val();
        });
        return str;
    }

}

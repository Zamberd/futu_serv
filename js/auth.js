Auth = {
	container:null,
	isActive: false,
	isVisible: false,
	currentItem: null,
	userAuthorized: false,
	successCallback: null,
    cancelCallback: null,

	authInfo: {
		"account": 0,
		"userId": 0,
		"provider": "",
		"timestamp": 0,
        "email": null,
        "infoPlan": null
	},

	init: function(callback){
//        LoadBar.show();

		apiService.get("auth", function(obj){
			this.container = $("#auth");
			if (this.container.length == 0)
				this.container = $('<div id="auth" class="auth" />').appendTo('body');
			if(obj){
				$.extend(this.authInfo, {
					"account": obj.data.account,
					"userId": obj.data.userId,
					"provider": obj.data.provider,
					"timestamp": obj.data.timestamp
				});

				if(this.authInfo.userId == 0){
                    SplashScreen.hide();
                    this.userAuthorized = false;
					Main.pushWidget("auth", {
					    successCallback: function(){
                            callback();
                        },
                        cancelCallback: function(){
						    callback();
					    }
					});
				} else {
                    this.userAuthorized = true;
					callback();
				}
			} else {
                SplashScreen.hide();
                Main.pushWidget('message', {
                    type: 'authError',
                    onSuccess: function(){
                    	// widgetAPI.sendExitEvent();
                        callback();// TODO exit app
                    }
                });
			}
//            LoadBar.hide();
		}.bind(this));

	},

	setActive: function(active){
		this.isActive = active;
	},

	show: function (params) {
		this.isActive = true;
		this.isVisible = true;
        this.successCallback = params.successCallback;
        this.cancelCallback = params.cancelCallback;
		this.container.show();
		this.initNav();
		Keyboard.show(function(val){ this.inputText(val) }.bind(this));
	},

	hide: function () {
		this.isActive = false;
		this.isVisible = false;
		this.container.hide();
		Keyboard.hide();
	},

	initNav: function () {
		var self = this;
		var html = ''; 
		html += '<div class="popupTitle">'+LocaleManager.tr('authTitle')+'</div>\
			<div class="popupDescr">'+LocaleManager.tr('authDescr')+'</div>\
			<div id="authInput" class="inputList">';
		for (var i=0; i<8;i++) {
			html += '<div class="input"><input type="text" name="" readonly="true" value=""></div>';
		}
		html += '</div>\
			<div id="error"></div>';
		this.container.html(html);

		this.currentItem = this.container.find('.input').first();
		this.currentItem.addClass('current s');
	},

	cancelHandler: function () {
        Main.popWidget();
        if(this.cancelCallback)
            this.cancelCallback();
    },

	resetKey: function(){
		this.container.find('.current').removeClass('current');
		this.container.find('.s').removeClass('s');
		this.container.find('input').attr('value', "")
		this.currentItem = this.container.find('.input').first();
		this.currentItem.addClass('current s');
	},

	checkKey: function(){
		var key = this.getKey();
		if(key){
			apiService.post('bind',{code: key},  function(data, textStatus){
				if(data.status == "ok"){
					this.userAuthorized = true;
					$(document).trigger("custom.changeAuth");
					LocaleManager.refresh = true;
                    Main.popWidget();
					if(this.successCallback)
                        this.successCallback();
					this.hide();
					console.log('register auth +')
				} else {
					this.container.addClass('error errorMessage');
					console.log(data.message)
					$('#error').html(data.message)
					setTimeout(function(){this.container.removeClass('error');}.bind(this), 1000);
                    if (this.errorTimer) {
                        clearTimeout(this.errorTimer);
                        this.errorTimer = null;
                    }
                    this.errorTimer = setTimeout(function(){this.container.removeClass('errorMessage');}.bind(this), 4000);
					this.resetKey();
					Keyboard.show(function(val){ this.inputText(val) }.bind(this));
					console.log('register auth -')
				}
			}.bind(this));

		}else{
			this.container.addClass('error');
			setTimeout(function(){this.container.removeClass('error');}.bind(this), 1000);
			this.resetKey();
			Keyboard.show(function(val){ this.inputText(val) }.bind(this));
		}

	},

	inputText: function (num){
        if (this.errorTimer) {
            clearTimeout(this.errorTimer);
            this.errorTimer = null;
            this.container.removeClass('errorMessage')
        }
		if(num == 'backspace'){
			this.currentItem.find('input').attr('value', "")
            if (this.currentItem.prev().length > 0) {
                this.currentItem.removeClass('current s');
                this.currentItem = this.currentItem.prev();
                this.currentItem.addClass('current s');
//				this.focusInput();
            }
			this.currentItem.find('input').attr('value',"")
			return;
		}
		if(num == 'cancel'){
            this.cancelHandler();
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
	},
}

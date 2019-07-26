function Ssetting() {
	ListBase.call(this, $('#settingCol'));
	this.name = 'settings';
	this.profile = null;
	this.createWidget();
	$(document).on("custom.changeLang", function() {this.refresh()}.bind(this));
};

Ssetting.prototype = Object.create(ListBase.prototype);
Ssetting.prototype.constructor = Ssetting;

Ssetting.prototype.refreshAuth = function() {
	this.createWidget();
	this.createProfile();
}
 
Ssetting.prototype.refresh = function() {
	this.createWidget(true);
	this.createProfile(true);
}

Ssetting.prototype.reset = function() {
    this.currentItem = null;
    this.setItemSelected(false);
    this.selectedItem = null;
}

Ssetting.prototype.show = function() {
    this.currentItem = this.currentItem || this.listContainer.find('.itemCategory').removeClass("focus selected").first();
    this.setItemSelected(true);
	this.isVisible = true;
    this.container.show();
    this.setFocused(true, this.currentItem);
    if(this.currentItem.data('id') === "cabinet")
		this.showProfile()
	else if(this.currentItem.data('id') === "language")
		this.language.show()
    
}
Ssetting.prototype.showProfile = function() {
	if(this.profile == null && Auth.userAuthorized)
		this.createProfile();
	else{
		this.profile.show();
	$('.transform').removeClass("transformMenu");
	$('.transform').addClass("transformCategory");
	}
}	
Ssetting.prototype.hideProfile = function() {
	if(this.profile != null && this.profile.is(":visible")){
		this.profile.hide();
		this.isVisible = false;
	}
	else
		return;
}

Ssetting.prototype.createProfile = function(refresh) {
	if(Auth.userAuthorized){
		apiService.get("userProfile", function(data){
			if(data.status == 'ok'){
				$.extend(Auth.authInfo, {
                    "email": data.data.email || "",
                    "infoPlan": data.data.subs || []
                });
			}
			var tmpList = "";
			tmpList += '\
				<li class="itemCategory" >\
					<em>\
						<span class="sname">'+LocaleManager.tr('profile')+' </span>\
						<span class="svalue">'+Auth.authInfo.account+'</span>\
					</em>\
				</li>\
				<li class="itemCategory" >\
					<em>\
						<span class="sname">Email:</span>\
						<span class="svalue">'+Auth.authInfo.email+'</span>\
					</em>\
				</li>\
				<li class="itemCategory" >\
					<em>\
						<span class="sname">'+LocaleManager.tr('tariff')+':</span>\
					</em>';	
				if(Auth.authInfo.infoPlan.length != 0){
					for (var item in Auth.authInfo.infoPlan) {
						tmpList += ' <em><span class="planName">'+Auth.authInfo.infoPlan[item].name+ '</span>';
						var expiration_date = "";
						if(Auth.authInfo.infoPlan[item].expiration_date != null){
							expiration_date = moment(Auth.authInfo.infoPlan[item].expiration_date).format(' DD MMMM');
							tmpList += ' <span class="planDate">'+LocaleManager.tr('paid')+' '+ expiration_date +'</span>';
						}
						tmpList += '</em>';
					}
				}
				tmpList += '</li>';
				this.profile = $('#profile');
				this.profile.html('<div class="content">\
										<ul class="wrapper">' + tmpList + '</ul>\
									</div>');
				tmpList = null;
				if(refresh){
					this.profile.hide();
				}else {
					this.profile.show();
				}
				
    	}.bind(this));
	} else if (this.profile)
		this.profile.hide();
}

Ssetting.prototype.createWidget = function(refresh) {
	 	var tmpList = "";
	 	if (Auth.userAuthorized) {
	 		tmpList += '\
				<li class="itemCategory" data-id="cabinet">\
					<em><span><img src="img/genr/iconCab.png" alt=""></span><span class="catName">'+LocaleManager.tr('cab')+'</span></em>\
				</li>\
				<li class="itemCategory' + (refresh ? ' selected' : '') + '" data-id="language">\
					<em><span><img src="img/genr/iconLang.png" alt=""></span><span class="catName">'+LocaleManager.tr('lang')+'</span></em>\
				</li>\
				<li class="itemCategory" data-id="changePassword">\
					<em><span><img src="img/genr/iconParControl.png" alt=""></span><span class="catName">'+LocaleManager.tr('menuChangePass')+'</span></em>\
				</li>\
				<li class="itemCategory" data-id="logout">\
					<em><span><img src="img/genr/iconLogout.png" alt=""></span><span class="catName">'+LocaleManager.tr('exit')+'</span></em>\
				</li>';
	 	} else {
	 		tmpList += '\
	 			<li class="itemCategory' + (refresh ? ' selected' : '') + '" data-id="language">\
					<em><span><img src="img/genr/iconLang.png" alt=""></span><span class="catName">'+LocaleManager.tr('lang')+'</span></em>\
				</li>\
				<li class="itemCategory" data-id="login">\
					<em><span><img src="img/genr/iconLogin.png" alt=""></span><span class="catName">'+LocaleManager.tr('bind')+'</span></em>\
				</li>';
	 	}
		this.container.html('\
					<div class="content">\
						<ul class="wrapper">' + tmpList + '</ul>\
					</div>\
				');
		tmpList = null;
		
		this.listContainer = this.container.find("ul");
		if(refresh){
			this.currentItem = this.listContainer.find('.selected');
			this.selectedItem = this.listContainer.children('.selected');
		}
		else{			
			this.currentItem = this.listContainer.find('.itemCategory').first();
			this.setFocused(true, this.currentItem);
			this.setItemSelected(true);
		}
}

Ssetting.prototype.okKeyHandler = function(){
	var self = this;
	switch (this.currentItem.data('id')) {
		case "changePassword":
            // this.setFocused()
			Main.pushWidget("checkKey",{
				type: 1
			});
            // CheckKey.show(, 1, function(){this.setFocused(true)}.bind(this));
			break;
		case "login":
            Main.pushWidget("auth", {
				successCallback: function(){
                    self.refreshAuth()
                }
            });
			break;
		case "logout":
            Main.pushWidget("message", {
            	"type": 'unBindDevice',
                "onSuccess": function(){
            		LoadBar.show();
					apiService.get("logout", function(data) {
						if(data.status == 'ok') {
							Auth.userAuthorized = false;
							self.refreshAuth();
							$(document).trigger("custom.changeAuth");
							LocaleManager.refresh = true;
						}
                        Main.popWidget();
						LoadBar.hide();
                    })
				 },
                "onCancel": function(){
                    Main.popWidget();
				}
        	});
			break;
	}
};


Ssetting.prototype.leftKeyHandler = function(){
 	this.setActive(false);
 	this.setItemSelected(true);
    return false;
};

Ssetting.prototype.upKeyHandler = function() {
	ListBase.prototype.upKeyHandler.apply(this);
	if(this.currentItem.data('id') === "cabinet")
		this.showProfile()
	else
		this.hideProfile();

	if(this.currentItem.data('id') === "language")
		this.language.show()
	else
		this.language.hide();
	this.setItemSelected(true);
};

Ssetting.prototype.downKeyHandler = function() {
	ListBase.prototype.downKeyHandler.apply(this);
	if(this.currentItem.data('id') === "cabinet")
		this.showProfile();
	else
		this.hideProfile();

	if(this.currentItem.data('id') === "language"){
		this.language.show()
	}
	else
		this.language.hide();
	 this.setItemSelected(true);
};

Ssetting.prototype.setActive = function(active){
	this.container.toggleClass("active", active);
    this.isActive = active;
    ListBase.prototype.setActive.apply(this, arguments);
}
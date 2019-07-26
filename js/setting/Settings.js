function Settings() {
	this.name = 'settings';
	this.isVisible = false;
    this.isActive = false;
    this.container = $("#settings");
    this.widgets = [
                    new Ssetting(),
                    new SLanguage()
                ];
    this.widgets[0].language = this.widgets[1];
    this.currentIndex = 0;
   
};
 
Settings.prototype.reset = function() {
    if (this.widgets[0].reset)
        this.widgets[0].reset();
    if (this.widgets[1].reset)
        this.widgets[1].reset();
}

Settings.prototype.show = function() {
	    this.isVisible = true;
	    this.container.show();
	    this.setActive(true);
	    if(this.widgets[this.currentIndex]) {
	    	this.widgets[this.currentIndex].setActive(true);
	    	this.widgets[this.currentIndex].show();
	    }
};

Settings.prototype.hide = function() {
    this.isVisible = false;
    this.container.hide();
};
Settings.prototype.setActive = function(active){
    this.isActive = active;
    this.currentIndex = 0;  	
	this.widgets[this.currentIndex].setActive(active);
	if(active)
		this.updateHorizontalPosition();
};
Settings.prototype.leftKeyHandler = function() {
    if (this.currentIndex == 0) {
    	// this.widgets[this.currentIndex].leftKeyHandler();
    	// this.updateHorizontalPosition();
//    	Main.popWidget();
        return false;
    }
    this.widgets[this.currentIndex].setActive(false);
    this.currentIndex--;
    this.widgets[this.currentIndex].setActive(true);
    this.updateHorizontalPosition();
    return true;
};
Settings.prototype.okKeyHandler = function() {
	if(this.widgets[this.currentIndex].language.isVisible)
		this.rightKeyHandler();
	else	
		this.widgets[this.currentIndex].okKeyHandler();
};
Settings.prototype.rightKeyHandler = function() {
	if (this.currentIndex+1 >= this.widgets.length)
        return false;
	
	if(!this.widgets[this.currentIndex].language.isVisible){
		this.updateHorizontalPosition();
		return false;
	}
    this.widgets[this.currentIndex].setActive(false);
    this.currentIndex++;
    this.updateHorizontalPosition();
    this.widgets[this.currentIndex].setActive(true);
    return true;
    
};
Settings.prototype.upKeyHandler = function() {
    if (this.isActive && this.widgets[this.currentIndex]) 
        this.widgets[this.currentIndex].upKeyHandler();
};

Settings.prototype.downKeyHandler = function() {
    if (this.isActive && this.widgets[this.currentIndex])
        this.widgets[this.currentIndex].downKeyHandler();
};

Settings.prototype.updateHorizontalPosition = function () {
    // switch (this.currentIndex) {
    //     case 0:
    //         $('.transform').removeClass("transformMenu");
    //         $('.transform').addClass("transformCategory");
    //         break;
    //     case 1:
    //         $('.transform').removeClass("transformMenu");
    //         $('.transform').addClass("transformCategory");
    //         break;
    //    default:
    // 	   $('.transform').removeClass("transformCategory");
    //    		$('.transform').addClass("transformMenu");
    // 	   break;
    // }
};


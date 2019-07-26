/**
 * Created by vitalii on 21.12.17.
 */
// var widgetAPI = new Common.API.Widget();
// var tvKey = new Common.API.TVKeyValue();
// var pluginAPI = new Common.API.Plugin();

var widgetAPI = {
    blockNavigation: function (a) {
        console.log(a);
    }};
var tvKey =  {
    KEY_LEFT:37,
    KEY_RIGHT:39,
    KEY_UP:38,
    KEY_DOWN:40,
    KEY_ENTER:13,



//brouser
    KEY_RETURN: 8,
    KEY_0: 96,
    KEY_1: 97,
    KEY_2: 98,
    KEY_3: 99,
    KEY_4: 100,
    KEY_5: 101,
    KEY_6: 102,
    KEY_7: 103,
    KEY_8: 104,
    KEY_9: 105,
    KEY_INFO: 73,
    KEY_CH_UP: 87,
    KEY_CH_DOWN: 83,
    KEY_PLAY: 88,
    KEY_PAUSE: 67,
    KEY_FF: 86,
    KEY_RW: 90,
    KEY_RED: 188,
    KEY_BLUE: 190,
    KEY_GUIDE: 80,
    KEY_SUBTITLE: 82

// stb
//     KEY_0: 48,
//     KEY_1: 49,
//     KEY_2: 50,
//     KEY_3: 51,
//     KEY_4: 52,
//     KEY_5: 53,
//     KEY_6: 54,
//     KEY_7: 55,
//     KEY_8: 56,
//     KEY_9: 57,
//     KEY_CH_UP: 33,
//     KEY_CH_DOWN: 34,
//     KEY_RED: 112,
//     KEY_BLUE: 115,
//     KEY_FF: 228,
//     KEY_RW: 227,
//     KEY_PLAY: 179,
//
//
//     KEY_RETURN: 8,
//     KEY_INFO: 89,
//     KEY_GUIDE: 75,
//     KEY_SUBTITLE: 117
};

var apiService = new APIService();
var DEFAULT_AJAX_DATA = {};


Main = {
    channels: [],
    channelsCategories: [],

    currentChannelProgram: null,
    currentProgram: null,
    currentChannel: null,
    prevChannel: null,
    timeCache: null,

    transform: false,

    widgets:[],
    currentWidget: null,

    querySent: false,
    queueCallbackChannelList: [],

    queueRewind: 0,
    queueFF: 0,
    timerRewind: null,
    timerFF: null,
    rewindDown: false,

    changeLang: false,

    enterDown: false,
    enterInterval: null,

    onload: function () {

        // window.onShow = function() {
    		// var PL_NNAVI_STATE_BANNER_VOL = 1;
    		// pluginAPI.SetBannerState(PL_NNAVI_STATE_BANNER_VOL);
		// 	pluginAPI.unregistKey(tvKey.KEY_MUTE);
		// 	pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
		// 	pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
		// 	pluginAPI.registKey(tvKey.KEY_CH_UP);
		// 	pluginAPI.registKey(tvKey.KEY_CH_DOWN);
         //    pluginAPI.registKey(tvKey.KEY_PLAY);
         //    pluginAPI.registKey(tvKey.KEY_PAUSE);
         //    pluginAPI.registKey(tvKey.KEY_FF);
		// };
		// widgetAPI.sendReadyEvent();

        // SplashScreen.hide();

        // localStorage.lastChannel = null;
        // $('h2').html($('body').css('height') + ' -  ' + $('body').css('width') )
        // return


        // moment.tz.setDefault("Europe/Kiev");

        LocaleManager.getLang();
        moment.locale(''+LocaleManager.langs[LocaleManager.lang]+'');

		// moment.locale("ru");
        // this.helloMiddleware(); //TODO добавить колбек

        // this.getDeviceInfo();


//        try {
//            //"VolumeUp", "VolumeDown", "VolumeMute",
//            tizen.tvinputdevice.registerKeyBatch(
//                ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",  "ChannelUp", "ChannelDown", "MediaPlay", "MediaPause", "MediaFastForward"],
//                function successCB() {
//                    c('Registered successfully');
//                },
//                function (err) {
//                    с('The following error occurred: ' + err.name);
//                }
//            );
//        } catch (er) {
//            c(er)
//        }
        // if(SupportsCSS('transform', 'translateX(0px)')){
        //     this.transform = true;
        //     $("#category, #br1, #br2, #channel, #program").addClass("transform");
        // }

//        this.currentWidget = this.mainControl;

        Keyboard.init();
        this.messenger = new Message();
        $(document).on('keydown', this.processKeyDown.bind(this));
        $(document).on('keyup', this.processKeyUp.bind(this));
        $(document).on('custom.changeLang', function () {this.updateListChannel()}.bind(this));

        // Auth.init(function(){
        //
        // 	LoadBar.show();
            Main.init();
        // });

    },

    getDeviceInfo: function(){
        DEFAULT_AJAX_DATA = {
   			"lang": LocaleManager.langs[LocaleManager.getLang()],
            // "lang": 1,
            "device_type": "web",
//    			"device_type": tizen.systeminfo.getCapability('http://tizen.org/feature/profile'),
            "device_model": navigator.appCodeName,
//             "device_model": "UKU6000",
            "serial_number": "59b47e5320eb4183b882fec07174272e"
            // "serial_number": gSTB.GetDeviceSerialNumber()
        };

        // $('h2').html('debug : '+ DEFAULT_AJAX_DATA.serial_number);
    },

    preload : function () {
        var cache = [];
        Main.channels.forEach(function (item, index) {
            cache[index]  = new Image();
            cache[index].src = item.channelIcon;
        });
    },

    init: function () {
//    	$(document).on("custom.changeLang", function() {this.deleteWidgets()}.bind(this));
//    	$(document).on("custom.changeAuth", function() {this.deleteWidgets()}.bind(this));
//
//		this.mainNav = new MainNav($("#main_nav"));
//
//		this.getChannelList(function (){
//			Main.mainNav.initTv();
//		});
//
//		
//        this.numberChannel = null;
//        this.volume = new Volume();
//        CheckKey.init();
//        this.choiseChannel = new ChoiseChannel();
//        this.infoblock = new Infoblock();
//        this.channelNumber = new ChannelNumber();
//
//        Player.init();
        CheckKey.init();

        this.mainControl = new MainControl();


        this.settings = new Settings();
        this.infoblock = new Infoblock();
        this.programs = new Programs();

        this.getChannelList(function(){
            this.preload();
            this.currentChannel =  this.getLastChannel();
            this.updateChannelNumber();

            this.prevChannel = this.currentChannel;
            this.currentProgram = this.currentChannel.nextThree[0];
            Player.playLastChannel();

        }.bind(this));
        this.tv = new TV();
        //
        // this.currentWidget = this.mainControl;
        // this.currentWidget.setActive(true);
        // this.currentWidget.show();
        // c(this.currentWidget)
        // this.popWidget();
        this.pushWidget("main");
//        this.pushWidget("tv");
        Player.init();

        SplashScreen.hide();
    },

    getLastChannel: function () {
        var tempItem = History.getLastChannelItem();
        // var tempItem = 143958;
        if(tempItem){
            var lastChannel = getItemById(Main.channels, +tempItem);
            if(lastChannel){
                if(!lastChannel.channel_parental_protect){
                    return lastChannel;
                }
            }
        }
        return this.firstChannelwithoutParentProtect();
    },

    hideAllWidgets: function() {
    	clearInterval(this.timerHide);
    	this.timerHide = setTimeout( function() {
    		if(this.currentWidget && this.currentWidget.isVisible && !Player.paused && this.currentWidget.name == 'MainControl'){
    				this.currentWidget.hide();
    		}
    		if(this.infoblock.isVisible && !Player.paused && !Main.programs.isVisible){
    			Main.infoblock.hide();
    		}
		}.bind(this), 6000);
    },

    pushWidget: function (id, params) {
        if (this.currentWidget) {
            this.currentWidget.setActive(false);
            if (!(params && params.hideLastWidget)) {
                this.currentWidget.hide();
            }
        }

        switch (id) {
            case 'tv':
                this.currentWidget = this.tv;
                break;
            case 'program':
                this.currentWidget = this.programs;
                break;
            case 'setting':
                this.currentWidget = this.settings;
                break;
            case 'auth':
                this.currentWidget = Auth;
                break;
            case 'message':
                this.currentWidget = new Message();//this.messenger;
                break;
            case 'checkKey':
                this.currentWidget = CheckKey;
                break;
            case 'main':
                this.currentWidget = this.mainControl;
                break;
        }
        this.widgets.push(this.currentWidget);
        this.currentWidget.setActive(true);
        this.currentWidget.show(params);
    },

    popWidget: function (step) {
        if (!this.currentWidget)
            return;
        step = step || -1;
        this.currentWidget.setActive(false);
        if (this.currentWidget.reset)
            this.currentWidget.reset();
        this.currentWidget.hide();
        if(step > this.widgets.length){
        	this.widgets = [];
        	this.currentWidget = null;
        	return;
        }
        this.widgets.splice(step);
        if (this.widgets.length > 0) {
            this.currentWidget = this.widgets[this.widgets.length - 1];
            this.currentWidget.setActive(true);
            this.currentWidget.show();
        } else {
            this.currentWidget = null;
        }
    },

    helloMiddleware: function (){
        var params = {
            "default_url": DEFAULT_API_URL
        };
        //url: 'https://hello.iptvapi.net/devices/get_mw_url',
        //url: 'https://UNTC.digiline.tv/devices/get_mw_url',
        $.ajax({
            url: 'https://api.tv.untc.ua/devices/get_mw_url',
            data:  $.extend({},params, DEFAULT_AJAX_DATA),
            context: this,
            success: function(obj) {
                if(obj.status == 'ok'){
                    API_URL = obj.data.url;
                    SCREENSHOT_SERVER = obj.data.screenshot_server;
                }
                console.log(obj)
            }.bind(this),
            error: function(obj){
                console.log('Error Hello Middleware');
                console.log(obj);
                API_URL = DEFAULT_API_URL;
            }
        });
    },

    updateListChannel: function () { this.channels = this.channelsCategories = [];},

    getChannelList: function(callback) {
        var nowTime = moment().unix();
        if(!this.timeCache)
            this.timeCache = nowTime;
        if(nowTime - this.timeCache > 900)
            this.channels.length = this.channelsCategories.length = 0;
        this.queueCallbackChannelList.push(callback);
        console.log(this.queueCallbackChannelList.length);
        if(this.querySend && callback){
            return;
        }
        if(this.channels.length == 0 && this.channelsCategories.length == 0 ) {
            this.querySend = true;
            apiService.get("tvChannels", function(data){
                debugger
                if(data.status == "ok"){
                    // this.channelsCategories = data.data.genres;
                    // this.channelsCategories.splice(9, 1); //TODO удаление Латвий каналов del
                    // this.channelsCategories.splice(10, 1); //TODO удаление Эротика каналов del
                    // this.channels = sortByGenre (data.data.channels, this.channelsCategories);
                    this.channels = data.data.channels;
                    this.timeCache = nowTime;
                    if(this.queueCallbackChannelList.length){
                        $.each(this.queueCallbackChannelList, function (i, callback) {
                            try{
                                callback(this.channels);
                            }catch (e){
                                console.log(e);
                            }
                           if(i == this.queueCallbackChannelList.length-1){
                               this.queueCallbackChannelList = [];
                               this.querySend = false;
                           }
                        }.bind(this));
                    }
                }
            }.bind(this));
        }else{
            if(this.queueCallbackChannelList.length){
                $.each(this.queueCallbackChannelList, function (i, callback) {
                    callback(this.channels);
                });
                this.queueCallbackChannelList = [];
            }
        }
    },

    processKeyDown: function (e) {
        // for(var key in tvKey ){
        //     if(tvKey[key] == event.keyCode)
        //         $('h2').text('Down ' + key);
        // }
        // console.log(event);
        // $('h2').html('debug : ');
        // for( var key in event){
        //     $('h2').append('key -' + key + ' = '+ event[key] + '; ')
        // }
        // $('h2').text(event.keyCode +' - ');




        switch(event.keyCode) {
            case tvKey.KEY_LEFT: //LEFT arrow
                if (this.currentWidget && this.currentWidget.isVisible && this.currentWidget.leftKeyHandler)
                    this.currentWidget.leftKeyHandler();
                break;
            case tvKey.KEY_RIGHT: //RIGHT arrow
                if (this.currentWidget && this.currentWidget.isVisible && this.currentWidget.rightKeyHandler)
                    this.currentWidget.rightKeyHandler();
                break;
            case tvKey.KEY_UP: //UP arrow
                if (this.currentWidget && this.currentWidget.isVisible && this.currentWidget.upKeyHandler) {
                    if (!this.timerFF) {
                        this.timerFF = setInterval(
                            function () {
                                this.currentWidget.upKeyHandler();
                                clearInterval(this.timerFF);
                                this.timerFF = null;
                            }.bind(this), 40);
                    }

                    // this.currentWidget.upKeyHandler();

                } else {
                    Player.nextChannel();
                }
                break;
            case tvKey.KEY_DOWN: //DOWN arrow
                if (this.currentWidget && this.currentWidget.isVisible && this.currentWidget.downKeyHandler) {
                    if (!this.timerRewind) {
                        this.timerRewind = setInterval(
                            function () {
                                this.currentWidget.downKeyHandler();
                                clearInterval(this.timerRewind);
                                this.timerRewind = null;
                            }.bind(this), 40);
                    }
                    // this.currentWidget.downKeyHandler();
                } else {

                    Player.prevChannel();
                }
                break;
            case tvKey.KEY_ENTER: //OK button
                clearInterval(this.enterInterval);
                if (this.enterDown)
                    return;
                this.enterDown = true;

                if (this.currentWidget) {
                    if (this.currentWidget.isVisible) {
                        if (this.currentWidget.okKeyHandler)
                            this.currentWidget.okKeyHandler();
                        this.enterInterval = setInterval(function () {
                            if (this.currentWidget && this.currentWidget.okKeyHandler && this.enterDown)
                                this.currentWidget.okKeyHandler();
                            else {
                                clearInterval(this.enterInterval);
                            }
                        }.bind(this), 365); //165
                    } else {
                        this.currentWidget.show();
                    }
                    //     clearTimeout(this.timerHide);
                    //     this.infoblock.show();
                    //     if(this.channelNumber.isVisible)
                    //         this.channelNumber.hide();
                    //     $(document).trigger("custom.scrollForMiddle");
                } else {
                    this.pushWidget("main") ;
                }
                break;
            case tvKey.KEY_CH_UP: //KEY_CH_UP
                this.popWidget(20);

                Player.nextChannel();
                break;
            case tvKey.KEY_CH_DOWN: //KEY_CH_DOWN
                this.popWidget(20);
                Player.prevChannel();
                break;
//            case 10: //BACK button
//
//                if (this.currentWidget && this.currentWidget.isVisible) {
//                    // this.currentWidget.hide();
//                    this.popWidget();
//                }
//
//                break;
            case 0: //test
                Player.nextProgram();
                break;
            case tvKey.KEY_RETURN:
            case tvKey.KEY_PANEL_RETURN: //RETURN button
                widgetAPI.blockNavigation(event);

                if (this.currentWidget && this.currentWidget.isVisible) {
                    // this.currentWidget.hide();
                    this.popWidget();
                    return;
                } else {
                    // this.pushWidget('message', {
                    //     type: 'exitPopup',
                    //     onSuccess: function () {
                    //         widgetAPI.sendReturnEvent();
                    //     },
                    //     onCancel: function () {
                    //     	Main.popWidget();
                    //     }
                    // });
                    Player.playPrevChannel();
                }
                break;
            case tvKey.KEY_PLAY://mediaPlay
            case tvKey.KEY_PAUSE:// mediaPause
                if(Player.paused){
                    if (this.currentWidget) {
                        if (!this.currentWidget.isVisible)
                            this.currentWidget.show();
                    } else {
                        this.pushWidget("main");
                    }
                    Player.play();
                }else{
                    if (this.currentWidget) {
                        if (!this.currentWidget.isVisible)
                            this.currentWidget.show();
                    } else {
                        this.pushWidget("main");
                    }
                    Player.pause();
                }
                break;
            case tvKey.KEY_0:
            case tvKey.KEY_1:
            case tvKey.KEY_2:
            case tvKey.KEY_3:
            case tvKey.KEY_4:
            case tvKey.KEY_5:
            case tvKey.KEY_6:
            case tvKey.KEY_7:
            case tvKey.KEY_8:
            case tvKey.KEY_9:

                var keys = {};
                keys[tvKey.KEY_0] = 0;
                keys[tvKey.KEY_1] = 1;
                keys[tvKey.KEY_2] = 2;
                keys[tvKey.KEY_3] = 3;
                keys[tvKey.KEY_4] = 4;
                keys[tvKey.KEY_5] = 5;
                keys[tvKey.KEY_6] = 6;
                keys[tvKey.KEY_7] = 7;
                keys[tvKey.KEY_8] = 8;
                keys[tvKey.KEY_9] = 9;

//                var keys = {
//                    48: 0,
//                    49: 1,
//                    50: 2,
//                    51: 3,
//                    52: 4,
//                    53: 5,
//                    54: 6,
//                    55: 7,
//                    56: 8,
//                    57: 9
//                };
                if (Keyboard.isActive) {
                    Keyboard.pressKeyHandler(keys[e.keyCode]);
                    return;
                } else {
                    Player.choiceChannel(keys[e.keyCode]);
                }

                // if (!this.currentWidget.isVisible && !CheckKey.isActive)
                //     this.choiseChannel.updateContent(0)
                break;
            case tvKey.KEY_FF_:// после 15 KEY_FF начинает приходить этот event
            case tvKey.KEY_FF://MediaFastForward
                if (this.currentWidget) {
                    if (!this.currentWidget.isVisible)
                        this.currentWidget.show();
                } else {
                    this.pushWidget("main");
                }
                if (this.mainControl.focusItem('ff')) {

                    this.queueFF++;
                    if (!this.timerFF) {
                        this.timerFF = setInterval(
                            function () {
                                if (this.queueFF !== 0) {
                                    Player.ff();
                                    this.queueFF--;
                                } else {
                                    clearInterval(this.timerFF);
                                    this.timerFF = null;
                                    this.queueFF = 0;
                                }
                            }.bind(this), 125);
                    }
                }
                break;
            case tvKey.KEY_REWIND_: // после 15 KEY_RW начинает приходить этот event
            case tvKey.KEY_RW://MediaREWForward
                // if(this.rewindDown)
                //     return
                // this.rewindDown = true;
                if (this.currentWidget) {
                    if (!this.currentWidget.isVisible)
                        this.currentWidget.show();
                } else {
                    this.pushWidget("main");
                }
                if (this.mainControl.focusItem('rew')) {
                    // Player.rew();
                    // this.timerRewind = setInterval(
                    //     function () {
                    //         if(this.rewindDown){
                    //             Player.rew();
                    //         }else{
                    //             clearInterval(this.timerRewind);
                    //         }
                    // }.bind(this), 500);

                    this.queueRewind++;
                    if (!this.timerRewind) {
                        this.timerRewind = setInterval(
                            function () {
                                if (this.queueRewind !== 0) {
                                    Player.rew();
                                    this.queueRewind--;
                                } else {
                                    clearInterval(this.timerRewind);
                                    this.timerRewind = null;
                                    this.queueRewind = 0;
                                }
                            }.bind(this), 125);
                    }
                }


                break;
            case tvKey.KEY_GUIDE: //key guide (p)
                if(this.currentWidget === this.programs) {
                    this.popWidget();
                    return;
                }else{
                    this.popWidget(20);
                    this.pushWidget("program");
                    Main.mainControl.focusItem('tv');
                }
                break;
            case tvKey.KEY_INFO:// key info (i)
                if (this.infoblock.isVisible && this.currentWidget !== this.mainControl){
                    this.infoblock.hide();
                }else{
                    this.popWidget(20);
                    this.infoblock.show();
                }
                break;

            case tvKey.KEY_CHLIST: //CH LIST
            case tvKey.KEY_RED: // KEY_RED
                if (this.currentWidget === this.tv) {
                    return;
                } else {
                    this.popWidget(20);
                    this.pushWidget("main");
                    this.pushWidget("tv");
                    Main.mainControl.focusItem('tv');
                }
                break;
            case tvKey.KEY_BLUE: // BLUE
                if (this.currentWidget === this.setting) {
                    return;
                } else {
                    this.popWidget(20);
                    this.pushWidget("main");
                    this.pushWidget("setting");
                    Main.mainControl.focusItem('setting');
                }
                break;
            case tvKey.KEY_SUBTITLE: //
                Player.changeAspectRatio();
                break;


            default:
                console.log('Key code : ' + e.keyCode);
                break;
        }
    },
    processKeyUp: function (e) {
        // for(var key in tvKey ){
        //     if(tvKey[key] == event.keyCode)
        //         $('h2').text('Up ' + key);
        // }
        switch(event.keyCode) {
            case tvKey.KEY_UP: //UP arrow
                if (this.currentWidget && this.currentWidget.isVisible && this.currentWidget.upKeyHandlerUp)
                    this.currentWidget.upKeyHandlerUp();
                break;
            case tvKey.KEY_DOWN: //DOWN arrow
                if (this.currentWidget && this.currentWidget.isVisible && this.currentWidget.downKeyHandlerUp)
                    this.currentWidget.downKeyHandlerUp();
                break;

            case tvKey.KEY_ENTER:
                this.enterDown = false;
                break;

            case tvKey.KEY_FF_: // после 15 KEY_RW начинает приходить этот event
            case tvKey.KEY_FF://MediaREWForward
                this.queueFF = 0;
                break;

            case tvKey.KEY_REWIND_: // после 15 KEY_RW начинает приходить этот event
            case tvKey.KEY_RW://MediaREWForward
                // this.rewindDown = false;
                this.queueRewind = 0;
                break;

            default:
                console.log('Key code : ' + e.keyCode);
                break;
        }
    },

    
    firstChannelwithoutParentProtect : function() {
        for (var i = 0; i < Main.channels.length; i++){
            console.log(Main.channels[i].channel_parental_protect)
            if(!Main.channels[i].channel_parental_protect){
            	Main.channelNumber = i;
                return Main.channels[i];
                break;
            }
        }
    },
    updateChannelNumber : function() {
    	for(var i = 0; i <= this.channels.length; i++){
    		if(this.channels[i].id == Main.currentChannel.id){						
    			Main.channelNumber = i;
    			break;
    		}
    	}
    },


};

$(document).ready(function(){
    Main.onload();
});

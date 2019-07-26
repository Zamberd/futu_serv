Player = {
    container: $('#player'),
//    info: $("#info"),
//    seek: $("#infoSeek"),
    hls: null,

    bar: null,
    channel: null,
    mediaItem: null,
    mediaPlayer: null,
    currentTime: 0,
    playingDVR: false,
    listener: null,

    choiceChannelNum: '',

    pauseTime: 0,
    allDelayTime: 0,
    delayTime: 0,
    paused: false,

    positionDVR: 0,
    modTimePrevPrograms: 0,

    timer: null,
    seekTime: 0,

    intervalMenu: null,
    timerChangeChannel: null,

    liveProgram: null,

    init: function () {
        $(".video").html('<video id="video" width="1920" height="1080" preload="none" autoplay poster="posterPlayer.png"></video>');
        this.mediaPlayer = document.getElementById('video');

        // this.initHls();



        // Player.aspectRatio = History.getAspectRatio();
        // this.updateAspectRatio();
        this.mediaPlayer.addEventListener('timeupdate', function () {
            if(this.mediaPlayer){
                if(this.playingDVR){
                    this.currentTime = this.mediaPlayer.currentTime;

                }else{
                    this.currentTime = moment().unix() - this.startStreaming; //время начала воспроизведения стрима
                }
            }
            // console.log(this.currentTime)
        }.bind(this), true);
        
        this.mediaPlayer.addEventListener('error', function (event) {

            console.log(event)
            var log = {
                    "type": 'errorPlay',
                    "onSuccess": function(){
//                      Player.refreshAVPlayer();
                    }.bind(this)
            };
            // Main.messenger.show(log);
        }.bind(this), true);

    },

//     successCB: function (avplayObj) {
// 		Player.mediaPlayer = avplayObj;
// 		this.listener = {
// 			"playCallback":{
// 				"oncurrentplaytime": function (time) {
//                     if(!this.seekFF && !this.seekBack)
// 	        		    Player.currentTime = time.millisecond;
// //					console.log(time.millisecond)
// //					console.log(Player.mediaPlayer.status)
// 				},
// 				"onstreamcompleted": function () {
// 					Player.nextDvrProgram();
// 				},
// 				"onerror": function (erorr) {
// 					c("onerror "+erorr); //@cleaner_del_line
// 				}
// 			},
// 			"bufferingCallback":{
// 				"onbufferingstart": function () {
// 					console.log("buffering start!!!")
// //					Player.buffering = true;
// 					LoadBar.show();
// 				},
// 				"onbufferingprogress": function (percent) {
// 				},
// 				"onbufferingcomplete": function () {						
// 					console.log("buffering complite!!!!!!!!")
// 					LoadBar.hide();
// //					Player.buffering = false;
// 				}
// 			}
// 		};
// 		Player.mediaPlayer.init(this.listener);
// 		Player.mediaPlayer.setDisplayRect({"top":0,"left":0,"width":1920, "height":1080});
//  	},
//  	errorCB: function (error) { console.log("Cannot get avplay object : " + error);	},
    initHls: function () {
        if(this.hls)
            this.hls.destroy();
        this.hls = new Hls();
        this.video = $('#video');
        this.hls.on(Hls.Events.ERROR, function (event, data) {
            console.log(event);
            $('h2').html(data.details);
            console.log(data);
            if(data.fatal)
                this.initHls();
        }.bind(this));
    },
    changeAspectRatio: function () {

        if(this.aspectRatio){
            // Player.mediaPlayer.setDisplayArea({"top":0,"left":240,"width":1440, "height":1080});.
            this.video.css({"width":1440, "height":1080})
            this.aspectRatio = false;

            this.aspectRatioBlock = $('.aspectRatio');
            this.aspectRatioBlock.toggleClass( "active4", true);
            this.aspectRatioBlock.toggleClass( "active16", false);
            this.aspectRatioBlock.html('4:3');
            this.aspectRatioBlock.show();
            clearTimeout(this.timerHideAspectRationBlock);
            this.timerHideAspectRationBlock = setTimeout(function () {
                this.aspectRatioBlock.hide();
            }.bind(this), 2000);
        }else{
            // Player.mediaPlayer.setDisplayArea({"top":0,"left":0,"width":1920, "height":1080});
            this.video.css({"width":1920, "height":1080})
            this.aspectRatio = true;

            this.aspectRatioBlock = $('.aspectRatio');
            this.aspectRatioBlock.toggleClass( "active4", false);
            this.aspectRatioBlock.toggleClass( "active16", true);
            this.aspectRatioBlock.html('16:9');
            this.aspectRatioBlock.show();
            clearTimeout(this.timerHideAspectRationBlock);
            this.timerHideAspectRationBlock = setTimeout(function () {
                this.aspectRatioBlock.hide();
            }.bind(this), 2000);
        }
        History.setAspectRatio(this.aspectRatio);

    },
    updateAspectRatio: function () {
        if(this.aspectRatio){
            this.video.css({"width":1920, "height":1080})
        }else{
            this.video.css({"width":1440, "height":1080})
        }



            // Player.mediaPlayer.setDisplayArea({"top":0,"left":0,"width":1920, "height":1080});
        // else
            // Player.mediaPlayer.setDisplayArea({"top":0,"left":240,"width":1440, "height":1080});

    },

    getDuration: function () { return this.mediaPlayer.getDuration(); },

    play: function(){

         if(this.mediaPlayer.paused && this.paused ){
    		this.mediaPlayer.play();
            this.bar.find("[data-id='playpause']").addClass("pause").removeClass("play");
            this.allDelayTime += this.delayTime;
            this.delayTime = 0;
            this.pauseTime = 0;
            this.paused = false;
            this.seek.hide();
            this.infoSeek.hide();
            if(LoadBar.isVisible){
                LoadBar.hide();
                Main.hideAllWidgets();
            }
            this.startStreaming = moment().unix();
        }else{
            this.mediaPlayer.play();
            Player.bar.find("[data-id='playpause']").toggleClass("pause", true);
            Main.mainControl.focusPlay();
            if(LoadBar.isVisible){
                LoadBar.hide();
                Main.hideAllWidgets();
            }
            this.startStreaming = moment().unix();
        }
    },

    stopPlayer: function () {
        if(this.mediaPlayer.status == 4  ){
            console.log("stop !!!");
            Player.mediaPlayer.stop();
        }else	if(this.mediaPlayer.status == 5){
            console.log("stop after resume !!!");
            // this.mediaPlayer.resume();
            this.mediaPlayer.stop();
        }
    },

    pause: function() {

//        if (this.mediaPlayer.getState() == 'PLAYING') {
//            this.mediaPlayer.pause();
    	if (this.mediaPlayer.play) {

    		this.mediaPlayer.pause();
            this.paused = true;
            this.bar.find("[data-id='playpause']").addClass("play").removeClass("pause");

            if(!this.playingDVR){
                // if(!this.infoSeek.length)
                //     this.infoSeek = $("#infoSeek");
                // this.pauseTime = moment().unix();
                this.pauseTime = Math.round((this.currentTime / 1000) + this.positionDVR) + Main.currentProgram.start;
                if(Main.currentProgram && !Main.currentProgram.live){
                    this.updatePausetimeInInfoseek();
                    this.infoSeek.show();
                    Main.mainControl.controlPlayLiveSeek();
                }
            }
        }
    },

    pauseOff: function () {
        this.delayTime = this.allDelayTime = this.pauseTime = 0;
        this.paused = false;
        this.infoSeek.text("");
        this.infoSeek.hide();
        this.seek.text("");
        this.seek.hide();
    },

    preparePlayer: function (media_url) {
        // var token = Math.random() * 100;
        // media_url += token + '1|COMPONENT=HLS';
        // this.mediaData.media_url = media_url;
        // console.log(this.mediaData.media_url);
        // try {
        //     console.log('playing DVR ' + program.programm_id +" - "+this.mediaData.media_url + " position ="+ this.currentPointerTime )
        //     this.mediaPlayer.open(media_url);
        //     this.modTimePrevPrograms = 0;
        // } catch (exp) {
        //     // this.refreshAVPlayer(); // TODO
        //     console.log("code " + exp.code + " description " + exp.message)
        // }

        // while (this.mediaPlayer.firstChild)
        //     this.mediaPlayer.removeChild(this.mediaPlayer.firstChild);

        // var token = Math.random() * 100;
        // media_url = 'http://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov/playlist.m3u8';
        // media_url += Math.round(token) + '1|COMPONENT=HLS'; //
        if(media_url == ""){
            console.log('media_url - ""');
            return;
        }

        this.mediaData.media_url = media_url;
        console.log(media_url);

       if( media_url.substr(0, 3) == 'udp'  || media_url.substr(0, 3) == 'rtp'){
            while (this.mediaPlayer.firstChild)
                this.mediaPlayer.removeChild(this.mediaPlayer.firstChild);
            // Initiating readyState of HTMLMediaElement
            this.mediaPlayer.load();
            // Add new source element
            var source = document.createElement("source");
            source.setAttribute('src',media_url);
            this.mediaPlayer.appendChild(source);
       }else{
           try{
               this.initHls();
               media_url += '|COMPONENT=HLS';
               this.mediaData.media_url = media_url;
               this.hls.loadSource(media_url);
               this.hls.attachMedia(this.mediaPlayer);

           }catch (e) {
               console.log(e)
           }

       }
        console.log(media_url);


        // this.hls.loadSource(media_url);
        // this.hls.attachMedia(this.mediaPlayer);

        // // Initiating readyState of HTMLMediaElement
        // this.mediaPlayer.load();
        // // Add new source element
        // var source = document.createElement("source");
        // // http://out1.h.zanoza.lv:8080/rossia1/index.m3u8?token=661|COMPONENT=HLS
        // source.setAttribute('src',media_url);
        // this.mediaPlayer.appendChild(source);


    },

    playLastChannel: function () { this.playChannel(Main.currentChannel.id); this.progressBarLive();},

    playPrevChannel: function () {
        var temp = Main.currentChannel;
        Main.currentChannel = Main.prevChannel;
        Main.prevChannel = temp;
        this.playChannel(Main.currentChannel.id);
        this.progressBarLive();
        Main.updateChannelNumber();
    },
    //*@next - current program
    playChannel: function (id, currentProgram) {
        this.pauseOff();
        LoadBar.show();
        apiService.get("media", {id: id}, function (data) {
            if(data){
                this.stopPlayer();
                this.mediaData = data.data;
                console.log(this.mediaData.media_url);

                this.preparePlayer(this.mediaData.media_url);
                this.play();
                this.playingDVR = false;

                Main.mainControl.controlPlayLive();
                if(currentProgram){
                    Main.currentProgram = currentProgram;
                    this.positionDVR = moment().unix() - Main.currentProgram.start;

                    this.progressBarLive(currentProgram);
                    if(currentProgram.live)
                        Main.mainControl.controlPlayLivewithoutProgram();
                }else {
                    Main.currentProgram = Player.currentNextThree(Main.currentChannel);
                    if(Main.currentProgram && !Main.currentProgram.live)
                        this.positionDVR = moment().unix() - Main.currentProgram.start; //s
                    this.progressBarLive();
                }
                History.setLastChannelItem(Main.currentChannel.id);
                Main.hideAllWidgets();
                SplashScreen.hide();
                $(document).trigger("custom.updateChannelOn");
            }
        }.bind(this));
    },

    playDVR: function(channelData, program, liveProgram) {
        this.pauseOff();
        if(channelData){
            Main.prevChannel = Main.currentChannel;
            Main.currentChannel = getItemById(Main.channels, channelData);
        }

        Main.currentProgram = program;

        if(liveProgram){
            apiService.get("mediaSeek", { programm_id: Main.currentProgram.programm_id, position: 0, cdnToken :1, timeshift_abs: 1},function(data){
                if(data){
                    this.stopPlayer();
                    this.mediaData = data.data;

                    this.preparePlayer(this.mediaData.media_url);
                    this.play();

                    this.seekFF = this.seekBack = false;

                    this.positionDVR = 0;//s

                    this.playingDVR = false;
                    this.progressBarLive();
                    Main.mainControl.controlPlayLiveSeek();

                    History.setLastChannelItem(Main.currentChannel.id);
                    $(document).trigger("custom.updateChannelOn");
                }


            }.bind(this));
        }else{
            this.playingDVR = true;
            apiService.get("mediaDVR", {id: channelData, programm_id: program.programm_id},function(data){
                if(data){
                    this.stopPlayer();
                    this.mediaData = data.data;

                    this.preparePlayer(this.mediaData.media_url);
                    this.play();

                    this.seekFF = this.seekBack = false;
                    this.positionDVR = 0;//s
                    this.progressBar();
                    Main.mainControl.controlPlayDVR();
                    $(document).trigger("custom.updateChannelOn");
                }

            }.bind(this));
        }




//         apiService.get("mediaDVR", {id: channelData, programm_id: program.programm_id},function(data){
//             this.stopPlayer();
//             this.mediaData = data.data;
//
// // //            this.mediaData.media_url += '1';
// //             this.mediaData.media_url += '1|COMPONENT=HLS';
// //             console.log(this.mediaData.media_url)
// //             try {
// //                 c('playing DVR ' + program.programm_id +" - "+this.mediaData.media_url)
// //                 Player.mediaPlayer.open(this.mediaData.media_url);
// // //                this.mediaPlayer.open(this.mediaData.media_url);
// // //                this.mediaPlayer.setDisplayRect(0, 0, 1920, 1080);
// //             } catch (exp) {
// //                 // this.refreshAVPlayer(); // TODO
// //                 console.log("code " + exp.code + " description " + exp.message)
// //             }
//
//             this.preparePlayer(this.mediaData.media_url);
//             this.play();
//             this.playingDVR = true;
//             this.seekFF = this.seekBack = false;
//             this.progressBar();
//             Main.mainControl.controlPlayDVR();
//             $(document).trigger("custom.updateChannelOn");
//         }.bind(this));


    },

    nextDvrProgram: function(updateProgres){
        $('h1').text('--  --------------------------------------------');
        var nextDVR = null;
        var isLive = null;
        var dateNow = moment();
        var startDate;
        var j = null;
        Main.currentChannelProgram.program.forEach(function (item, i){
            if(nextDVR || isLive)
                return;
            if(Main.currentProgram.programm_id == item.programm_id)
                j = i;
            if(j != null && i > j){
                var stopDate = moment.unix(item.stop);
                if(stopDate.diff(dateNow) < 0){
                    $('h1').text('DVR!- ');
                    nextDVR = item;
                    nextDVR.poster = Main.currentChannelProgram.poster;
                    this.modTimePrevPrograms += this.currentTime / 1000;
                    Main.currentProgram = nextDVR;
                    this.playingDVR = true;
                    this.positionDVR = 0;
                    if(updateProgres){
                        this.playDVR(false, nextDVR);
                    }else{
                        this.progressBar();
                    }

                }else{
                    $('h1').text('LIVE!!!!!!!!!!!!!!!!!!!- ');
                    var startDate = moment.unix(item.start);
                    if(startDate.diff(dateNow) < 0 && dateNow.diff(stopDate) < 0){
                        nextDVR = item;
                        nextDVR.poster = Main.currentChannelProgram.poster;
                        Main.currentProgram = nextDVR;
                        this.playingDVR = false;
                        this.modTimePrevPrograms += this.currentTime / 1000;
                        this.positionDVR = 0;
                        if(updateProgres) {
                            this.playDVR(false, nextDVR, true);
                            this.progressBarLive();
                        }else{
                            this.progressBarLive();
                        }
                        // this.playChannel(Main.currentChannelProgram.item_id);


                    }
                }
            }
        }.bind(this));
        $(document).trigger("custom.updateOnProgram");
    },

    // progressBar: function() {
    //     clearInterval(this.intervalProgress);
    //     Main.infoblock.show(Main.currentProgram);
    //     var duration = Main.currentProgram.stop - Main.currentProgram.start;
    //     console.log('this.currentTime' + this.currentTime);
    //     console.log('this.currentTime' + duration);
    //     var width = $('.timeline').width();
    //     if(width > 1800)
    //         width = 1800;
    //     this.intervalProgress = setInterval(function() {
    //         $('h1').append('--1- '+ this.currentTime +' -*- '+ this.positionDVR);
    //         if(!this.seekFF && !this.seekBack){
    //             this.watched = (((this.currentTime / 1000) + this.positionDVR) * width) / duration;
    //             this.pointerTime = (((this.currentTime / 1000) + this.positionDVR) * width) / duration;
    //             console.log(this.currentTime+ ' - ' + this.pointerTime + ' - ' + this.watched);
    //             if(this.watched < width && this.pointerTime< width){
    //                 $('.timeline_live').width(this.pointerTime);
    //                 $('.timeline_watched').width(this.watched);
    //             }
    //         }
    //     }.bind(this), 500);
    // },
    updatePausetimeInInfoseek: function(){
        var now = moment().unix();
        var mod = now - this.pauseTime;
        var str = '-';
        str+= Math.floor(mod/60)+':';
        var s = mod%60;
        if(s == 0)
            str+="00";
        else if(s < 10)
            str+="0"+s;
        else
            str+=s;
        this.infoSeek.text(str);
    },
    progressBar: function() {
        clearInterval(this.intervalProgress);
        if(!Main.currentProgram || !Main.currentProgram.stop || !Main.currentProgram.start){
            console.log('progressBar() - no found current program or start/stop of program')
            return
        }
        Main.infoblock.show(Main.currentProgram);
        var duration = Main.currentProgram.stop - Main.currentProgram.start;
        console.log('this.currentTime' + this.currentTime);
        console.log('this.currentTime' + duration);
        var width = $('.timeline').width();
        if(width > 1800)
            width = 1800;
        var nextLiveTrue = false;

        this.intervalProgress = setInterval(function() {
            if(!this.seekFF && !this.seekBack){
                if(this.playingDVR){

                    // this.watched = (((this.currentTime / 1000) + this.positionDVR - this.modTimePrevPrograms) * width) / duration;
                    this.watched = ((this.currentTime + this.positionDVR - this.modTimePrevPrograms) * width) / duration;
                    if(this.watched < width){
                        $('.timeline_live').width(this.watched);
                        $('.timeline_watched').width(this.watched);
                    }
                    console.log('-- DVR watched - '+this.watched + ' ');
                    if(this.watched >= 1800){
                        this.nextDvrProgram();
                    }
                }else{
                    var now = moment().unix();

                    var currentTimeWatch = now - Main.currentProgram.start;
                    this.watched = (currentTimeWatch * width)/duration;

                    // this.pointerTime = (((this.currentTime / 1000) + this.positionDVR - this.modTimePrevPrograms) * width) / duration;
                    this.pointerTime = ((this.currentTime + this.positionDVR - this.modTimePrevPrograms) * width) / duration;
                    if(this.pointerTime > this.watched)
                        this.pointerTime = this.watched;

                    if (this.watched >= width)
                        this.watched = width;
                    $('.timeline_watched').width(this.watched);

                    if(this.pointerTime >= width)
                        this.pointerTime = width;
                    $('.timeline_live').width(this.pointerTime);

                    // if(this.watched < width && this.pointerTime < width){
                    //     $('.timeline_live').width(this.pointerTime);
                    //     $('.timeline_watched').width(this.watched);
                    // }
                    
                    console.log('-- Live pointerTime - '+this.pointerTime + ' currentTime - ' + this.currentTime);
                    if(this.paused){
                        this.updatePausetimeInInfoseek();
                    }

                    if(this.watched >= 1800 && now >= Main.currentProgram.stop && !nextLiveTrue){
                        nextLive = this.nextLive();
                        console.log(nextLive);
                        nextLiveTrue = true;
                    }
                    if(this.pointerTime >= 1800){
                        $(document).trigger("custom.focusLive");
                        this.nextDvrProgram();
                        // Main.currentProgram = nextLive;
                        // this.progressBarLive(nextLive);
                    }
                }
            }
        }.bind(this), 500);
    },

    progressBarforMenu: function (liveProgram, program) {
        var now = moment().unix();
        var  start, stop, currentTime, duration, watched;
        clearInterval(this.intervalMenu);
        var width = program.children(".live").find(".progressBar").width();
        var progres = $('.live .progress');
        var progresClone = $('#programContainer .live .progress');
        start = liveProgram.start;
        stop =  liveProgram.stop;
        duration = stop - start;
        currentTime = now - start;
        watched = (currentTime * width)/duration;
        progres.width(watched);
        progresClone.width(watched);
        this.intervalMenu = setInterval(function () {
            now = moment().unix();
            currentTime = now - start;
            watched = (currentTime * width)/duration;
            // console.log(watched);
            progres.width(watched);
            progresClone.width(watched);
        },3000)
    },

    progressBarLive: function(item) {

        if(!Main.currentChannel)
            return;
        clearInterval(this.intervalProgress);
        if(item){
            Main.infoblock.show(item);
        }else{
            var currentProgram = this.currentNextThree(Main.currentChannel);
            if(currentProgram && currentProgram.live){
                Main.infoblock.show(currentProgram);
                Main.mainControl.controlPlayLivewithoutProgram();
            }else{
                Main.currentProgram = currentProgram;
                Main.infoblock.show(currentProgram);
            }
        }

        this.progressBar();

        return;
        //
        // Main.hideAllWidgets();
        // var duration = stop - start;
        // var width = $('.timeline').width();
        // if(width > 1800)
        //     width = 1800;
        //
        // var nextLiveTrue = false;
        // var mod = 0;
        // var nextLive;
        //
        // this.intervalProgress = setInterval(function() {
        //     var now = moment().unix();
        //     var currentTimeWatch = now - start;
        //     this.watched = (currentTimeWatch * width)/duration;
        //
        //     //TODO pause()
        //     // if(this.pauseTime != 0){
        //     //     this.delayTime = now - this.pauseTime;
        //     // }
        //     // if(this.allDelayTime != 0 || this.delayTime != 0){
        //     //     this.currentPointerTime = now - start - this.allDelayTime - this.delayTime;
        //     // }else{
        //     //     this.currentPointerTime = now - start;
        //     // }
        //
        //     this.currentPointerTime = ((+this.currentTime / 1000) + this.positionDVR);
        //     if(this.currentPointerTime + start > now)
        //         this.currentPointerTime = now;
        //     this.pointerTime = (this.currentPointerTime * width) / duration;
        //     // $('h1').append(' 22 duration - '+ duration + ' this.currentPointerTime - '+ this.currentPointerTime + 'this.positionDVR - '+ this.positionDVR + 'this.currentTime = '+this.currentTime + ' ----<br>');
        //
        //     if($('.timeline_live').length > 0) {
        //         if(this.watched > 1800)
        //             this.watched = 1800;
        //         if(this.pointerTime > 1800)
        //             this.pointerTime = 1800;
        //         // console.log(this.pointerTime);
        //         // console.log(this.watched);
        //         $('.timeline_live').width(this.pointerTime);
        //         $('.timeline_watched').width(this.watched);
        //     }
        //     if(this.paused){
        //         mod = now - this.pauseTime;
        //         var str = '-';
        //         str+= Math.floor(mod/60)+':';
        //         var s = mod%60;
        //         if(s == 0)
        //             str+="00";
        //         else if(s < 10)
        //             str+="0"+s;
        //         else
        //             str+=s;
        //         this.infoSeek.text(str);
        //         $('h1').append('--111 mod - '+ mod + 'this.pauseTime - '+ this.pauseTime + 'this.currentTime = '+this.currentTime + ' ----<br>');
        //     }
        //
        //     if(this.watched >= 1800 && now >= stop && !nextLiveTrue){
        //         nextLive = this.nextLive();
        //         console.log(nextLive);
        //         nextLiveTrue = true;
        //     }
        //     if(this.pointerTime >= 1800){
        //         $(document).trigger("custom.focusLive");
        //         Main.currentProgram = nextLive;
        //         this.progressBarLive(nextLive);
        //     }
        // }.bind(this), 500);
    },

    nextLive: function() {

        var nextDVR = null;
        var isLive = null;
        var dateNow = moment();
        var j = null;
        // console.log(Main.currentProgram);
        Main.currentChannelProgram.program.forEach(function (item, i){
            if(nextDVR || isLive)
                return;
            var stopDate = moment.unix(item.stop);
            var startDate = moment.unix(item.start);
            if(startDate.diff(dateNow) < 0 && dateNow.diff(stopDate) < 0){
                nextDVR = item;
                nextDVR.poster = Main.currentChannelProgram.poster;
                isLive = true;
            }
        }.bind(this));
        this.liveProgram = nextDVR;
        $(document).trigger("custom.nextLive");
        return nextDVR;
    },

    get_preview_at: function(timestamp_utc){
        var now = moment().unix();
        if(timestamp_utc > now - 5){
            // вернуть скриншот эфира
            console.log("---------ефир*-----------");
            return 'http://scr.iptv.iptvapi.net/' + Main.currentChannel.alias + '.jpg';
        }else{
            var closest_timestamp = String(timestamp_utc - (timestamp_utc % 20));
            console.log('--------'+closest_timestamp);
            dirname = closest_timestamp.substring(0, 4) + '/' + closest_timestamp.substring(4, 6) + '/' + closest_timestamp.substring(6, 7);
            return SCREENSHOT_SERVER  +'/'+ Main.currentChannel.alias + '/' + dirname + '/' + closest_timestamp +'.jpg'
        }
    },

    prviewControl: function (direction) {
        // this.seek.show();
        this.infoSeek.show();
        if(this.pointerTime > 125 && this.pointerTime < 1675){
            this.prview.css('left', (this.pointerTime-125)+'px');
        }else if(this.pointerTime > 1675){
            this.prview.css('left', '1550px');
        }else{
            this.prview.css('left', 0);
        }
        this.prview.show();
        var str;
        if(direction){
            str = '+';
        }else{
            str = '-';
        }
        str+= Math.floor(this.seekTime/60)+':';
        var s = this.seekTime%60;
        if(s === 0)
            str+="00";
        else
            str+=s;
        // this.seek.text(str)
        this.infoSeek.text(str)
    },

    ffPoint:function(start_time, end_time, live, width) {
        this.infoSeek.hide();
        this.seekTime = this.seekTime+20;
        var duration = end_time - start_time;
        var now  = moment().unix();
        // if(this.playingDVR){
            // var duration = this.getDuration();
            // var currentTimePlay = +this.currentTime;
            // this.seekView.attr('src', this.get_preview_at(start_time + (currentTimePlay/1000) + (this.seekTime+20)));
            // if(currentTimePlay+((this.seekTime+20)*1000)<duration+20000)
            //     this.seekTime = this.seekTime + 20;
            // this.pointerTime = ((currentTimePlay+ (this.seekTime*1000)) * width) / duration;
            //-----------

            this.currentPointerTime = (+this.currentTime  + this.positionDVR) + this.seekTime;
            // this.currentPointerTime = ((+this.currentTime / 1000) + this.positionDVR) + this.seekTime;//s
            if(this.currentPointerTime + start_time > end_time){
                this.currentPointerTime = end_time;
                this.seekTime = this.seekTime-20;
                //TODO next program
            }
            if(this.currentPointerTime + start_time > now){
                this.currentPointerTime = now - start_time;
                this.seekTime = this.seekTime-20;
            }
            // this.seekView.attr('src', this.get_preview_at(start_time + this.currentPointerTime));
            this.pointerTime = (this.currentPointerTime * width) / duration;
            // $('h1').html(' duration - '+ duration + ' this.currentPointerTime - '+ this.currentPointerTime + 'this.seekTime - '+ this.seekTime + 'this.pointerTime = '+this.pointerTime);
        $('h1').html('this.pointerTime ' + this.pointerTime);
        // }else{
        //     var now = moment().unix();
        //     if(this.allDelayTime === 0)
        //         return;
        //     if(this.seekTime > this.allDelayTime)
        //         this.seekTime = this.allDelayTime;
        //     this.currentPointerTime = now - start_time - this.allDelayTime + this.seekTime;
        //     // this.currentPointerTime = now - start_time - this.allDelayTime - this.seekTime;
        //     // this.seekView.attr('src', this.get_preview_at(start_time + this.currentPointerTime + this.seekTime));
        //     this.pointerTime = (this.currentPointerTime * width) / duration;
        //     $('h1').html(' duration - '+ duration + ' this.currentPointerTime - '+ this.currentPointerTime + 'this.seekTime - '+ this.seekTime + 'this.pointerTime = '+this.pointerTime);
        //
        // }
        if(this.pointerTime > 1800)
            this.pointerTime = 1800;
        live.width(this.pointerTime);
        this.prviewControl(true);
    },

    backPoint: function(start_time, end_time, live, width) {
        this.infoSeek.hide();
        this.seekTime = this.seekTime+20;
        var duration = end_time - start_time; //s

        // if(this.playingDVR){
            // var duration = this.getDuration();//ms
            // var currentTimePlay = +this.currentTime;
            // this.seekView.attr('src', this.get_preview_at(start_time + (currentTimePlay/1000) + (this.seekTime+20)));
            // this.pointerTime = ((currentTimePlay - (this.seekTime*1000)) * width)/(duration);
            //---------------

            // this.currentPointerTime = ((+this.currentTime/1000) + this.positionDVR) - this.seekTime;
            this.currentPointerTime = (+this.currentTime+ this.positionDVR) - this.seekTime;
        // $('h1').html(' this.currentTime - '+ this.currentTime + ' this.currentPointerTime - '+ this.currentPointerTime + ' this.positionDVR - '+this.positionDVR);
        if(this.currentPointerTime < 1){
            this.currentPointerTime = 1;
            this.seekTime = this.seekTime - 20;
        }
            // this.seekView.attr('src', this.get_preview_at(start_time + (this.currentPointerTime)));
            this.pointerTime = (this.currentPointerTime * width)/duration;
        $('h1').html('this.pointerTime ' + this.pointerTime);
        // }else{
        //     var now = moment().unix();
        //
        //     this.currentPointerTime = now - start_time - this.allDelayTime - this.seekTime;
        //     // this.seekView.attr('src', this.get_preview_at(start_time + (this.currentPointerTime)));
        //     this.pointerTime = (this.currentPointerTime * width)/duration;
        //     $('h1').html(' duration - '+ duration + ' this.currentPointerTime - '+ this.currentPointerTime + 'this.seekTime - '+ this.seekTime + 'this.pointerTime = '+this.pointerTime);
        //
        // }
        live.width(this.pointerTime);
        this.prviewControl(false);
    },

    ff: function () {
        if(!this.seekBack ){
            var start_Time = Main.currentProgram.start;
            var end_time = Main.currentProgram.stop;
            this.seekFF = true;
            clearTimeout(this.timer);
            var width = $('.timeline').width();
            var live = $('.progressBar .timeline_live');
            this.ffPoint(start_Time, end_time, live, width);
            this.progressBar('ff');

//             if(this.playingDVR){
//
//                 this.timer = setTimeout(function() {
//
// //                var currentTimePlay = this.mediaPlayer.getCurrentTime();
// //                var duration = this.mediaPlayer.getDuration();
//                     var currentTimePlay = +this.currentTime;
//                     // var duration = this.mediaPlayer.getDuration();
//                     var duration = this.getDuration();
//                     if((currentTimePlay+this.seekTime)>duration){
//                         this.nextDvrProgram();
//                         this.seek.hide();
//                         this.prview.hide();
//                         this.seekFF = false;
//                         this.seekTime = 0;
//                         return;
//                     }
//                     this.mediaPlayer.pause();
//                     this.mediaPlayer.jumpForward(this.seekTime);
//                     this.seekFF = false;
//                     this.seekTime = 0;
//                     this.seek.text('');
//                     this.mediaPlayer.resume();
//
// //                this.mediaPlayer.jumpForward(this.seekTime, function(){this.seekFF = false;this.seekTime = 0;  this.seek.text(''); c('+')}.bind(this));
//                     c('seek ff on '+this.seekTime);
// //                this.mediaPlayer.play();
//                     this.seek.hide();
//                     this.prview.hide();
//                     $('.timeline_watched').width(this.pointerTime);
//                 }.bind(this), 1000);
//             }else{

                this.timer = setTimeout(function() {
                    // if(this.playingDVR){
                    if(this.pointerTime >= 1800){
                        this.positionDVR = 0;
                        this.seekFF = false;
                        this.seekTime = 0;
                        this.seek.hide();
                        this.prview.hide();
                        this.nextDvrProgram(true);
                        return;
                    }
                    this.positionDVR = this.currentPointerTime;

                    // }else{
                    //     this.allDelayTime -= this.seekTime;
                    //     if(this.allDelayTime == 0 || this.allDelayTime < 0){
                    //         this.allDelayTime = 0;
                    //         Main.mainControl.controlPlayLive();
                    //         Player.playChannel(Main.currentChannel.id);
                    //         this.seek.hide();
                    //         this.prview.hide();
                    //         return;
                    //     }
                    // }

                    var now  = moment().unix();
                    if(!this.playingDVR && (this.currentPointerTime + Main.currentProgram.start) > (now - 10)){
                        this.currentPointerTime = now - Main.currentProgram.start;
                        Main.mainControl.controlPlayLive();
                        Player.playChannel(Main.currentChannel.id);

                        this.seekTime = 0;
                        $('.timeline_watched').width(this.pointerTime);
                        this.seek.hide();
                        this.prview.hide();
                        this.seekFF = false;
                        return;
                    }

                    // if(!this.playingDVR &&  this.currentPointerTime >= this.watched){
                    //     Main.mainControl.controlPlayLive();
                    //     Player.playChannel(Main.currentChannel.id);
                    //     this.seek.hide();
                    //     this.prview.hide();
                    //     return;
                    // }

                    apiService.get("mediaSeek", { programm_id: Main.currentProgram.programm_id, position: this.currentPointerTime, cdnToken :1, timeshift_abs: 1},function(data){
                        Player.stopPlayer();
                        this.mediaData = data.data;
                        Player.preparePlayer(this.mediaData.media_url);
                        $('.timeline_watched').width(this.pointerTime);
                        Player.play();
                        Player.currentTime = 0; //плеер ещё пару раз передаёт старый currentTime, по этому обнуляем, что б не дергался ползунок
                        // setTimeout(function () {
                            Player.seekFF = false;
                        // },700)
                        // this.seekFF = false;
                    }.bind(this));

                    this.seekTime = 0;
//                  this.mediaPlayer.play();
                    //this.play()?
                    this.seek.hide();
                    this.prview.hide();
                    if(!this.playingDVR)
                        this.progressBarLive();
                }.bind(this), 1500);
            // }
        }

    },

    rew: function () {
        if(!this.seekFF){
            var start_Time = Main.currentProgram.start;
            var end_time = Main.currentProgram.stop;
            this.seekBack = true;
            clearTimeout(this.timer);
            var width = $('.timeline').width();
            var live = $('.progressBar .timeline_live');
            this.backPoint(start_Time, end_time, live, width);

            this.progressBar('back');
            c('seek back on '+this.seekTime);

//             if(this.playingDVR ){
//                 this.timer = setTimeout(function() {
//                     this.mediaPlayer.pause();
//
// //                this.mediaPlayer.jumpBackward(this.seekTime, function(){this.seekBack = false;this.seekTime = 0; this.seek.text(''); c('-')}.bind(this));
//                     this.mediaPlayer.jumpBackward(this.seekTime);
//                     this.seekBack = false;
//                     this.seekTime = 0;
//                     this.seek.text('');
//                     c('-');
//                     c('seek '+this.seekTime);
// //                this.mediaPlayer.play();
//                     this.mediaPlayer.resume();
//                     this.seek.hide();
//                     this.prview.hide();
//                     $('.timeline_watched').width(this.pointerTime);
//                 }.bind(this), 1000);
//             }else{
                this.timer = setTimeout(function() {
                    // if(this.playingDVR){
                        this.positionDVR = this.currentPointerTime;
                        if(!this.playingDVR &&  this.pointerTime < this.watched){
                            Main.mainControl.controlPlayLiveSeek();
                        }
                    // }else {
                    //     this.allDelayTime += this.seekTime;
                    //     if (this.allDelayTime != 0) {
                    //         Main.mainControl.controlPlayLiveSeek();
                    //     }
                    // }
                    apiService.get("mediaSeek", { programm_id: Main.currentProgram.programm_id, position: this.currentPointerTime, cdnToken :1, timeshift_abs: 1},function(data){
                        Player.stopPlayer();
                        this.mediaData = data.data;
                        Player.preparePlayer(this.mediaData.media_url);
                        Player.play();
                        Player.currentTime = 0;
                        $('.timeline_watched').width(this.pointerTime);
                        // setTimeout(function () {
                            Player.seekBack = false;
                        // },1000)

                    }.bind(this));

                    this.seekTime = 0;
                    this.seek.hide();
                    this.prview.hide();
                    if(!this.playingDVR)
                        this.progressBarLive();
                }.bind(this), 1500);
            // }
        }
    },

    nextProgram: function () { $(document).trigger("custom.nextProgram");},

    prevProgram: function () { $(document).trigger("custom.prevProgram");},



    currentNextThree: function (next) {
        var programChannel;
        if(!next.nextThree.length){
            programChannel = {
                "live": true,
                "name": LocaleManager.tr('live'),
                "description" :LocaleManager.tr('live'),
                "channel_id": next.channel_id,
                "channelTitle": next.title,
                "channelIcon": next.channelIcon,
                "channelNumber": Main.channelNumber+1,
                "channelNumForm": next.channelNumForm,
                "is_free": next.is_free,
                "channel_parental_protect": next.channel_parental_protect
            };
        }else{
            var now = moment().unix();
            $.each(next.nextThree, function (i, item) {

                console.log(item.start)
                console.log(now)
                if(item.start <= now && now <= item.stop || now <= item.start && i === 0){

                    console.log(i);
                    programChannel = item;
                    programChannel.channelTitle = next.title;
                    programChannel.channelIcon = next.channelIcon;
                    programChannel.channelNumber = Main.channelNumber+1;
                    programChannel.channelNumForm = next.channelNumForm;
                    programChannel.is_free = next.is_free;
                    programChannel.channel_parental_protect = next.channel_parental_protect;
                    return;
                }
            });
        }
        return programChannel;
    },

    nextChannel: function () {
        clearTimeout(this.timerChangeChannel);
        Main.channelNumber++;

        if(Main.channelNumber == Main.channels.length)
            Main.channelNumber = 0;

        var next = Main.channels[Main.channelNumber];

        Main.infoblock.show(this.currentNextThree(next));

        this.timerChangeChannel = setTimeout( function() {

            Main.tv.checkChannel(next, function () {
                Main.prevChannel = Main.currentChannel;
                Main.currentChannel = next;
                Player.playChannel(Main.currentChannel.id);
                $(document).trigger("custom.prevChannel");
            }, function () {
                Main.updateChannelNumber();
                Main.infoblock.show(Player.currentNextThree(Main.currentChannel));
            });
//    		Main.infoblock.hide();

        }, 1000);
    },

    prevChannel: function () {
        clearTimeout(this.timerChangeChannel);

        Main.channelNumber--;

        if(Main.channelNumber < 0)
            Main.channelNumber = Main.channels.length-1;

        var next = Main.channels[Main.channelNumber];
        Main.infoblock.show(this.currentNextThree(next));

        this.timerChangeChannel = setTimeout( function() {
            Main.tv.checkChannel(next, function () {
                Main.prevChannel = Main.currentChannel;
                Main.currentChannel = next;
                Player.playChannel(Main.currentChannel.id);
                $(document).trigger("custom.prevChannel");
            }, function () {
                Main.updateChannelNumber();
                Main.infoblock.show(Player.currentNextThree(Main.currentChannel));
            });

        }, 1000);
    },

    choiceChannel: function (num) {
        if( this.choiceChannelNum.toString().length < 3 ){
            this.choiceChannelNum = (this.choiceChannelNum*10) + num;
            if(this.choiceChannelNum < Main.channels.length-1){
                clearTimeout(this.timerChangeChannel);
                Main.channelNumber = this.choiceChannelNum-1;
                var next = Main.channels[Main.channelNumber];
                next.channelNumForm = true;
                Main.infoblock.show(this.currentNextThree(next));
                this.timerChangeChannel = setTimeout( function() {
                    Player.choiceChannelNum = '';
                    Main.tv.checkChannel(next, function () {
                        Main.prevChannel = Main.currentChannel;
                        Main.currentChannel = next;
                        Player.playChannel(Main.currentChannel.id);
                        $(document).trigger("custom.prevChannel");
                        next.channelNumForm = false;
                        Main.infoblock.show(Player.currentNextThree(Main.currentChannel))
                    }, function () {
                        Main.updateChannelNumber();
                        Main.infoblock.show(Player.currentNextThree(Main.currentChannel));
                    });

                }, 1500);
            }else{
                this.choiceChannelNum = '';
                this.choiceChannel(num);
                //TODO popup no find channel
            }
        }else{
            this.choiceChannelNum = '';
            this.choiceChannel(num);
        }
    }

};

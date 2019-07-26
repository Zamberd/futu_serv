// LoadBar = {
// 	isVisible: false,
// 	container: null,
// 	show: function(){
// 		if (this.isVisible)
// 			return;
// 		if(this.container == null) {
//             this.container = $('<div class="loader"><div class="one"></div><div class="two"></div></div>');
//             $('body').append(this.container);
//         }
// 		this.isVisible = true;
// 		this.container.show();
//         this.animate();
// 	},
//
// 	hide: function(){
// 		// this.isVisible = false;
// 		// this.container.hide();
// 	},
//
// 	animate: function () {
//         var self = this;
// 		$('.one', this.container).animate({
//             opacity: 1,
//         }, {
//             progress: function(anim, progress) {
//                 $(this).css('-webkit-transform','scale('+(progress * 50)+')');
//                 if (progress > .33)
//                     $(".two", self.container).css('-webkit-transform','scale('+((progress-.33) * 75)+')');
//                 else
//                     $(".two", self.container).css('-webkit-transform','scale(0)');
//             },
//             duration: 1000,
//             easing: "linear",
//             done: function () {
//                 if (self.isVisible)
//             		self.animate();
//             }
//         });
//     }
// };
SplashScreen = {
    isVisible: false,
    container: null,
    show: function(){
        this.isVisible = true;
        this.container.show();
    },

    hide: function(){
        this.isVisible = false;
        $('#splashScreen').hide();
    }
};

LoadBar = {
    isVisible: false,
    container: null,
    timer: null,
    show: function(){
        if (this.isVisible)
            return;
        if(this.container == null) {
            this.container = $('<div class="loader"><ul>\n' +
                '        <li><img src="img/loadbar/01.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/02.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/03.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/04.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/05.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/06.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/07.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/08.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/09.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/10.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/11.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/12.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/13.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/14.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/15.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/16.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/17.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/18.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/19.png" alt=""></li>\n' +
                '        <li><img src="img/loadbar/20.png" alt=""></li>\n' +
                '    </ul></div>');
            $('body').append(this.container);
            this.listContainer = this.container.find('ul');
        }
        this.isVisible = true;
        this.container.show();
        this.animate();
    },

    hide: function(){
        this.isVisible = false;
        clearInterval(this.timer);
        this.container.hide();
    },

    animate: function () {
        var self = this;
        this.timer = setInterval(function () {
            var current = self.listContainer.find(".show") || self.listContainer.find(":first");
            var next = current.next();
            if(!next.length){
                next = self.listContainer.find(":first");
            }
            current.removeClass("show").hide();
            next.addClass("show").show();
        },100);
    }
};

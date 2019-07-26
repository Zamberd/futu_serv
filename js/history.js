History = {

    items: null,

    getChannelId: function(){
        // return localStorage.lastChannel;
        return localStorage.getItem("lastChannel");
    },

    setLastChannle: function (item) {
        // localStorage.lastChannel = item;
        localStorage.setItem("lastChannel", item);
    },

    getLastChannelItem: function () {
        $('h1').html('getChannelId');
        var temp = this.getChannelId();
        $('h1').html('parse id channel');
        temp = JSON.parse(temp);

        if(!temp){
            return false;
        }else{
            return temp;
        }
    },

    setLastChannelItem: function (lastChannel) {
        $('h1').html(lastChannel + '<br>');
        this.setLastChannle(lastChannel);
    },

    getHistory: function(){
        var tempLog = localStorage.history; // get history

        if(tempLog == null){
            return null;
        }
        tempLog = '['+tempLog+'{}]';
        this.items = JSON.parse(tempLog);
        if(this.items.length > 21)
            return this.removeOldHistory();
        else
            return this.items;
    },

    removeOldHistory: function(){
        this.items = this.items.slice(0,20);
        var tempNewHistory;
        for(var i = 0; i < this.items.length; i++){
            if(!tempNewHistory)
                tempNewHistory = JSON.stringify(this.items[i])+','
            else
                tempNewHistory += JSON.stringify(this.items[i])+',';
        }
        localStorage.history = tempNewHistory;
        return this.getHistory();
    },

    lastProgram: function(){
        var temp = this.getHistory();
        if(temp == null)
            return Main.channels[0];

        return temp[0];
    },

    pushProgram: function(currentItemProgram){
        var storage = localStorage.history; //get history
        if(storage == null){
            storage = JSON.stringify(currentItemProgram)+','
        }
        else{
            storage = JSON.stringify(currentItemProgram)+','+storage;
        }
//		localStorage.setItem("history", storage);
        localStorage.history = storage;
    },

    getAspectRatio: function(){
        var aspectRatio = localStorage.aspectRatio;
        if( aspectRatio == null || aspectRatio == 0)
            return false;
        else
            return true;
    },

    setAspectRatio: function (aspectRatio) {
        if(aspectRatio == true){
            localStorage.aspectRatio = 1;
        }else{
            localStorage.aspectRatio = 0;
        }
    }

};

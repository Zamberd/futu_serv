API_URL = "http://futurama1.000webhostapp.com";
DEFAULT_API_URL = "http://futurama1.000webhostapp.com";
function APIService() {
    this.request = null;
    this.dataConfig =  {
		"tvChannels" : {
			"url" : "/channelList.php"
		},
		"tvPrograms" : {
			"item_id": "item_id",
			"afterDays": "afterDays",
			"beforeDays": "beforeDays",
			"url" : "/deviceAPI/getTVChannel"
		},
		"complaints" : {
			"url" : "/deviceAPI/complaintsList"
		},
		"sendComplaint":{
			"id": "id",
			"url": "http://digiline.co/test_task/json/okStatus.json"
		},
		"radio" :{
			"url" : "/deviceAPI/getAllRadioChannels"
		},
		"media":{
			"id": "id",
			"url": "/deviceAPI/media"
		},
		"mediaDVR":{
            "id": "channelId",
			"programm_id": "programm_id",
			"url": "/deviceAPI/media/dvr/"
		},
        "mediaSeek":{
            "programm_id": "programm_id",
            "url": "/deviceAPI/media/dvr/",
			"position": "position",
			"cdnToken" : "cdnToken",
			"timeshift_abs": "timeshift_abs"
        },
		"checkKey":{
			"password": "password",
			"url": "/deviceAPI/checkParentalProtectPassword"
		},
		"setKey":{
			"old_password": "old_password",
			"new_password": "new_password",
			"url": "/deviceAPI/setParentalProtectPassword"
		},
		"getCitiesWeatherList":{
			"url": "/weather/getCities"
		},
		"weatherCity":{
			"cityId": "cityId",
			"url": "/weather/getWeather"
		},
		"bind":{
			"code": "code",
			"url": "/deviceAPI/bind"
		},
		"logout":{
			"url": "/deviceAPI/logout"
		},
		"userProfile": {
			"url": "/deviceAPI/userProfile"
		},
		"auth": {
			"url": "/deviceAPI/auth"
		},
	};
}

APIService.prototype.get = function(name, params, callback) {

	c(this.dataConfig[name]['id'])
	var filteredParams = {};
	if(typeof params == 'function'){
		callback = params;
	} else {
		$.each(params, function(key, value) {
        	if (key == "url") 
        		return true;
        	filteredParams[this.dataConfig[name][key]] = params[key];
    	}.bind(this));
	}
	c('APIService get: '+ name + ' params:'+ JSON.stringify(filteredParams));
	if(this.dataConfig[name]){
		if(name == "tvPrograms"){
			if(this.request){
				this.request.abort();
				c('abort')
			}

			this.request  = $.ajax({
				  url: API_URL + this.dataConfig[name].url,
				  dataType: "json",
				  data:  $.extend({},{"afterDays": 2,"beforeDays": 2},filteredParams, DEFAULT_AJAX_DATA),
				  success: function(data){ 	callback(data); },
				  error: function(jqXHR, textStatus, errorThrown){	c('textStatus '+textStatus);callback(false); }
				});
		}else if(name == "mediaDVR"){
            $.ajax({
                url: API_URL + apiService.dataConfig[name].url +  filteredParams.programm_id,
                data: $.extend({}, DEFAULT_AJAX_DATA, filteredParams),
                context: this,
                success: function(obj) {
                    console.log(obj);
                    callback(obj);
                }
            });
		}else if(name == "mediaSeek"){
            $.ajax({
                url: API_URL + apiService.dataConfig[name].url +  filteredParams.programm_id,
                data: $.extend({}, DEFAULT_AJAX_DATA, filteredParams),
                context: this,
                success: function(obj) {
                    console.log(obj);
                    callback(obj);
                }
            });
        }else{
// beforeSend: function(xhrObj){
//                 	xhrObj.setRequestHeader("Origin", "not_null");
//                     xhrObj.setRequestHeader("Accept","application/json");},
			$.ajax({
                
				url: API_URL + this.dataConfig[name].url,
				dataType: "json",
				crossDomain: true,
				data:  $.extend({},filteredParams, DEFAULT_AJAX_DATA),
				success: function(data){ callback(data); },
				error: function(jqXHR, textStatus, errorThrown){  c('textStatus '+textStatus); callback(false); }

			});
		}
	} else 
		return false;
	return true;
};

APIService.prototype.post = function(name, params, callback) {
	c(this.dataConfig[name]['id'])
	var filteredParams = {};
	if(typeof params == 'function'){
		callback = params;
	} else {
		$.each(params, function(key, value) {
        	if (key == "url") 
        		return true;
        	filteredParams[this.dataConfig[name][key]] = params[key];
    	}.bind(this));
	}
	c('APIService post: '+ name + ' params:'+ JSON.stringify(filteredParams));
	if(this.dataConfig[name]){
		if(name == "bind"){
			$.ajax({
				  url: API_URL + this.dataConfig[name].url,
				  type: "POST",
				  dataType: "json",
				  data:  $.extend({},filteredParams, DEFAULT_AJAX_DATA), 
				  success: function(data){ callback(data); },
				  error: function(jqXHR, textStatus, errorThrown){  c('textStatus '+textStatus); c(jqXHR); callback(jqXHR.responseJSON); }
				});
		}
	} else 
		return false;
	return true;
};

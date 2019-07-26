LocaleManager = {
	defaultLocale: "uk",
	lang: 0,
	refresh: false,

	changeLang: function(id){
		if(this.lang != id){
			this.lang = id;
			DEFAULT_AJAX_DATA.lang = this.langs[id];
			this.saveLang(this.lang);
            Main.changeLang = true;
			$(document).trigger("custom.changeLang");
			this.refresh = true;
			moment.locale(''+LocaleManager.langs[LocaleManager.lang]+'')
		}
		else
			return false;
	},

	saveLang: function (lang){
        localStorage.language = lang;
		// localStorage.setItem("language", lang);
	},

	getLang: function (){
		// this.lang = parseInt(localStorage.getItem("language")) || this.lang;
		this.lang = localStorage.language || this.lang;
		return this.lang;
	},

    // saveLang: function (lang){
    //     localStorage.lang = lang;
    // },
    // getLang: function (){
    //     var item = localStorage.lang;
    //     this.lang = item || this.lang;
    //     return this.lang;
    // }

    langs: ['uk','ru'],//en
	
    dict: { 
    	authTitle: ['Введіть код авторизації','Введите код авторизации'],//Enter authorization code
    	authDescr: ['Дізнайтеся код активації у вашого оператора','Узнайте код активации у вашего оператора'],//Ask your provider about activation code

        tv: ['Телеканали','Телеканалы'],//TV channels

    	date: ['Дата','Дата'],//Date
    	programFor: ['Програма на','Программа на'],//Program for
    	programFor2: ['для','для'],//for
    	history: ['Історія','История'],//History



    	complain: ['Скаржитися','Жаловаться'],//Complain
    	complainSend: ['Надіслати скаргу','Отправить жалобу'],//Send complaint
    	complainSend2: ['Відправляю скаргу...','Отправляю жалобу...'],//I am sending a complaint ...
    	complainSend3: ['Скарга відправлена','Жалоба отправлена'],//Complaint sent
    	complainSend4: ['Не вдалося відправити скаргу','Не удалось отправить жалобу'],//Unable to send complaint
    	
    	warning: ['Шановний користувач','Уважаемый пользователь'],//Dear user
    	disconnected: ['Відсутнє підключення до інтернету','Отсутствует подключение к интернету'],//No internet connection
    	newKeySave: ['Новий пароль збережений','Новый пароль сохранен'],//The new key has been saved
    	notSetPassword: ['Помилка, новий пароль не збережено.','Ошибка, новый пароль не сохранен.'],//Error, new key not saved.
    	
    	settings: ['Налаштування','Настройки'],//Settings
		cab: ['Особистий кабінет','Личный кабинет'],//Account
		menuChangePass: ['Батьківський контроль','Родительский контроль'],//Parental Control
		exit: ['Вийти','Выйти'],//Logout
		bind: ['Авторизація','Авторизация'],//Authorization
		profile: ['Номер договору','Номер договора'],//Contract Number
		tariff: ['Тарифні плани','Тарифные планы'],//Tariffs
		paid: ['Діє до','Действует до'],//End Date
		

    	lang: ['Мова','Язык'],//Language
    	langTitle: ['Українська','Русский'],//English
    	
    	messageauthError: ['Помилка авторизації.','Ошибка авторизации.'],//Authorisation Error.
    	
    	dearUser: ['Шановний користувач','Уважаемый пользователь'],//Dear user
    	upsellMessage1: ['Даний контент доступний в тарифному плані ','Данный контент доступен в тарифном плане '],//This content avaliable in tariff plan
    	upsellMessage2: [' всього за ',' всего за '],//only for
    	upsellMessage3: [' грн./міс.',' грн./мес.'],// rub./month.
    	
    	errorPlayDVR: ['Вибачте, дана програма недоступна. Відтворити канал?','Простите, данная программа недоступна. Воспроизвести канал? '],//Sorry, the current program is not available. Play the channel?
    	exitApp: ['Ви дійсно хочете вийти?','Вы действительно хотите выйти?'],//Do you really want to leave?
    	errorPlay: ['Помилка, не вдалося відтворити відео','Ошибка, не удалось воспроизвести видео'],//Error, could not play video
	
    	enterPass: ['Введіть пароль','Введите пароль'],//Enter password
		enterPassTitle: ["Введіть пароль батьківського контролю", "Введите пароль родительского контроля"],//Enter Parental Control Password
        changePass: ["Змінити пароль батьківського контролю", "Сменить пароль родительского контроля"],//Change Parental Control Password
        enterOldPass: ['Введіть старий пароль','Введите старый пароль'],//Enter old password
        enterNewPass: ['Введіть новий пароль','Введите новый пароль'],//Enter a new password
        errorPass: ['Пароль введено невірно!','Пароль введен неверно!'],//Password entered incorrectly


    	limiteTimePause: ['Час паузи перевищено!','Время паузы превышено!'],//The pause time has been exceeded!
    	
    	unBindDevice: ["Ви дійсно хочете відв'язати пристрій?",'Вы действительно хотите отвязать устройство?'],//Unbind the device?
    	unBind: ["Відв'язати","Отвязать"],//Unbind
    	today:['Сьогодні','Сегодня'],

    	live: ['Прямий ефір','Прямой эфир'],//Live
    	continu: ['Продовжити','Продолжить'],//Continue
    	onAir: ['В ефір','В эфир'],//To live
		ok: ['OK','ОК'],
		yes: ['Так','Да'],//Yes
		cancel: ['Відміна','Отмена']//Cancel



		
		
        
        
	},
	
	tr: function(str){
//		lang = lang || this.langs[this.defaultLocale];
		
		return this.dict[str][this.lang];
	}
}
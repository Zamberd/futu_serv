function c (mess) {
	console.log(mess);
	// var cont = $("#console");
	// if (cont.length == 0)
	// 	cont = $('<div id="console" class="console" />').appendTo('body');
	// cont[0].innerHTML += ('<br>-->'+mess);
}
function getItemById( items, id) {
	var element;
	items.forEach(function (Item, i , items){
		if(Item.id == id){
			element = items[i];
		}
	});
	return element;
}
//@needId - нужно ли визвращать порядковый номер программы
function getItemByProgramId( items, id, needId) {
    var element, j;
    items.forEach(function (Item, i , items){
        if(Item.programm_id == id){
            element = items[i];
            if(needId)
                j = i;
        }
    });
    if(needId)
        return {program: element, id: j};
    else
        return element;
}
function sortByGenre(channels, genres) {
	var sortChannels = [];
	var k = 0;
	genres.forEach( function(genre, j, Genres){
		channels.forEach( function(channel, i, items){
			if(channel.genres[0] == genre.id){
				sortChannels[k] = channel;
				k++;
			}
		});
	});
	return sortChannels;
}
function subStr (str, count) {
	var newStr = str.substring(0, count);
	newStr += "...";
	return newStr;
}
function SupportsCSS(property, value) {
    // Создаём элемент
    var element = document.createElement('span');
    // Проверяем, поддерживает ли браузер данное свойство
    if (element.style[property] !== undefined)
        element.style.cssText = property + ':' + value; // Вносим новое свойство в style элемента
    else
        return false; // Если браузер не поддерживает свойство, то возвращаем false
    // Если браузер поддерживает данное значение для указанного свойства, то значения будут равны
    return element.style[property] === value;
};


function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[#&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);   
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function apiCall(type, url, params = []) {
	var accessToken = getParameterByName('access_token');
	url += '/?access_token=' + accessToken;
	return $.ajax({
		type: type,
		contentType: "application/json",
		data: params,
		url: 'https://api.mercadolibre.com/' + url,
		dataType: "json"
	});
}

function getListedItemIds(offset, callback) {
	var user = apiCall('GET', 'users/me');
	user.done(function (data){
		var user_id = data.id;
		getItemIds(offset, user_id, callback)
	});
	user.fail(function (data){console.log(data)});
}

function getItemIds(offset, user_id, callback) {
	var itemsIds;
	params = {
		orders: 'start_time_desc',
		status: 'active',
		offset: offset
	}
	itemsIds = apiCall('GET', 'users/' + user_id +'/items/search', params);
	itemsIds.done(callback);
	itemsIds.fail(function (data){console.log(data)});
}

function getListedItems(offset ,callback) {
	var items;
	getListedItemIds(offset, function (data) {
		ids = data.results.join();
		if (ids) {
			ids = data.results.join();
			params = {
				ids: ids
			}
			items = apiCall('GET', 'items', params);
			items.done(callback);
			items.fail(function (data){console.log(data)});
		} else {
			console.log("No hay items");
			callback('');
		}
	})
}

function getItems(items, callback) {
	params = {
		ids: items
	}
	items = apiCall('GET', 'items', params);
	items.done(callback);
	items.fail(function (data){console.log(data)});
}

function getVariationPictures(pictures) {
	var size = pictures.length;
	var varitationPictures = [];
	for (var i = 0; i < size; i++) {
		varitationPictures.push(pictures[i].id);
	}
	return varitationPictures;
}


function putVariation(item, variation, callback) {
	var item = item;
	var variation = variation;
	var variation_name = variation['name'];
	var size = (Object.keys(variation).length -1) / 2;
	var jsonVariation = [];
	var varitationPictures = getVariationPictures(item.pictures);
	for (var i = 1; i <= size; i++) {
		var value = 'variationValue_' + i;
		var qty = 'variationQty_' + i;
		jsonVariation.push(
			{
				"seller_custom_field" : variation_name + ' - ' + variation[value],
	            "price": item.price,
	            "available_quantity": variation[qty],
	            "attribute_combinations": [
	                {
	                    "name": variation_name,
	                    "value_name": variation[value]
	                }
	            ],
	            "picture_ids": varitationPictures
			}
		); 
	}
	console.log(jsonVariation);
	var params = {
		variations: jsonVariation
	}
	item = apiCall('PUT', 'items/' + item.id, JSON.stringify(params));
	item.done(function (data){callback(200, data, '.listing')});
	item.fail(function (data){callback(400, data, '.listing')});
}

function postItem(values, callback) {
	var size = (Object.keys(values).length -5) / 2;
	console.log(values.category_id);
	item = {
   		title: values.title,
   		category_id: values.category_id,
   		price: values.price,
   		currency_id:"ARS",
   		buying_mode:"buy_it_now",
   		listing_type_id:"bronze",
   		condition:"new",
   		description: values.description,
	   	variations:[]
	}
	for (var i = 1; i <= size; i++) {
		var value = 'variationValue_' + i;
		var qty = 'variationQty_' + i;
		item.variations.push(
			{
				"seller_custom_field" : values.name + ' - ' + values[value],
	            "price": item.price,
	            "available_quantity": values[qty],
	            "attribute_combinations": [
	                {
	                    "name": values.name,
	                    "value_name": values[value]
	                }
	            ],
	            picture_ids:[
		          "https://s-media-cache-ak0.pinimg.com/736x/63/9c/a0/639ca03b5ca79e73002b4f2d4776d03b.jpg"
		      	]
			}
		); 
	}
	var params = item;
	item = apiCall('POST', 'items', JSON.stringify(params));
	item.done(function (data){callback(200, data, '.create-item')});
	item.fail(function (data){callback(400, data, '.create-item')});
}

function newItem(values, callback) {
	items = apiCall('GET', 'sites/MLA/category_predictor/predict?title=' + values.title);
	items.done(function (data){
		values.category_id = data.id;
		postItem(values, callback);
	});
	items.fail(function (data){callback(400, data, '.create-item')});
}


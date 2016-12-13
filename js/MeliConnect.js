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

function getListedItemIds(callback) {
	var itemsIds;
	params = {
		orders: 'start_time_desc',
		status: 'active'
	}
	itemsIds = apiCall('GET', 'users/229819204/items/search', params);
	itemsIds.done(callback);
	itemsIds.fail(function (data){console.log(data)});
}

function getListedItems(callback) {
	var items;
	getListedItemIds(function (data) {
		ids = data.results.join();
		params = {
			ids: ids
		}
		items = apiCall('GET', 'items', params);
		items.done(callback);
		items.fail(function (data){console.log(data)});
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
	var params = {
		variations: jsonVariation
	}
	item = apiCall('PUT', 'items/' + item.id, JSON.stringify(params));
	item.done(function (data){callback(200, data)});
	item.fail(function (data){callback(400, data)});
}

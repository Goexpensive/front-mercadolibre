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

function putVariation(item, variation) {
	var item = item;
	var variation = variation;
	var variation_name = variation['name'];
	var size = (Object.keys(variation).length -1) / 2;
	var jsonVariation = [];
	for (var i = 1; i <= size; i++) {
		var value = 'variationValue_' + i;
		var qty = 'variationQty_' + i;
		jsonVariation.push(
			{
				"seller_custom_field" : variation_name + ' - ' + variation[value],
	            "price": 1000,
	            "available_quantity": variation[qty],
	            "attribute_combinations": [
	                {
	                    "name": variation_name,
	                    "value_name": variation[value]
	                }
	            ]
			}
		); 
	}
	var params = {
		variations: jsonVariation
	}
	console.log(jsonVariation);
	console.log(item.id);
	item = apiCall('PUT', 'items/' + item.id, JSON.stringify(params));
	item.done(function (data){console.log(data)});
	item.fail(function (data){console.log(data)});
}

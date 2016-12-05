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

function putVariation(form) {
	var item;
	console.log(form);
	var variation = [
	        {
	            "seller_custom_field" : "Blanco-1234",
	            "price": 1000,
	            "available_quantity": 3,
	            "attribute_combinations": [
	                {
	                    "name": "Cara de Papa",
	                    "value_name": "Blanco"
	                }
	            ]
	        },
	        {
	            "seller_custom_field" : "Negro-1234",
	            "price": 1000,
	            "available_quantity": 3,
	            "attribute_combinations": [
	                {
	                    "name": "Cara de Papa",
	                    "value_name": "Negro"
	                }
	            ]
	        }
    ];
	var params = {
		variations: variation
	}
	item = apiCall('PUT', 'items/MLA644830340', JSON.stringify(params));
	item.done(function (data){console.log(data)});
	item.fail(function (data){console.log(data)});
}

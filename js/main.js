var itemToModify = {};

function createItemList(data){
	var item = [];
	var html = '<tbody>';
	var $activeItems = $('.active-items');
	for(var i = 0; i < data.length; i++){
		pictureSrc = 'img/wrong.png'
		if(data[i].pictures[0]){
			pictureSrc = data[i].pictures[0].url
		}
		html += '<tr>';
		html += '<td> <img height="40" width="40" src="' + pictureSrc + '"></td>';
		html += '<td>' + data[i].id + '</td>';
		html += '<td>' + data[i].title + '</td>';
		html += '<td>' + data[i].available_quantity + '</td>';
		html += '<td>' + data[i].price + '</td>';
		html += '<td><button class="btn btn-default variations" id=' + i +' type="submit">Variation</button></td>';
		html += '</tr>'
	}
	html += '</tbody>';
	$activeItems.children('tbody').remove();
	$activeItems.append(html);
	$('.table-item').hide();
	$('.form-item').hide();
	$activeItems.show();
	$('.variations').bind('click', function(){
		createTableVariation(data[$(this).attr('id')]);
	});
}

function createTableVariation(data){
	var item = data;
	var variation = data.variations;
	var table = '<tbody>';
	for(var i = 0; i < variation.length; i++){
		table += '<tr>';
		table += '<td>' + variation[i].id + '</td>';
		table += '<td>' + variation[i].price + '</td>';
		table += '<td>' + variation[i].available_quantity + '</td>';
		table += '<td>' + variation[i].attribute_combinations[0].name + '</td>';
		table += '<td>' + variation[i].attribute_combinations[0].value_name + '</td>';
		table += '<td>' + variation[i].id + '</td>';
		table += '</tr>';

	}
	table += '</tbody>';
	$('.active-items').hide();
	$('.form-item').hide();
	$('.table-item table').empty();
	$('.table-item h2').text(item.id + ' ' + item.title);
	$('.table-item table').append(table);
	$('.table-item').show();
	$('.table-item button.create').bind('click', function() {
		createForm(item);
	});
}

function createForm(item){	
	$('.table-item').hide();
	$('.form-item h2').text(item.id + ' ' + item.title);
	$('.form-item').show();
	itemToModify = item;
}

function addVariationInput(){
	var inputs = ($('#variation-form :text').length -1) / 2;
	var $last = $('#variation-form input:last');
	var id = inputs + 1;
	var value = '<label for="variationValue_' + id + '">' + id + '- Variation Value</label>';
	value += '<input type="text" class="form-control" name="variationValue_' + id + '" id="variationValue_' + id + '">'; 					
	var quantity = '<label for="variationQty_' + id + '">' + id + '- Variation Qty</label>';
	quantity += '<input type="text" class="form-control" name="variationQty_' + id + '" id="variationQty_' + id + '">';		
	$last.after(value + quantity);
	console.log(inputs);
	console.log($last);
}

function removeVariationInput(){
	for (var i = 0; i < 2; i++) {
		var $last = $('#variation-form input:last');
		var $label = $('label[for="'+$last.attr('id')+'"]');
		$last.remove();
		$label.remove();
	}
}

function showResult(status, data) {
	if(status == 200) {
		$('.form-item').hide();
		$('#success-box').show();
		console.log(data);
	} else {
		$('.form-item').hide();
		$('#danger-box').show();
		console.log(data);
	}
}

$(document).ready(function() { 
	$('.active-items').hide();
	$('.table-item').hide();
	$('.form-item').hide();
	$('#success-box').hide();
	$('#danger-box').hide();
	$('#publicaciones').bind('click', function() {
		getListedItems(createItemList)
	});
	$('#search-items-button').bind('click', function() {
		var items = $('#search-items-text').val();
		if(items) {
			getItems(items, createItemList)
		}
	});

	$('#variation-form').submit(function(event) {
	    // get all the inputs into an array.
	    event.preventDefault();
	    var values = {};
	    $.each($('#variation-form').serializeArray(), function(i, field) {
    		values[field.name] = field.value;
		});
		putVariation(itemToModify, values, showResult);
		itemToModify = null;
		$("form").trigger("reset");

	});

	$('.adding-button').bind('click',addVariationInput);
	$('.minus-button').bind('click',removeVariationInput);
});



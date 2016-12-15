var itemToModify = {};
var offset = 0;

function createItemList(data){
	var item = [];
	var html = '<tbody>';
	var $listing = $('.listing');
	var $table = $listing.children('table');
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
	$table.children('tbody').remove();
	$table.append(html);
	mainActions();
	$listing.show();
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
		table += '<td class="text-center">' + variation[i].id + '</td>';
		table += '<td class="text-center">' + variation[i].price + '</td>';
		table += '<td class="text-center">' + variation[i].available_quantity + '</td>';
		table += '<td class="text-center">' + variation[i].attribute_combinations[0].name + '</td>';
		table += '<td class="text-center">' + variation[i].attribute_combinations[0].value_name + '</td>';
		table += '</tr>';

	}
	table += '</tbody>';
	mainActions();
	$('.table-item table').children('tbody').remove();
	$('.table-item h2').text(item.id + ' ' + item.title);
	$('.table-item table').append(table);
	$('.table-item').show();
	$('.table-item button.create').bind('click', function() {
		createForm(item);
	});
	var link = 'https://vender.mercadolibre.com.ar/item/update?itemId=' + item.id;
	$('.table-item a.edit').attr("href", link);
	$('.table-item a.delete').attr("href", link);
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
		$('#success-box').children('p').children('a').attr("href", data.permalink);
		$('#success-box').show();

		console.log(data.permalink);
	} else {
		$('.form-item').hide();
		$('#danger-box').show();
		console.log(data);
	}
}

function submitForm(event, form, type) {
	event.preventDefault();
    var values = {};
    console.log(form);
    $.each(form.serializeArray(), function(i, field) {
		values[field.name] = field.value;
	});
	if(type == 'put') {
		putVariation(itemToModify, values, showResult);
	}
	if(type == 'post') {
		postItem(values, showResult);
	}
	itemToModify = null;
	$("form").trigger("reset");
}

function hideAll() {
	$('.main-actions').hide();
	$('.listing').hide();
	$('.table-item').hide();
	$('.form-item').hide();
	$('.create-item').hide();
	$('#success-box').hide();
	$('#danger-box').hide();
}

function mainActions() {
	$('.main-actions').show();
	$('.listing').hide();
	$('.table-item').hide();
	$('.form-item').hide();
	$('.create-item').hide();
	$('#success-box').hide();
	$('#danger-box').hide();
}

$(document).ready(function() {

    $("[data-hide]").on("click", function(){
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });
	hideAll();
	
	var accessToken = getParameterByName('access_token');
	if (accessToken) {
		$('.intro').hide();
		mainActions();

	}
	$('#new').bind('click', function() {
		mainActions();
		$('.create-item').show();
	});
	$('#publicaciones').bind('click', function() {
		offset = 0;
		getListedItems(offset, createItemList);
	});
	$('#search-items-button').bind('click', function() {
		var items = $('#search-items-text').val();
		if(items) {
			getItems(items, createItemList)
		}
	});
	$('.next').bind('click',function() {
		offset += 50;
		getListedItems(offset, createItemList);
		console.log(offset);
	});
	$('.previus').bind('click',function() {
		offset -= 50;
		console.log(offset);
		getListedItems(offset, createItemList);
	});
	$('.back-to-listing').bind('click',function() {
		mainActions();
		$('.listing').show();
	});
	$('#variation-form').submit(function(event) {
	    submitForm(event, $(this), 'put');
	});
	$('#new-item-form').submit(function(event) {
	    submitForm(event, $(this), 'post');
	});
	$('.adding-button').bind('click',addVariationInput);
	$('.minus-button').bind('click',removeVariationInput);
});



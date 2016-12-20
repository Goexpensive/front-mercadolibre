var itemToModify = {};
var offset = 0;

function createItemList(data){
	var item = [];
	var html = '';
	var $listing = $('.listing');
	var $rowHeader = $('.listing .row.details');
	for(var i = 0; i < data.length; i++){
		pictureSrc = 'img/wrong.png'
		if(data[i].pictures[0]){
			pictureSrc = data[i].pictures[0].url
		}
		html += '<div class="row details">';
		html += '<div class="col-xs-2 image"><img alt="Bootstrap Image Preview" src="' + pictureSrc + '" class="img-circle publication-img"></div>';
		html += '<div class="col-md-3 hidden-xs hidden-smpublication"><a href="' + data[i].permalink + '">' + data[i].id + '</a></div>';
		html += '<div class="col-xs-5 col-md-3 title">' + data[i].title + '</div>';
		html += '<div class="col-md-1 hidden-xs hidden-sm stock">' + data[i].available_quantity + '</div>';
		html +=	'<div class="col-md-1 hidden-xs hidden-sm price">'+ data[i].price + '</div>';
		html += '<div class="col-xs-2 col-md-2"><button class="btn btn-default variations" id=' + i +' type="submit">Ver variaciones</button></div>';
		html += '</div>'
	}
	$rowHeader.remove();
	$listing.append(html);
	mainActions();
	$listing.show();
	$('.variations').bind('click', function(){
		createTableVariation(data[$(this).attr('id')]);
	});
}

function createTableVariation(data){
	var item = data;
	var variation = data.variations;
	var $tableItem = $('.table-item');
	var $rowHeader = $('.table-item .row.details');
	var html = '';
	if (variation[0]) {
		html += '<div class="row details">';
		html += '<div class="col-xs-2 title">' + variation[0].attribute_combinations[0].name + '</div>';
		html += '<div class="col-xs-2 price">' + variation[0].price + '</div>';
		html += '<div class="col-xs-8 variations"><ul>';
		for(var i = 0; i < variation.length; i++){
			html += '<li>' + variation[i].attribute_combinations[0].value_name + '</li>';
		}
		html += '</ul></div></div>';
	};
	mainActions();
	$rowHeader.remove();
	$tableItem.find('h1').html('<span class="hidden-xs">Variaciones de </span>#' + item.id);
	$tableItem.append(html);
	$tableItem.show();
	$tableItem.find('button.create').bind('click', function() {
		createForm(item);
	});
	var link = 'https://vender.mercadolibre.com.ar/item/update?itemId=' + item.id;
	$tableItem.find('a.edit').attr("href", link);
}

function createForm(item){	
	$('.table-item').hide();
	$('.form-item h2').text(item.id + ' ' + item.title);
	$('.form-item').show();
	itemToModify = item;
}

function addVariationInput(button){
	var id = button.parent().attr('id');
	if (id == 'variation-form') {
		otherInputs = 1;
	} else {
		otherInputs = 4;
	}
	var inputs = ($('#' + id +' :text').length - otherInputs) / 2;
	var $last = $('#' + id +' input:last');
	var id = inputs + 1;
	var value = '<label for="variationValue_' + id + '">' + id + '- Variation Value</label>';
	value += '<input type="text" class="form-control" name="variationValue_' + id + '" id="variationValue_' + id + '">'; 					
	var quantity = '<label for="variationQty_' + id + '">' + id + '- Variation Qty</label>';
	quantity += '<input type="text" class="form-control" name="variationQty_' + id + '" id="variationQty_' + id + '">';		
	$last.after(value + quantity);
}

function removeVariationInput(button){
	var id = button.parent().attr('id');
	for (var i = 0; i < 2; i++) {
		var $last = $('#' + id +' input:last');
		var $label = $('#' + id).find('label[for="'+$last.attr('id')+'"]');
		$last.remove();
		$label.remove();
	}
}

function showResult(status, data) {
	if(status == 200) {
		mainActions();
		$('#success-box').children('p').children('a').attr("href", data.permalink);
		$('#success-box').show();
	} else {
		mainActions();
		$('#danger-box').show();
		console.log(data);
	}
}

function submitForm(event, form, type) {
	event.preventDefault();
    var values = {};
    $.each(form.serializeArray(), function(i, field) {
		values[field.name] = field.value;
	});
	if(type == 'put') {
		putVariation(itemToModify, values, showResult);
	}
	if(type == 'post') {
		newItem(values, showResult);
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
    $('.back').bind('click',function() {
		mainActions();
		$('.listing').show();
	});
	hideAll();
	
	var accessToken = getParameterByName('access_token');
	if (accessToken) {
		$('.intro').hide();
		mainActions();
		offset = 0;
		getListedItems(offset, createItemList);
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
		if (offset >= 50) {
			$('.previous').removeClass('disabled');
		};
		getListedItems(offset, createItemList);
		console.log(offset);
	});
	$('.previous').bind('click',function() {
		if (offset) {
			offset -= 50;
		}
		if (offset < 50) {
			$(this).addClass('disabled');
		};
		getListedItems(offset, createItemList);
		console.log(offset);
	});
	$('#variation-form').submit(function(event) {
	    submitForm(event, $(this), 'put');
	});
	$('#new-item-form').submit(function(event) {
	    submitForm(event, $(this), 'post');
	});
	$('.adding-button').bind('click', function() {
		addVariationInput($(this));
	});
	$('.minus-button').bind('click', function() {
		removeVariationInput($(this));
	});
});



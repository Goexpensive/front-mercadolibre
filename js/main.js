var itemToModify = {};

function createItemList(data){
	var html = '<table class="table active-items"><tr><th>Imagen</th><th>Item Id</th><th>Titulo</th><th>Cantidad</th><th>Precio</th><th>Convertir</th></tr>';
	var item = [];
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
	html += '</table>';
	$('.listing').append(html);
	$('.variations').bind('click', function(){
		createTableVariation(data[$(this).attr('id')]);
	});
}

function createTableVariation(data){
	var item = data;
	var variation = data.variations;
	var heading = '<h2>' + item.id + ' ' + item.title + '</h2>';
	var subHeading = '<h3> Variation </h3>';
	var createButton = '<button type="button" class="create btn btn-success create pull-right">Crear</button>';
	var deleteButton = '<button type="button" class="delete btn btn-danger pull-right">Borrar</button>';
	var editButton = '<a type="button" href="https://myaccount.mercadolibre.com.ar/listings/#label=active" class="edit btn btn-warning pull-right">Editar</a>';
	var table = '<table class="table"><tr><th>Variation Id</th><th>Precio</th><th>Cantidad Disponible</th><th>Nombre</th><th>Valor</th><th>Convertir</th></tr>';
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
	table += '</table>';
	$('.active-items').hide();
	$('.table-item').append(heading);
	$('.table-item').append(subHeading);
	$('.table-item').append(createButton);
	$('.table-item').append(deleteButton);
	$('.table-item').append(editButton);
	$('.table-item').append(table);
	$('.table-item button.create').bind('click', function() {
		createForm(item);
	});
}

function createForm(item){	
	$('.table').hide();
	$('#variation-form').show();
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

$(document).ready(function() { 
	$('#variation-form').hide();
	$('#publicaciones').bind('click', function() {
		getListedItems(createItemList)
	});

	$('#variation-form').submit(function(event) {
	    // get all the inputs into an array.
	    event.preventDefault();
	    var values = {};
	    $.each($('#variation-form').serializeArray(), function(i, field) {
    		values[field.name] = field.value;
		});
		putVariation(itemToModify, values);

	});

	$('.adding-button').bind('click',addVariationInput);
	$('.minus-button').bind('click',removeVariationInput);
});



function createItemList(data){
	var html = '<table class="table"><tr><th>Imagen</th><th>Item Id</th><th>Titulo</th><th>Cantidad</th><th>Precio</th><th>Convertir</th></tr>';
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
		html += '<td><button class="btn btn-default variations" type="submit">Variation</button></td>';
		html += '</tr>'
	}
	html += '</table>';
	$('.listing').append(html);
	$('.variations').bind('click', function(){createForm($(this))});
}

function createForm(html){
	var item = html.parent().siblings();	
	var heading = '<h2>' + $(item[1]).text() + ' ' + $(item[2]).text() + '</h2>'
	var labelVariationId = '<label for="variationId">Id</label>';
	var inputVariationId = '<input type="text" class="form-control" id="variationId">';
	var labelVariationName = '<label for="variationName">Name</label>';
	var inputVariationName = '<input type="text" class="form-control" id="variationName">';
	var labelVariationValue = '<label for="variationValue">Variation Value</label>';
	var inputVariationValue = '<input type="text" class="form-control" id="variationValue">';
	var submit = '<button type="submit" class="btn btn-default">Submit</button>'; 		
	var form = '<form>';
	form += labelVariationId;
	form += inputVariationId;
	form += labelVariationName;
	form += inputVariationName;
	form += labelVariationValue;
	form += inputVariationValue;
	form += submit;
	form += '</form>';
	$('.table').hide();
	$('.form-item').append(heading);
	$('.form-item').append(form);
	$('.form-item button').bind('click', function() {
		putVariation();
	});
}
$(document).ready(function() { 
	$('#publicaciones').bind('click', function() {
		getListedItems(createItemList)
	});
});



$(document).ready(function(){
	$.ajax({
		url: 'graphics/chart/addMeasurement',
		type: 'GET',
		datatype: 'JSON',
		success: function(result){
			console.log(result);
		},
		error: function(){
			console.log('Error');
		}
	});
});
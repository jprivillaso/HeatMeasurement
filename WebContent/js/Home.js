$(document).ready(function() {
	/*var obj = [ {
		colombia : [ 1, 2, 3, 4 ],
		londres : [ 4, 5, 6, 7 ],
		paris : [ 4, 5, 6, 7 ]
	} ];*/
	
	var obj2 = {
		colombia : [ 1, 2, 3, 4 ]
	};
	
	var obj3 = {
		londres: []	
	};
	
	for(var i = 1; i < 5 ; i++){
		obj3.londres.push(i);
	}
	
//	console.log(obj2);
//	console.log(obj2.colombia);
	
	console.log(obj2.colombia[0]);
	console.log(obj3.londres[0]);
});
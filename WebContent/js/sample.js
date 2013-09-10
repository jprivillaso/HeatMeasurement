var width = 500;
var height = 500;
var color = d3.scale.category20c();

var canvas = d3.select("#body").append("svg:svg").attr("width", width)
	.attr("height", height);

d3.json("util/data.json", function(data){
	
	var treemap = d3.layout.treemap()
		.round(false)
		.size([width, height])
		.sticky(true)
		.nodes(data);
			
	//Create the cells of the parents
	console.log(treemap);
	
	var parentCells = canvas.selectAll(".cell")
		.data(treemap)
		.enter()
		.append("g")
		.attr("class", "cell");
	
	parentCells.append("rect")
		.attr("x", function(d){ return d.x;})
		.attr("y", function(d){ return d.y;})
		.attr("width", function(d){ return d.dx;})
		.attr("height", function(d){ return d.dy;})
		.attr("fill", function(d) {return d.children ? null : color(d.parent.name);})
		.attr("stroke", "#fff");
	
	parentCells.append("text")
		.attr("class", "label")
		.attr("x", function(d) { 
			return d.x + d.dx / 2;
		}).attr("y", function(d) { 
			return d.y + d.dy / 2; 
		}).attr("text-anchor", "middle")			
		.text(function(d){
			return d.name;
		}).attr("fill", "#fff");
});
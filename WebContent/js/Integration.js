var width = 500;
var height = 500;
var xscale = d3.scale.linear().range([0, width]);
var yscale = d3.scale.linear().range([0, height]);
var color = d3.scale.category20c();
var headerColor = "#AAAA";
var transitionDuration = 500;

var canvas = d3.select("#body").append("svg:svg").attr("width", width)
	.attr("height", height);

d3.json("util/data.json", function(data){
	node = root = data;
	
	var treemap = d3.layout.treemap()
		.round(false)
		.size([width, height])
		.sticky(true)
		.value(function(d){
			return 1200;
		});
	
	var nodes = treemap.nodes(root);
	var parents = nodes.filter(function(d){
		return d.children; 
	});
	
	console.log(parents);
			
	//Create the cells of the parents
	
	var parentCells = canvas.selectAll("g.cell.parent")
		.data(parents, function(d){
			return "p-" + d.name;
		}).enter()
		.append("g")
		.attr("class", "cell parent")
		.on("click", function(){
			console.log("A parent was clicked");
		});
	
	parentCells.append("rect")
		.attr("x", function(d){ return d.x;})
		.attr("y", function(d){ return d.y;})
		.attr("width", function(d){ return d.dx;})
		.attr("height", function(d){ return d.dy;})
		.attr("fill", function(d) {return d.children ? "gray" : color(d.parent.name);})
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
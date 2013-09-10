var width = 500;
var height = 500;
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([0, height]);
var color = d3.scale.category20();
var transitionDuration = 500;

var treemap = d3.layout.treemap()
	.round(false)
	.size([width, height])
	.sticky(true)
	.value(function(d){
		return 1500;
});

var canvas = d3.select("#body")
	.append("svg:svg")
	.attr("width", width)
	.attr("height", height);

d3.json("util/data.json", function(data){
	node = root = data;
		
	var nodes = treemap.nodes(root);
	var parents = nodes.filter(function(d){
		return d.children; 
	});
	
	console.log(nodes);
	
	//Create the cells of the parents
	var parentCells = canvas.selectAll("g.cell.parent")
		.data(parents, function(d){
			return "p-" + d.name;
		});
		
	var parentTransition = parentCells.enter()
		.append("g")
		.attr("class", "cell parent")
		.on("click", function(d){
			console.log(d3.select(this));
			d3.select("text").attr("display", "none");
			return zoom(d);
		});
	
	parentTransition.append("rect")
		.attr("width", function(d){ return d.dx - 1;})
		.attr("height", function(d){ return d.dy - 1;})
		.attr("fill", function(d) {
			//return d.children ? color(d.name) : d.fill;
			return color(d.name);
		})
		.attr("stroke", "#fff");
	
	parentTransition.append("text")
		.attr("class", "label")
		.attr("x", function(d) { 
			return d.x + d.dx / 2;
		}).attr("y", function(d) { 
			return d.y + d.dy / 2;}) 
		.attr("text-anchor", "middle")			
		.text(function(d){
			return d.name;
		}).attr("fill", "#fff");
		
	d3.select(window).on("click", function() { zoom(root); });
});

var size = function(d){
	return d.size;
};

function zoom(d) {
    var kx = width / d.dx, ky = height / d.dy;
    x.domain([d.x, d.x + d.dx]);
    y.domain([d.y, d.y + d.dy]);

    var t = canvas.selectAll("g.cell").transition()
        .duration(500)
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    t.select("rect")
        .attr("width", function(d) { return kx * d.dx - 1; })
        .attr("height", function(d) { return ky * d.dy - 1; });

    t.select("text")
        .attr("x", function(d) { return kx * d.dx / 2; })
        .attr("y", function(d) { return ky * d.dy / 2; });
    
    node = d;
    d3.event.stopPropagation();
  }


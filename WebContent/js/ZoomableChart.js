(function(){
	
	var displayChart = function(){
		var color = d3.scale.category20();
		var canvas = d3.select(".ZoomableChart").append("svg").attr("width",
				500).attr("height", 500);

		d3.json("util/data.json", function(data) {
			var treemap = d3.layout.treemap()
				.size([ 500	, 500 ])
				.nodes(data);
			
			var cells = canvas.selectAll(".cell")
				.data(treemap)
				.enter()
				.append("g")	
				.attr("class", "cell");

			cells.append("rect")
				.attr("x", function(d) {return d.x;})
				.attr("id-rect", Math.random())
				.attr("y", function(d) {return d.y;})
				.attr("width", function(d) {return d.dx;})
				.attr("height", function(d) {return d.dy;})
				.attr("fill", function(d) {return d.children ? null : color(d.parent.name);})
				.attr("stroke", "#FFFFFF");
			
			cells.append("text")
				.attr("x", function(d){return d.x + d.dx / 2;})
				.attr("y", function(d){return d.y + d.dy / 2;})
				.attr("text-anchor", "middle")
				.text(function(d){ return d.children ? null : d.name;});
		});
	};
	
	brite.registerView("ZoomableChart", {emptyParent : true}, {
		create: function(){
			return render("tmpl-ZoomableChart");
		},
		
		postDisplay: function(){
			displayChart();
		}, 
		
		events: {
			'click; rect': function(){
				console.log('a rect was pressed');
			}
		}
	});

})();
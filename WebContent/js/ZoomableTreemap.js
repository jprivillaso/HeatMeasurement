
/******************************* INIT CHART MODULE ***************************/
var InitializeChartElements = (function() {  
	return function(options, generalFunctions){
		// CONSTANTS
		var CHART_ELEMENTS_MARGIN = {
			top: 45,
			right: 0,
			bottom: 0,
			left: 0
		};
		
		var TEXT_MARGIN = {
			top: 10,
			right: 0,
			bottom: 0,
			left : 6
		};
		
		// VARIABLES
		var svg = null;	
		
		var setSVG = function(newSVG){
			svg = newSVG;
		};
		
		//METHODS
		var createChart = function(){
			var treemap = d3.layout.treemap()
				.children(function(node, depth){return depth? null:node.children;})
				.sort(function(a, b) { return a[options.sizeProperty] - b[options.sizeProperty];})
				.ratio(generalFunctions.getDimensions().height 
						/ generalFunctions.getDimensions().width * 0.5 * (1 + Math.sqrt(5)))
				.round(false);
			
			/*
			* Create the SVG with its properties. Create the hierarchical elements
			* If you want to change the color of the nodes just change the class 
			* name and then check what color do you want in the COLORBREWER.CSS 
			* file.
			*/			
			svg = d3.select(options.$chartEl).append("svg")
				.attr("class", options.colorPattern)
				.attr("width", generalFunctions.getDimensions().width + "px")
				.attr("height", generalFunctions.getDimensions().height + CHART_ELEMENTS_MARGIN.top + "px")
				.style("margin-left", function(){
					/*
					 *  Return the width of the parent - svg's width, all divided by 2 in order
					 *  to get same margins in each side
					 */
					console.log($(options.$chartEl).parent().width());
					return (($(options.$chartEl).parent().width() - options.width) / 2) + 'px';
				})
				.style("margin.right", -CHART_ELEMENTS_MARGIN.right + "px")
				.append("g")
				.attr("transform", "translate(" + CHART_ELEMENTS_MARGIN.left + "," + CHART_ELEMENTS_MARGIN.top + ")")
				.style("shape-rendering", "crispEdges");
			
			setSVG(svg);
			
			// Initial values for the chart
			var initializeNode = function(root) {
				root.x = root.y = 0;
				root.dx = generalFunctions.getDimensions().width;
				root.dy = generalFunctions.getDimensions().height;
				root.depth = 0;
			};
			
			/*
			 * Compute the tree map layout recursively such that each group of 
			 * siblings uses the same size rather than the dimensions of the 
			 * parent cell.
			 */ 
			var calculateLayout = function(node) {
				if (node.children) {
					treemap.nodes({children: node.children});
					node.children.forEach(function(child) {
						child.x = node.x + child.x * node.dx;
						child.y = node.y + child.y * node.dy;
						child.dx *= node.dx;
						child.dy *= node.dy;
						child.parent = node;
						calculateLayout(child);
					});
				}
			};
			initializeNode(options.data);
			calculateLayout(options.data);
		};
		
		var createGandparent = function(){	
			// Remove the older grandparent and updates the new one
			$(options.$chartEl + " .grandparent").remove();
			// This is the field that will contain the hierarchy route
			var grandparent = svg.append("g")
			    .attr("class", "grandparent");

			grandparent.append("rect")
			    .attr("y", -CHART_ELEMENTS_MARGIN.top)
			    .attr("width", generalFunctions.getDimensions().width)
			    .attr("height", CHART_ELEMENTS_MARGIN.top);

			grandparent.append("text")
			    .attr("x", TEXT_MARGIN.left)
			    .attr("y", TEXT_MARGIN.top - CHART_ELEMENTS_MARGIN.top)
			    .attr("dy", ".90em");
			
			return grandparent;
		};
		
		return {  
			initChart : function(){
				createChart();
			},
				
			createGrandParent: function(){
				return createGandparent();
			},
			
			getSVG: function(){
				return svg;
			}, 
			
			setSVG: function(value){
				svg = value;
			}
	    };  
	};
})(); 

/********************************* UPDATE MODULE *****************************/

var UpdateChart = (function(){
	return function(options, initChartElements, generalFunctions){
		//CONSTANTS
		var FIRST_NODE_NAME_MARGIN_TOP = 0.75;
		var ZOOM_TRANSITION_DURATION = 350;
		
		//VARIABLES
		var tooltipProperties = [];
		var transitioning = false;
		var x = null;
		var y = null;	
		
		// METHODS
		var scaleDimensions = function(){
			x = d3.scale.linear()
				.domain([0, generalFunctions.getDimensions().width])
				.range([0, generalFunctions.getDimensions().width]);
			y = d3.scale.linear()
				.domain([0, generalFunctions.getDimensions().height])
				.range([0, generalFunctions.getDimensions().height]);
		};

		//This method sets the properties of each text element
		var text = function(text) {
			//Position in x
			text.attr("x", function(node) {
				return x(node.x) + generalFunctions.getTextMargins().left; 
			})
			//Position in y
			.attr("y", function(node) {
				return y(node.y) + generalFunctions.getTextMargins().top; 
			});
		};
		
		// This method sets the properties of each rectangle(node) element
		var rect = function(rect) {
			rect.attr("x", function(node) {			
				return x(node.x);
			}).attr("y", function(node) {
				return y(node.y); 
			}).attr("width", function(node) {
				return x(node.x + node.dx) - x(node.x);
			}).attr("height", function(node) {
				return y(node.y + node.dy) - y(node.y); 
			});		
		};
		
		//This method returns the name of the actual node
		var name = function(node) {
			return node.parent 
				? name(node.parent) + " - " + node.name
				: node.name;
		};
		
		/*
		 * This will append the text to each node depending on an array that is
		 * received as a parameter. The name don´t need to be included as it is 
		 * added by default 
		 */
		var appendChildren = function(nodeChildren) {
			var propertiesToShow = generalFunctions.getPropertiesToShow();
			if (propertiesToShow.length > 0){
				for (var iter = 0; iter < propertiesToShow.length; iter++) {
					nodeChildren.append("text")
		       		.attr("class", function(node){
		       			return "txt" + propertiesToShow[iter] + " " +
		       				node.name.replace(/ /g,'').replace('(', '').replace(')', '');
		       		})
		       		.attr("dy",(FIRST_NODE_NAME_MARGIN_TOP * ((iter) * 1.5) + 2) + "em")
			        .text(function(node) {
			        	return propertiesToShow[iter] + ": " + node[propertiesToShow[iter]];
			        }).call(text);
				}
			}
		};
		
		// Display the tree map
		var UpdateChart = function(node) {
			var svg = initChartElements.getSVG();

			// Append Grandparent
		    var g1 = svg.insert("g", " .grandparent").datum(node).attr("class", "depth");

			var createEachNode = function(node){
		    	// Append Children
			    var nodeChildren = g1.selectAll("g")
			        .data(node.children)
			        .enter().append("g")
			        .attr("class", function(node){
			        	return "shown rect" + node.name.replace(/ /g,'').replace('(', '').replace(')', '');
			        });

			    // Filter the displaying nodes just the node that has children
			    nodeChildren.filter(function(node) {
			    	return node.children; 
			    }).classed("children", true);
			    
			    d3.selectAll(options.$chartEl + " svg .depth .shown.children").on("click", function(actualNode){
			    	generalFunctions.setColorCalculationFlag(0);
					transition(actualNode);
				});
			    
			    /*		      
		    	 * The class that is given is to assign the proper color
		    	 * depending on the color property of each node. 
		    	 * Check the COLORBREWER.CSS file to check the values that
		    	 * it can take
		    	 */  
			    nodeChildren.append("rect")
			    	// The class will determine the color of the node
			        .attr("class", function(node){
			        	var newcolor = generalFunctions.getColorCalculationFlag() +1;
			        	generalFunctions.setColorCalculationFlag(newcolor);
			        	return "q" + generalFunctions.colorGenerator(node) + "-9 parent ";
			        })
			        .attr("id", function(node){
			        	return node.name.replace(/ /g,'').replace('(', '').replace(')', '');
			        })
			        .attr("name", function(node){
			    		return node.name;
			    	}).call(rect)
			        .append("title")
			        .text(function(node) {
			        	var tooltip = "";
			        	for ( var iter = 0; iter < tooltipProperties.length; iter++) {
							tooltip += tooltipProperties[iter] + ": " + node[tooltipProperties[iter]] + "\n";
						}
			        	return tooltip;
			        });
			    /*
		         *  Change the 'd y' attribute to change the position in Y axis
		         *  of the text
		         */ 
			    nodeChildren.append("text")
			    	.attr("class", function(node){
			    		return "txtname " + node.name.replace(/ /g,'').replace('(', '').replace(')', '');
			    	})
			    	.attr("value", function(node){
			    		return node[generalFunctions.getSizeProperty];
			    	})
			        .attr("dy", FIRST_NODE_NAME_MARGIN_TOP + "em")
			        .text(function(node) {
			        	return node.name; 
			        }).call(text);
			    
			    appendChildren(nodeChildren);	
			    
			    this.getChildNode = function(){
			    	return nodeChildren;
			    };
		    };
		    
		    /*
		     * This is in charge of the zoom transition of the node when a node is
		     * clicked 
		     */
			var transition = function(node) {
				if (transitioning || !node){
					return;
				}else{
					transitioning = true;
				}
		    	var chartUpdate = UpdateChart(node);
		    	var grandpTransition = g1.transition().duration(ZOOM_TRANSITION_DURATION);
		        var parentTransition = chartUpdate.transition()
		        								  .duration(ZOOM_TRANSITION_DURATION)
		        								  .each("end", generalFunctions.setFont_Size);

			    // Update the domain only after entering new elements.
		        x.domain([node.x, node.x + node.dx]);
		        y.domain([node.y, node.y + node.dy]);

			    // Enable anti-aliasing during the transition.
		        svg.style("shape-rendering", null);

			    // Draw child nodes on top of parent nodes.
		        svg.selectAll(".depth")
			    	.sort(function(a, b) {return a.depth - b.depth;});

			    // Fade-in entering text.
			    chartUpdate.selectAll("text").style("fill-opacity", 0);

			    // Transition to the new view.
			    grandpTransition.selectAll("text").call(text).style("fill-opacity", 0);
			    parentTransition.selectAll("text").call(text).style("fill-opacity", 1);
			    parentTransition.selectAll(options.$chartEl + " svg .depth .shown rect").call(rect);

			    // Remove the old node when the transition is finished.
			    grandpTransition.remove().each("end", function() {
			    	svg.style("shape-rendering", "crispEdges");
			        transitioning = false;
			    });
			};
			
			//var grandparent = createGrandParent();
			var grandparent = initChartElements.createGrandParent();
			grandparent.datum(node.parent)
				.on("click", function(actualNode){
					generalFunctions.setColorCalculationFlag(0);
					transition(actualNode);
				})
			    .select("text")
			    .text(name(node));
			
		    var g = new createEachNode(node);
		    return g.getChildNode();
		};		
		
		return {
			chartUpdate : function() { 			
				scaleDimensions();
				UpdateChart(options.data);
			},
			
			setTooltipProperties: function(properties){
				tooltipProperties = properties;
			}
		};
	};
})();

/*************************** GENERAL FUNCTIONS MODULE ************************/

var GeneralFunctions = (function(){
	return function(){
		// CONSTANTS
		var TEXT_MARGIN = {
			top: 10,
			right: 0,
			bottom: 0,
			left : 6
		};

		var CHART_ANCHOR = 0;
		var CHART_HEIGHT = 0;

		// Variables
		var maxShownValue = 0;
		var colorCalculationFlag = 0;
		var propertiesToShow = [];
		var colorProperty = "";
		var $chartContainer = null;

		// METHODS
		/*
		 * Return the maximum value of the nodes that are displayed at the moment
		 * in the chart
		 */
		var calculateMaxShownValue = function(property){
			var propertyArray = [];
			var elements = $( $chartContainer + " svg g .depth:last .shown");
			
			for (var i = 0; i < elements.length; i++){
				propertyArray.push(elements[i].__data__[property]);
			}		
		    maxShownValue = _.max(propertyArray);
			return {
				max: _.max(propertyArray)
			};
		};

		/*
		 * This is the formula to calculate the proper color of the chart node. 
		 * It is calculated based on the color property that is stored in the
		 * JSON file, divided into the maximum value of the visible nodes and
		 * then multiplied by 8 that is the mayor number in the COLORBREWER.JS
		 * scale.
		 * You can check the COLORBREWER.CSS file in order to get it. The number
		 * 10 is because we need the number in 10th base.
		 * The colorCalculationFlag is used to check whether the function is 
		 * accessed once or not, so after the first calculation, it will just
		 * read the maxShownValue attribute
		 */
		var colorNumberGenerator = function(node) {
			if (colorCalculationFlag > 1) {
				return parseInt((node[colorProperty]/maxShownValue) * 8 , 10);
			}else{
				return parseInt((node[colorProperty] / calculateMaxShownValue(colorProperty).max) * 8 , 10);
			}
		};

		/*
		 * Resize automatically the font-size of each node depending on the
		 *  length of each text
		 */
		var setFontSize = function(){
			var namesArray = $($chartContainer + " .depth:last .shown .txtname");
			/*
			 * Return the max length of each text present in 
			 * each node
			 */
			var getMaxTextLength = function(element){
				var selector = $($chartContainer + " .shown.rect" + element.__data__.name
														.replace(/ /g,'')
														.replace('(', '')
														.replace(')', '') + " text");
				var widthArray = [];
				for (var j = 0; j < selector.length; j++) {
					widthArray.push(selector[j].offsetWidth);
				}
				return _.max(widthArray);
			};
			
			var sumOfHeights = function(element){
				var rectArray = $($chartContainer + " .shown.rect" + element.__data__.name
														 .replace(/ /g,'')
														 .replace('(', '')
														 .replace(')', '') + " text");
					
				var sum = 0;
				for (var j = 0; j < rectArray.length; j++) {
					sum = sum + rectArray[j].offsetHeight;
				}
				return sum; 
			};
			
			/*
			 * Setting the font-size of nodes
			 */
			var setChildrenFonts = function(){
				for(var i = 0; i < namesArray.length; i++){
					/*
					 * The value -5 was set in order to have a little margin when the text is reduced
					 * so that the text won't be glued to the node margin
					 */ 
					while((getMaxTextLength(namesArray[i]) > (document.getElementById(namesArray[i].__data__.name
																								   .replace(/ /g,'')
																								   .replace('(', '')
																								   .replace(')', ''))
																								   .getBBox()
																								   .width)-5)
							|| (sumOfHeights(namesArray[i]) > (document.getElementById(namesArray[i].__data__.name
																								    .replace(/ /g,'')
																								    .replace('(', '')
																								    .replace(')', ''))
																								    .getBBox()
																								    .height)-5)){
						
						var fontSize = $($chartContainer + " .txtname." + namesArray[i].__data__.name
																	.replace(/ /g,'')
																	.replace('(', '')
																	.replace(')', ''))
																	.css("font-size"); 
						
						// The size will be like 16px, so it's neccessary to remove the 'px'
						var newSize = fontSize.substring(0, fontSize.length-2);
						
						var className = namesArray[i].__data__.name
													 .replace(/ /g,'')
													 .replace('(', '')
													 .replace(')', '');
										
						$($chartContainer + " .txtname." + className).css("font-size", (newSize - 1) + "px");
						
						for(var k = 0; k < propertiesToShow.length ; k++){
							$(".txt" + propertiesToShow[k] + "." + className).css("font-size", (newSize - 1) + "px");
						}
					}
				}
			};
			
			/*
			 * Setting the font-size of the upper bar
			 */
			var setGrandparendFonts = function(){
				var grandparentText = $(".grandparent text");
				var grandparentRect = $(".grandparent rect");
				
				
				while (grandparentText[0].offsetWidth > grandparentRect[0].width.baseVal.value) {
					
					var fontSize = grandparentText.css("font-size");
					var newSize = fontSize.substring(0, fontSize.length - 2);
					grandparentText.css("font-size", (newSize - 1) + "px" );
				}
			};	
			setChildrenFonts();
			setGrandparendFonts();
		};
		
		return {
			// COMMON FUNCTIONS
			colorGenerator: function(node){
				return colorNumberGenerator(node);
			},	
			
			setFont_Size: function(){
				setFontSize();
			},
			
			changeChartColor: function(color, options){
				console.log('changing the color');
				$(options.$chartEl + " svg").attr("class" , color);
			},
			
			// GETTERS AND SETTERS
			setPropertiesToShow: function(data){
				propertiesToShow = data;
			},
			
			getPropertiesToShow: function(){
				return propertiesToShow;
			},
			
			getColorCalculationFlag: function(){
				return colorCalculationFlag;
			}, 
			
			setColorCalculationFlag: function(flagValue){
				colorCalculationFlag = flagValue;
			},
			
			getTextMargins: function(){
				return TEXT_MARGIN;
			},
			
			setColorProperty: function(property){
				colorProperty = property;
			},
			
			getColorProperty: function(){
				return colorProperty;
			},
			
			setSizeProperty: function(property){
				sizeProperty = property;
			},
			
			setChartContainer : function(container){
				$chartContainer = container;
			},
			
			setDimensions: function(width, height){
				CHART_ANCHOR = width;
				CHART_HEIGHT = height;
			},
			
			getDimensions: function(){
				return {
					width: CHART_ANCHOR,
					height: CHART_HEIGHT
				};
			}
		};
	};
})();

var Viridis_ZoomableTreemap = (function(){
	return function(options){
		var initializeChartElements = null;
		var updateChart = null;
		var generalFunctions = null;
		var data = options;	
		
		var chartPreprocessing = function(data){
			var childrenArray = Object.keys(data.data.children[0]);
			var childrenIndex = childrenArray.indexOf("children");		
			childrenIndex < 0 ? null : childrenArray.splice(childrenIndex);
			
			updateChart.setTooltipProperties(childrenArray);
			generalFunctions.setColorCalculationFlag(0);
			generalFunctions.setPropertiesToShow(data.propertiesToShow);
			generalFunctions.setDimensions(data.width, data.height);
			generalFunctions.setColorProperty(data.colorProperty);
			generalFunctions.setSizeProperty(data.sizeProperty);
			generalFunctions.setChartContainer(data.$chartEl);
		};
		
		var createChartElements = function(){
			initializeChartElements.initChart();
		};
		
		var updateChartElements = function(){
			updateChart.chartUpdate();
		};
		
		var initInstances = function(data){
			generalFunctions = GeneralFunctions(data);
			initializeChartElements = InitializeChartElements(data, generalFunctions);
			updateChart = UpdateChart(data, initializeChartElements, generalFunctions);
		};
		
		return {			
			init: function(){
				initInstances(data);
				chartPreprocessing(data);
				createChartElements();
			},
			
			update: function(){
				updateChartElements();
				generalFunctions.setFont_Size();
			},
			
			updateChartSize: function(width, height){
				data.width = width;
				data.height = height;
				
				var parent = $(data.$chartEl).parent().attr("class");
				console.log(parent);
				$(data.$chartEl).remove();
				$("." + parent).prepend('<div id="' + data.$chartEl.replace("#", "").replace(".", "") + '"></div>');
				this.init();
				this.update();
			},
			
			changeChartColor: function(colorPattern){
				generalFunctions.changeChartColor(colorPattern, data);
				data.colorPattern = colorPattern;
				this.update();
			}
		};
	};
})();

/**
 * Considerations: The chart container must have an id, not class in order to be unique
 * Each chart must have a unique container 
 * E.G 
 * <div class="parentChart1">
      <div id="chart1"></div>
   </div>
   
   <div class="parentChart2">
      <div id="chart2"></div>
   </div>
 * 
 * CREATING THE CHART 
 * Considerations: 
   - Each node of the json file must contain:
      -- At least name and value
      -- The size property and the color property
   - All the properties described below are fixed, you can add more but they will have no effect unless
   you add some functionality in the ZoomableTreemap.js file
   - You can have as many charts as you want in your html
   - After one chart is created in one container, no more can be created in the same container as its selector is an ID, 
   not a CLASS
 * 
 * E.G
 * var options = {
		data: YOUR_JSON_FILE,
		$chartEl: #YOUR_DIV,
		sizeProperty: 'value',
		colorProperty: 'color', 
		propertiesToShow: ["value", "color"],
		colorPattern: 'YlOrRd',
		width: 500, 
		height: 400
	};
	ZoomableTreemap = new Zoomable_Treemap();
	ZoomableTreemap.init(options);
 * 
 * 
 * UPDATING THE CHART SIZE
 * E.G
 * ZoomableTreemap.updateChartSize(600, 400);
 * 
 * 
 * CHANGING CHART COLOR
 * Note: You will find all the possible patterns in the COLORBREWER.CSS file
 * E.G
 * ZoomableTreemap.changeChartColor('YlGn');
 * 
 */
var Zoomable_Treemap = function(){};
Zoomable_Treemap.prototype = {
	viridis : null, 
	
	init: function(options){
		this.viridis = Viridis_ZoomableTreemap(options);
		this.viridis.init();
		this.viridis.update();
	}, 
	
	updateChartSize: function(width, height){
		this.viridis.updateChartSize(width, height);
	}, 
	
	changeChartColor: function(colorPattern){
		this.viridis.changeChartColor(colorPattern);
	}
};
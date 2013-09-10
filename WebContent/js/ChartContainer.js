(function(){	
	
	var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	var ajaxCall = function(url, resultHandlerFn, data){
		response = [];
		$.ajax({
			data: data,
			type : 'POST',
			url : url,
			success : function(result) {
				resultHandlerFn(result);
			},
			error : function() {
				console.log('ERROR');
			}
		});
	};
	
	var displaySplineChart = function(dataToDisplay){
		var data = [];
		
		for(var i in dataToDisplay){
			data.push(dataToDisplay[i].temperature);
		}
		
		console.log(dataToDisplay);
		$('#ChartContainer-Chart').highcharts({
            chart: {
                type: 'spline',                
            },
            
            credits: {
            	enabled: false
            },
                        
            title: {
                text: 'Average Temperature',
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: categories,
            },

            yAxis: {
                title: {
                    text: 'Temperature'
                },
                labels: {
                    formatter: function() {
                        return this.value +'°';
                    }
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                }                
            },
            series: [{
                name: 'Tokyo',
                marker: {
                    symbol: 'square'
                },
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, {
                    y: 26.5,
                    marker: {
                        symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'
                    }
                }, 23.3, 18.3, 13.9, 9.6]
    
            }, {
            	name: 'London',
                marker: {
                    symbol: 'diamond'
                },
                data: [{
                    y: 3.9,
                    marker: {
                        symbol: 'url(http://www.highcharts.com/demo/gfx/snow.png)'
                    }
                }, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]},
            {
            	name: 'Colombia',
            	marker:{
            		symbol: 'circle'
            	},
            	data: data
            }]
        });
	};
	
	brite.registerView("ChartContainer", {emptyParent : true}, {
		
		create: function(){
			return render("tmpl-ChartContainer");
		},
		
		postDisplay: function(){
		}, 
		
		events: {
			'click; .showTableBtn':function(event){
				this.$el.trigger('DO_SELECT_SHOW_CHART', 'spline');
			},
		
			'change; .filterSelector' : function(event){
				var filter = $('.filterSelector').val();
								
				switch(filter){
				case 'Date' :
					$('#dateFilters').fadeOut('slow');
					ajaxCall('graphics/filters/date', displaySplineChart);
					break;
				case 'Temperature':
					$('#dateFilters').fadeIn('slow');
					var data = {
						'minDate' : $('#minDate').val(),
						'maxDate' : $('#maxDate').val()
					};
					
					ajaxCall('graphics/filters/temp', displaySplineChart, data);
					break;
				}
<<<<<<< HEAD
			},
			
			'click; #updateChartSizeBtn' : function() {		
				//this.$el.trigger('CHANGE_CHART_SIZE', 600 , 400);
			},
			
			'click; #updateChartColorBtn' : function() {		
				//ZoomableTreemap.updateChartColor("Purples");
=======
>>>>>>> f6e33e1a4d6c3bb9b6fd40c2c9610432dbf886bf
			}
		},
		
		docEvents:{
			'DO_SELECT_SHOW_CHART': function(event, type){
				switch(type){
					case 'spline' :
<<<<<<< HEAD
						$('.ChartContainer-ZoomableChart').fadeOut(0);
						$('.ChartContainer-Wrapper').fadeIn('slow');
=======
						//$('.ChartContainer-Wrapper').fadeIn('slow');
						//$('.ChartContainer-ZoomableChart').fadeOut('slow');
						$('.ChartContainer-Wrapper').fadeIn(0);
>>>>>>> f6e33e1a4d6c3bb9b6fd40c2c9610432dbf886bf
						console.log('display table');
						ajaxCall('graphics/chart/retreiveTemp', displaySplineChart);
						break;
					case 'realTime' :
						//displayRealTimeChart();
						break;
					case 'zoomable':
<<<<<<< HEAD
						$('.ChartContainer-Wrapper').fadeOut(0);
						$('.ChartContainer-ZoomableChart').fadeIn('slow');
						var $chartEl = '#chart';
						var chartElement = $($chartEl + ' svg g');
						var ZoomableTreemap = null;
						chartElement.length > 0 ? null 
						: d3.json("util/test.json", function(root) {
							var options = {
								data: root,
								$chartEl: $chartEl,
								sizeProperty: 'value',
								colorProperty: 'color', 
								propertiesToShow: ["value", "color"],
								colorPattern: 'YlOrRd',
								width: 500, 
								height: 400
							};
							ZoomableTreemap = new Zoomable_Treemap();
							ZoomableTreemap.init(options);
						});
						$("#updateChartSizeBtn").on('click', function(){
							ZoomableTreemap.updateChartSize(600, 400);
						});
						
						$("#updateChartColorBtn").on('click', function(){
							ZoomableTreemap.changeChartColor('YlGn');
						});
						
						break;
					case 'zoomable2': 
						$('.ChartContainer-Wrapper').fadeOut(0);
						$('.ChartContainer-ZoomableChart2').fadeIn('slow');
						var $chartEl2 = '#chart2';
						var chartElement2 = $($chartEl2 + ' svg g');
						
						chartElement2.length > 0 ? null
						: d3.json("util/test2.json", function(root2) {
							var options = {
								data: root2,
								$chartEl: $chartEl2,
								sizeProperty: 'value',
								colorProperty: 'color', 
								propertiesToShow: ["value"],
								colorPattern: 'YlOrRd',
								width: 500, 
								height: 400
							};
							var instancex = new Zoomable_Treemap();
							instancex.init(options);
						});
=======
						//$('.ChartContainer-ZoomableChart').fadeIn('slow');
						//$('.ChartContainer-Wrapper').fadeOut('slow');
						var view = this;
						brite.display("ZoomableChart", view.$el.find(".ChartContainer-ZoomableChart"));
>>>>>>> f6e33e1a4d6c3bb9b6fd40c2c9610432dbf886bf
						break;
					default:
						break;
				}
			}
		}
	});	
})();


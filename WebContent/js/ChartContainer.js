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
		
			'click; .hideTableBtn':function(event){
				console.log('about to hide the table');			
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
			}
		},
		
		docEvents:{
			'DO_SELECT_SHOW_CHART': function(event, type){
				switch(type){
					case 'spline' :
						ajaxCall('graphics/chart/retreiveTemp', displaySplineChart);
						break;
					case 'realTime' :
						//displayRealTimeChart();
						break;
					default:
						break;
				}
			}
		}
	});	
})();


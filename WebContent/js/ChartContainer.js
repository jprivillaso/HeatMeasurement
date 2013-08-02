(function(){
	
	var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	var api = function(url, resultHandlerFn){
		response = [];
		$.ajax({
			type : 'GET',
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
	
	var displayRealTimeChart = function(){
        $('#ChartContainer-Chart').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function() {
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function() {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: (function() {
                    // generate an array of random data
                    var data = [];
                    var time = (new Date()).getTime(), i;
                                    
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                })()
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
			}
		},
		
		docEvents:{
			'DO_SELECT_SHOW_CHART': function(event, type){
				switch(type){
					case 'spline' :
						api('graphics/chart/retreiveTemp', displaySplineChart);
						break;
					case 'realTime' :
						displayRealTimeChart();
						break;
					default:
						break;
				}
			}
		}
	});	
})();

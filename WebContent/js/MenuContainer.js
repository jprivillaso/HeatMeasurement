(function(){
	brite.registerView("MenuContainer", {emptyParent : true}, {
		create: function(){
			return render("tmpl-MenuContainer");
		},
		
		postDisplay: function(){
		}, 
		
		events: {
			'click; .displayChartBtn':function(){
				console.log('button pressed');
			},
			
			'click; #type-line': function(){
				this.$el.trigger("DO_SELECT_SHOW_CHART", 'spline');
			},
			
			'click; #type-realTime': function(){
				this.$el.trigger("DO_SELECT_SHOW_CHART", 'realTime');
			}
		}
	});
})();
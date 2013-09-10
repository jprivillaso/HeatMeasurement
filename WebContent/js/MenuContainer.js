(function(){
	brite.registerView("MenuContainer", {emptyParent : true}, {
		create: function(){
			return render("tmpl-MenuContainer");
		},
		
		postDisplay: function(){
		}, 
		
		events: {
			'click; #type-line': function(){
				this.$el.trigger("DO_SELECT_SHOW_CHART", 'spline');
			},
			
			'click; #type-realTime': function(){
				this.$el.trigger("DO_SELECT_SHOW_CHART", 'realTime');
			},
			
			'click; #type-zoomableTree' : function(){
				this.$el.trigger("DO_SELECT_SHOW_CHART", 'zoomable');
			},
			
			'click; #type-zoomable2' : function(){
				this.$el.trigger("DO_SELECT_SHOW_CHART", 'zoomable2');
			},
			
			'click; #type-zoomable3' : function(){
				this.$el.trigger("DO_SELECT_SHOW_CHART", 'zoomable3');
			}
		}
	});
})();
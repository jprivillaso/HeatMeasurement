(function(){
	brite.registerView("MainView", {emptyParent : true}, {
		create: function(){
			return render("tmpl-MainView");
		},
		
		postDisplay: function(){
			var view = this;
			brite.display("MenuContainer", view.$el.find(".MainView-MenuContainer"));
			brite.display("ChartContainer", view.$el.find(".MainView-ChartContainer"));
		}, 
		
		events: function(){
			
		}
	});
})();
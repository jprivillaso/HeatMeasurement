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
			}
		}
	});
})();
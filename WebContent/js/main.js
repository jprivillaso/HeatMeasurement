/**
 * Set brite.js to load on demand
 */
brite.viewDefaultConfig.loadTmpl = true;
brite.viewDefaultConfig.loadCss = true;

/**
 * First View to be displayed
 */
$(document).ready(function() {
	brite.display("MainView", "#pageWrapper");
	//ajaxCall('graphics/chart/random');
});

/**
 * Handlebars to charge the templates
 */
Handlebars.templates = Handlebars.templates || {};
function render(templateName, data) {
	var tmpl = Handlebars.templates[templateName];

	if (!tmpl) {
		var tmplContent = $("#" + templateName).html();
		tmpl = Handlebars.compile(tmplContent);
		Handlebars.templates[templateName] = tmpl;
	}
	return tmpl(data);
}

var ajaxCall = function(url){
	$.ajax({
		type : 'GET',
		url : url,
		success : function(result) {
			console.log(result);
		},
		error : function() {
			console.log('ERROR');
		}
	});
};
/*-- jQuery - htmlbuilder port
---- htmlbuilder originally from http://github.com/indieinvader/htmlbuilder/
----
--*/
;

(function($){
	$.fn.buildin = function() {
		if(typeof(builder)=='undefined') {
			throw('builder must be loaded to page: http://github.com/indieinvader/htmlbuilder/');
			return null;
		}
		var built, buildme, action = 'append'
		if(arguments.length==2 && typeof(arguments[0])) { action = arguments[0] }
		if(typeof(arguments[0])=='object') {
			buildme = arguments[0];
		} else {
			buildme = arguments[1];
		}
		built = builder.build(buildme);
		eval('this.'+action+'(built)');
	}
	
})(jQuery)
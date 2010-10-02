/*-- jQuery - htmlbuilder port
---- htmlbuilder originally from http://github.com/indieinvader/htmlbuilder/
----
---- $(s).buildIn(['p',{},'Appended by default'])
---- $(s).buildIn('prepend', ['p',{},'Other jquery insertion methods can be passed as the first parameter'])
--*/
;

(function($){
	var jQueryInserters = /append|prepend|before|after/i;

	$.fn.buildIn = function() {
		if(typeof(window.builder)=='undefined') { throw('builder must be loaded to page: http://github.com/indieinvader/htmlbuilder/'); return null; }
		if(window.builder.version!=="0.2.2") {throw('version might not sync up')}
		var built, buildme, _actionDefined = false, action = 'append';
		if(typeof(arguments[0])=='string' && arguments[0].match(jQueryInserters)) {
			_actionDefined = true;
			action = arguments[0].match(jQueryInserters)[0].toLowerCase();
		}
		built = window.builder.buildR(arguments[_actionDefined ? 1 : 0]);
		eval('this.'+action+'(built)');
		return this;
	}
	
})(jQuery)
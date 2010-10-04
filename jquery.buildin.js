/*-- jQuery Plug-in: "buildIn"
----  (author:Alex Dorey <http://github.com/dorey>)
---- =========================
---- > Based on the JSON syntax of indieinvader's htmlbuilder and JsonML.
---- > Allows jQuery enabled pages to describe html in an array syntax
---- > Defaults to using jQuery's "append" function, but can also use "prepend", "before", and "after"
---- > Also allows "replace", which is equivalent to $(selector).innerHTML="<element tree />"
----
---- Basic usage:
----   $(selector).buildIn(<tagName>, <tagAttributes>, <elementContents>)
----   example:
----     $('body').buildIn('a', {href:'#simple'}, 'A link is easy to add!')
----
--*/
;
(function($){
	function validateJson2HtmlArgument(argNum, arg) {
		//some validation could go here...
		return [arg]; //i didn't realize $(...).map(...) would flatten a shallow array
	}
	function json2html(){
		if(arguments.length==1) {
			if(typeof(arguments[0])==='string') {return arguments[0] }
			if(arguments[0] instanceof Array) {return json2html.apply(this, arguments[0])}
			return "";
		}
		if(arguments[1] instanceof Array) {
			//a temporary shortcut, but this means that the params are not in the standard format--
			// ("str", {obj}, <etc>*)
			//as such, it will process each item and join the results
			var i, concatted = "";
			for(i=0;i<arguments.length;i++) {concatted+=json2html(arguments[i])}
			return concatted;
		}
		var args = $(arguments).map(validateJson2HtmlArgument),
			tag = args[0],
			output="<" + tag;
		
		if (typeof(args[1])==='object' &&
		 	args[1] !== null) {
			$.each(args[1], function(k,v){
				output+=' '+k+'="'+v+'"';
			});
		}
		
		if(args.length<3) { //probably should use a better condition here
			return output+" />";
		}
		output+=">";

		for(var i=2;i<args.length; i++) {
			output+=json2html(args[i]);
		}
		output+="</"+tag+">";
		return output;
	}
	function json2dom(){
		return $(json2html.apply(this,arguments))
	}
	var jQueryInserters = /append|prepend|before|after|replace/i;
	function buildIn(){
		var args = arguments, action = 'append';
		if(typeof(arguments[0])==='string' && arguments[0].match(jQueryInserters)) {
			args = $(arguments).splice(1);
			action = arguments[0].match(jQueryInserters)[0].toLowerCase();
			if(action=='replace'){action='html';}
		}
		eval("this."+action+"(json2html.apply(this,args))");
	}
	$.json2html = json2html;
	$.json2dom = json2dom;
	$.fn.buildIn = buildIn;
})(jQuery);
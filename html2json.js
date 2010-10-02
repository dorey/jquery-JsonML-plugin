var html2json = (function(){
	function jsonIze(ar) {
		var z =[], cn = ar.childNodes;
		for(var i=0;i<cn.length;i++) {
			if(cn[i].nodeName=="#text") {
				(cn[i].textContent.trim()!=="") && z.push(cn[i].textContent.trim())
			} else if(cn[i].nodeName=="#comment") {
				//ignore comments
			} else {
				z.push([
					cn[i].nodeName.toLowerCase(),
					(function getAttributes(cin){
						if(!cin.attributes) {
							console.log(cin);
							debugger;
						}
						var atts = cin.attributes;
						var p={};
						for(var i=0;i<atts.length;i++) {
							p[atts[i].localName]=atts[i].nodeValue;
						}
						return p;
					})(cn[i]),
					jsonIze(cn[i])
				])
			}
		}
		if(z.length>0) {
			return z;
		} else {
			return null;
		}
	}
	return jsonIze(document.body);
})();
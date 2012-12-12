/** @preserve
 ten.js - lightweight JavaScript/HTML5 library
 @copyright 2012 Kevin von Flotow <vonflow@gmail.com>
 @license MIT License <http://opensource.org/licenses/MIT>
 */
;(function() {
	function doLog(name,message) {
		console.log("ten."+name+"(): "+message);
	}
	ten={
		version:"0.0.1",
		ready:function(func) {
			document.addEventListener("DOMContentLoaded",func,false);
		},
		find:function(theId) {
			var that=theId.replace(/^(?:#|\.)(.*?)$/,"$1"),
				element={};
			if (theId.indexOf("#")===0) {
				element=document.getElementById(that);
			} else if (theId.indexOf(".")===0) {
				element=document.getElementsByClassName(that);
			}

			//****************************
			// begin CLASS HANDLING
				function doClasses(that,classes,which) {
					function doIt(what) {
						var classlist=what.classList;
						ten.isString(classes)&&(classes=classes.split(" "));
						if (ten.isArray(classes)) {
							for (var i=0;i<classes.length;i++) {
								var thisClass=ten.trim(classes[i]);
								if (which=="add") {
									classlist.add(thisClass);
								} else if (which=="remove") {
									classlist.remove(thisClass);
								} else if (which=="toggle") {
									classlist.toggle(thisClass);
								}
							}
						} else {
							// unaccepted input, must be string or array
						}
					}
					if (that.length>0) {
						that.each(function(key,val) {
							doIt(val);
						});
					} else {
						doIt(that);
					}
					return that;
				}
				element.each=function(func) {
					for (var i=0;i<this.length;i++) {
						func(Object.keys(this)[i],this[i]);
					}
				}
				element.addClass=function(classes) {
					return doClasses(this,classes,"add");
				}
				element.removeClass=function(classes) {
					return doClasses(this,classes,"remove");
				}
				element.toggle=function(classes) {
					return doClasses(this,classes,"toggle");
				}
				element.hasClass=function(theClass) {
					return this.classList.contains(theClass);
				}
			// end CLASS HANDLING
			//****************************

			//****************************
			// begin HTML MANIPULATION
				function manipulateHtml(that,content,which) {
					ten.isString(content)&&(content=[content]);
					if (ten.isArray(content)) {
						ten.each(content,function(key,val) {
							that.innerHTML=
								which=="append"?that.innerHTML+val:(
								which=="prepend"?val+that.innerHTML:(
								which=="html"&&val)
							);
						});
					} else {
						doLog(which,"invalid parameters");
					}
					return that;
				}
				element.append=function(content) {
					return manipulateHtml(this,content,"append");
				}
				element.prepend=function(content) {
					return manipulateHtml(this,content,"prepend");
				}
				element.html=function(content) {
					return content?manipulateHtml(this,content,"html"):this.innerHTML;
				}
			// end HTML MANIPULATION
			//****************************

				element.text=function() {
					return ten.trim(this.innerHTML.replace(/<.*?>/g," "));
				}

			// finished building the object, return the element
			return element;
		},
		each:function(array,func) {
			var ret=false;
			if ((ten.isArray(array) || ten.isObject(array)) && ten.isFunction(func)) {
				for (var i=0;i<array.length;i++) {
					func(i,array[i]);
				}
				ret=true;
			} else {
				doLog("each","invalid parameters");
			}
			return ret;
		},
		isDefined:function(data) {
			return "undefined"!==typeof data;
		},
		isString:function(data) {
			return "string"===typeof data;
		},
		isObject:function(data) {
			return "[object Object]"===Object.prototype.toString.call(data);
		},
		isArray:Array.isArray || function(data) {
			return "[object Array]"===Object.prototype.toString.call(data);
		},
		isFunction:function(data) {
			return "function"===typeof data;
		},
		isNumeric:function(num) {
			return !isNaN(parseFloat(num)) && isFinite(num);
		},
		trim:function(string) {
			return ten.isString(string)?string.replace(/(^\s+|\s+$)/g,"").replace(/\s\s+/g," "):doLog("trim","invalid parameters");
		},
		ease:function(num) {
			if (ten.isNumeric(num)) {
				var ret=true;
				// do ease function here

			} else {
				doLog("ease","must be numeric");
			}
			return ten.isDefined(ret);
		}
	};
	/* typeof $=="undefined"&&($=ten); */
})();

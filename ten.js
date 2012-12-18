/** @preserve
 ten.js - lightweight JavaScript/HTML5 library
 @copyright 2012 Kevin von Flotow <vonflow@gmail.com>
 @license MIT License <http://opensource.org/licenses/MIT>
 */
(function(window) {
	var init={},
		_$,
		events={},
		displayCache={},
		domCache={},
		textCache={},
		matches=(function(doc) {
			matches=doc.matchesSelector || doc.webkitMatchesSelector || doc.mozMatchesSelector || doc.oMatchesSelector || doc.msMatchesSelector;
		})(document.documentElement),
		tempClasses={};

	function modifyHTML(that,content,which) {
		var len=that.length,i,regex=/<.*?>/g;
		if (_$.isArray(content)) {
			var arr=content;
			content="";
			for (i=0;i<arr.length;i++)
				content+=_$.isElement(arr[i])?arr[i].outerHTML:arr[i];
		}
		if (regex.test(content)) {
			if (len===0) {
				that[0].insertAdjacentHTML(which,content);
			} else {
				for (i=0;i<len;i++) {
					that[i].insertAdjacentHTML(which,content);
				}
			}
		} else {
			var text;
			if (textCache.hasOwnProperty(content)) {
				text=textCache[content];
			} else {
				text=document.createTextNode(content);
				textCache[content]=text;
			}
			if (which=="beforeend") {
				for (i=0;i<len;i++) {
					that[i].appendChild(text.cloneNode(true));
				}
			} else if (which=="afterbegin") {
				for (i=0;i<len;i++) {
					that[i].appendChild(text.cloneNode(true),that[i].firstChild);
				}
			}
		}
		return that;
	}

	function doClasses(that,classes,which) {
		// internal helper for class methods
		var i=0,ind=0;
		for (;i<that.length;i++) {
			var classlist=that[i].classList;
			if (_$.isString(classes)) {
				classlist[which](classes);
			} else if (_$.isArray(classes)) {
				for (;ind<classes.length;ind++) {
					classlist[which](classes[i]);
				}
			}
		}
		return that;
	}

	// core methods
	init.core={
		ten:true,
		version:"0.0.9",
		ajax:function(config) {
			var opt={
					url:false,
					type:"GET",
					data:false,
					dataType:"json",
					success:false,
					error:false,
					complete:false
				},
				dataTypes={
					json:"application/json"
				};
			opt=_$.extend(opt,config);
			var req=new XMLHttpRequest();
			var url="/json.php?foo=bar";
			req.open(opt.type,url,true);
			req.setRequestHeader("Content-Type", dataTypes[opt.dataType]+";charset=UTF-8");
			req.send();
			/* if (_$.isObject(obj)) {
				} else {
				doLog("ajax","parameter must be an object");
			} */
		},
		length:function(obj) {
			var size=0;
			if (_$.isObject(obj)) {
				for (var key in obj) {
					obj.hasOwnProperty(key)&&size++;
				}
			}
			return size;
		},
		extend:function() {
			var first=arguments[0]||[];
			if (arguments.length>=2) {
				var ret=true,i=0;
				arguments=Array.prototype.slice.call(arguments,1);
				for (;i<arguments.length;i++) {
					if (arguments[i]!=null) {
						_$.each(arguments[i],function(key,val) {
							key!==undefined&&(first[key]=val);
						});
					}
				}
			}
			return first;
		},
		ready:function(func) {
			document.addEventListener("DOMContentLoaded",func,false);
		},
		create:function(selector) {
			var regex=/^<(.*?)\s?\/?>(?:(.*?)<\/.*?>)?$/,
				matches=selector.match(regex),
				type=matches[1],
				html=matches[2];
			var element=document.createElement(type);
			html&&(element.innerHTML=html);
			return element;
		},
		find:function(selector) {
			if (domCache.hasOwnProperty(selector)) {
				selector=domCache[selector];
			} else {
				var orig=selector;
				selector=new ten();
				if (!_$.isElement(orig)) {
					var matches=document.querySelectorAll(orig);
					for (var i=0;i<matches.length;i++) {
						selector[i]=matches[i];
					}
					selector.length=matches.length;
					domCache[orig]=selector;
				} else {
					selector[0]=orig;
					selector.length=1; // might need to actually calculate this with .length()
				}
			}
			return selector;
		},
		on:function(name,selector,func,one) {
			var that=document;
			if (_$.isFunction(selector)) {
				func=selector;
				selector="*";
			}
			if (!(selector in events)) {
				events[selector]={};
			}
			if (!(name in events[selector])) {
				events[selector][name]={};
			} else {
				_$.off(name,selector,true);
			}
			if (one===1) {
				var orig=func;
				func=function(e) {
					orig.call(e.target,e);
					_$.off(name,selector);
				}
			}
			var finalFunc=function(e) {
				matches.call(e.target,selector)&&func.call(e.target,e);
			};
			events[selector][name].func=finalFunc;
			that.addEventListener(name,finalFunc,false);
			return that;
		},
		one:function(name,selector,func) {
			return _$.on(name,selector,func,1);
		},
		off:function(name,selector,keep) {
			var that=document;
			!selector&&(selector="*");
			if (selector in events) {
				if (name in events[selector]) {
					var handlers=events[selector][name];
					for (func in handlers) {
						that.removeEventListener(name,handlers.func,false);
						keep!==true&&(delete events[selector]);
					}
				}
			}
			return that;
		},
		each:function(data,func) {
			var ret=false;
			if (_$.isArray(data)) {
				ret=true;
				for (var i=0;i<data.length;i++) {
					func(i,data[i]);
				}
			} else if (_$.isObject(data)) {
				ret=true;
				for (key in data) {
					func(key,data[key]);
				}
			}
			return _$.find(ret);
		},
		isDefined:function(data) {
			return "undefined"!==typeof data;
		},
		isElement:function(data) {
			return data instanceof HTMLElement;
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
		isTen:function(data) {
			return typeof data!=="undefined" && data.ten===true;
		},
		trim:function(data) {
			function doTrim(str) {
				return str.replace(/(^\s+|\s+_$)/g,"").replace(/\s\s+/g," ");
			}
			if (_$.isString(data)) {
				data=doTrim(data);
			} else if (_$.isArray(data)) {
				_$.each(data,function(key,val) {
					_$.isString(val)&&(data[key]=doTrim(val));
				});
			}
			return data;
		}
	};

	// element methods
	init.el={
		ten:true,
		addClass:function(classes) {
			return doClasses(this,classes,"add");
		},
		removeClass:function(classes) {
			return doClasses(this,classes,"remove");
		},
		toggle:function(classes) {
			return doClasses(this,classes,"toggle");
		},
		hasClass:function(theClass) {
			return this.classList.contains(theClass);
		},
		clone:function() {
			return this.cloneNode(true);
		},
		append:function(content) {
			return modifyHTML(this,content,"beforeend");
		},
		prepend:function(content) {
			return modifyHTML(this,content,"afterbegin");
		},
		html:function(content) {
			var that=this;
			if (_$.isElement(content)) {
				that.innerHTML=content.outerHTML;
			} else {
				if (content) {
					var str=_$.isArray(content)?content.join(""):(_$.isString(content)||_$.isNumeric(content))&&content;
					if (that.length>1) {
						for (var i=0;i<that.length;i++) {
							that[i].innerHTML=str;
						}
					} else {
						that[0].innerHTML=str;
					}
				} else {
					that=that.innerHTML;
				}
			}
			return;
		},

		find:function(selector) {
			var ret=[],
				tempClass="ten-find-"+Math.floor((Math.random()*2e10)+1);
			this.addClass(tempClass);
			ret=document.querySelectorAll("."+tempClass+" "+selector);
			_$.find("."+tempClass).removeClass(tempClass);
			return ret;
		},

		each:function(func) {
			var that=this,
				keys=Object.keys(that),
				i=0;
			for (;i<that.length;i++) {
				func(keys[i],that[i]);
			}
			return that;
		},

		text:function() {
			// may need to remove .innerText & .textContent, and revert back to the original innerHTML
			return this.innerText || _$.trim(this.textContent) || _$.trim(this.innerHTML.replace(/<.*?>/g,""));
		},

		first:function() {
			return this.length>0?this[0]:this;
		},

		last:function() {
			return this.length>0?this[this.length-1]:this;
		},

		show:function() {
			for (var i=0;i<this.length;i++)
				this[i].style.display=displayCache[this];
			return this;
		},

		hide:function() {
			for (var i=0;i<this.length;i++) {
				var styles=window.getComputedStyle(this[i],null),
					current=styles.getPropertyValue("display"),
					thisStyle=this[i].getAttribute("style");
				displayCache[this]=current;
				this[i].style.display="none";
			}
			return this;
		}
	};

	// allow ten functions within ten
	_$=init.core;
	nl=init.nl;
	el=init.el;

	// function to return the ten object
	function ten(obj) {
		return obj;
	}

	// add element methods to ten object
	for (key in el) {
		ten.prototype[key]=el[key];
	}

	window.ten = window.$ = function(selector) {
		return selector?_$.isFunction(selector)?_$.ready(selector):(_$.isString(selector)&&selector.match(/^</))?_$.create(selector):_$.find(selector):init;
	}

	// append ten object to ten function, link it to window.ten and window.$
	window.ten = window.$ = init.core.extend(window.ten,init.core);
})(window);

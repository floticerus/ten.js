/**	@preserve ten.js - lightweight JavaScript/HTML5 library
	@copyright 2012 Kevin von Flotow <vonflow@gmail.com>
	@license MIT License <http://opensource.org/licenses/MIT> */
(function(window) {
	var init={},
		$,
		events={},
		displayCache={},
		textCache={},
		docEl=document.documentElement,
		matchesSel=docEl.matchesSelector || docEl.webkitMatchesSelector || docEl.mozMatchesSelector || docEl.oMatchesSelector || docEl.msMatchesSelector,
		eventClass=0;

	// function to return the ten object
	function ten(obj) {
		return obj;
	}

	function tenToString(data) {
		for (var i=0,len=data.length,str="";i<len;i++) {
			str+=data[i].outerHTML;
		}
		return str;
	}

	function arrayToString(data) {
		for (var len=data.length,str="",i=0;i<len;i++) {
			if (data[i] instanceof ten) {
				str+=tenToString(data[i]);
			} else if ($.isElement(data[i])) {
				str+=data[i].outerHTML;
			} else {
				str+=data[i];
			}
		}
		return str;
	}

	function modifyHTML(that,content,which) {
		var len=that.length,i,regex=/<.*?>/g;
		if ($.isArray(content)) {
			content=arrayToString(content);
		} else if (content instanceof ten) {
			content=tenToString(content);
		}
		if (which==="inner") {
			if (content) {
				var thatLen=that.length,i;
				if (thatLen>1) {
					for (i=0;i<thatLen;i++) {
						that[i].innerHTML=content;
					}
				} else {
					that[0].innerHTML=content;
				}
			} else {
				that=that.innerHTML;
			}
		} else {
			if (regex.test(content)) {
				for (i=0;i<len;i++) {
					that[i].insertAdjacentHTML(which,content);
				}
			} else {
				var text;
				if (textCache.hasOwnProperty(content) && textCache[content]!==false) {
					text=textCache[content];
				} else {
					text=document.createTextNode(content);
					// only cache the text node if it's been created twice
					textCache[content]=textCache.hasOwnProperty(content) && textCache[content]===false?text:false;
				}
				if (which=="afterbegin") {
					for (i=0;i<len;i++)
						that[i].insertBefore(text.cloneNode(true),that[i].firstChild);
				} else if (which=="beforeend") {
					for (i=0;i<len;i++)
						that[i].appendChild(text.cloneNode(true));
				}
			}
		}
		return that;
	}

	function doClasses(that,classes,which) {
		// internal helper for class methods
		for (var i=0,thatLen=that.length;i<thatLen;i++) {
			var classlist=that[i].classList;
			if ($.isString(classes)) {
				classlist[which](classes);
			} else if ($.isArray(classes)) {
				var ind,classesLen=classes.length;
				for (ind=0;ind<classesLen;ind++) {
					classlist[which](classes[i]);
				}
			}
		}
		return that;
	}

	function doTrim(str) {
		return str.replace(/(^\s+|\s+$)/g,"").replace(/\s\s+/g," ");
	}

	// core methods
	init.core=$={
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
			opt=$.extend(opt,config);
			var req=new XMLHttpRequest();
			var url="/json.php?foo=bar";
			req.open(opt.type,url,true);
			req.setRequestHeader("Content-Type", dataTypes[opt.dataType]+";charset=UTF-8");
			req.send();
			/* if ($.isObject(obj)) {
				} else {
				doLog("ajax","parameter must be an object");
			} */
		},
		length:function(obj) {
			var size=0;
			if ($.isObject(obj)) {
				for (var key in obj) {
					obj.hasOwnProperty(key)&&size++;
				}
			}
			return size;
		},
		extend:function() {
			var first=arguments[0]||[];
			if (arguments.length>=2) {
				arguments=Array.prototype.slice.call(arguments,1);
				var ret=true,i,argLen=arguments.length;
				for (i=0;i<argLen;i++) {
					if (arguments[i]!=null) {
						$.each(arguments[i],function(key,val) {
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
			// might want to cache these if the same element is created twice
			var regex=/^<(.*?)\s?\/?>(?:(.*?)<\/.*?>)?$/,
				matches=selector.match(regex),
				type=matches[1],
				html=matches[2];
			var element=document.createElement(type);
			html&&(element.innerHTML=html);
			return $.find(element);
		},
		find:function(selector,cache) {
			var orig=selector;
			selector=new ten();
			if ($.isElement(orig) || orig instanceof HTMLDocument) {
				selector[0]=orig;
				selector.length=1; // might need to actually calculate this with .length()
			} else {
				var matches=document.querySelectorAll(orig),i,matchesLen=matches.length;
				for (i=0;i<matchesLen;i++) {
					selector[i]=matches[i];
				}
				selector.length=matches.length;
			}
			return selector;
		},
		each:function(data,func) {
			var ret=false;
			if ($.isArray(data)) {
				ret=true;
				for (var i=0,dataLen=data.length;i<dataLen;i++) {
					func(i,data[i]);
				}
			} else if ($.isObject(data)) {
				ret=true;
				for (key in data) {
					func(key,data[key]);
				}
			}
			return $.find(ret);
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
			return data instanceof ten;
		},
		trim:function(data) {
			// function( text ) { return (text || "").replace( /^(\s|\u00A0)+|(\s|\u00A0)+$/g, "" );}
			if ($.isString(data)) {
				data=doTrim(data);
			} else if ($.isArray(data)) {
				$.each(data,function(key,val) {
					$.isString(val)&&(data[key]=doTrim(val));
				});
			}
			return data;
		}
	};

	// element methods
	init.el=ten.prototype={
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
			return this[0].classList.contains(theClass);
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
			return modifyHTML(this,content,"inner");
		},
		find:function(selector) {
			var ret=[],
				tempClass="ten-find-"+Math.floor((Math.random()*2e10)+1);
			this.addClass(tempClass);
			ret=$.find("."+tempClass+" "+selector);
			this.removeClass(tempClass);
			return ret;
		},

		each:function(func) {
			var keys=Object.keys(this),
				thatLen=this.length,i;
			for (i=0;i<thatLen;i++) {
				func(keys[i],this[i]);
			}
			return this;
		},

		text:function() {
			// may need to remove .innerText & .textContent, and revert back to the original innerHTML
			return this.innerText || $.trim(this.textContent) || $.trim(this.innerHTML.replace(/<.*?>/g,""));
		},

		first:function() {
			return this.length>0?this[0]:this;
		},

		last:function() {
			return this.length>0?this[this.length-1]:this;
		},

		show:function() {
			for (var i=0,thisLen=this.length;i<thisLen;i++)
				this[i].style.display=displayCache[this];
			return this;
		},

		hide:function() {
			for (var i=0,thisLen=this.length;i<thisLen;i++) {
				var styles=window.getComputedStyle(this[i],null),
					current=styles.getPropertyValue("display"),
					thisStyle=this[i].getAttribute("style");
				displayCache[this]=current;
				this[i].style.display="none";
			}
			return this;
		},
		on:function(name,selector,func,one) {
			if ($.isFunction(selector)) {
				func=selector;
				selector=undefined;
			}
			/* if ($.isElement(selector)) {
				$.find(selector,false).addClass("ten-event-"+eventClass++);
			} */
			if (!(selector in events)) {
				events[selector]={};
			}
			for (var i=0,thisLen=this.length;i<thisLen;i++) {
				if (!(name in events[selector])) {
					events[selector][name]={};
				} else {
					$.find(this[i]).off(name,selector,true);
				}
				if (one===1) {
					var orig=func;
					func=function(e) {
						orig.call(e.target,e);
						$.find(this[i]).off(name,selector);
					}
				}
				var finalFunc=function(e) {
					func.call(e.target,e);
					// matchesSel.call(e.target,selector)&&func.call(e.target,e);
				};
				events[selector][name].func=finalFunc;
				this[i].addEventListener(name,finalFunc,false);
			}
			return this;
		},
		one:function(name,selector,func) {
			return this.on(name,selector,func,1);
		},
		off:function(name,selector,keep) {
			selector=selector||undefined;
			if (selector in events) {
				if (name in events[selector]) {
					var handlers=events[selector][name];
					for (func in handlers) {
						for (var i=0;i<length;i++)
							this[i].removeEventListener(name,handlers.func,false);
						keep!==true&&(delete events[selector]);
					}
				}
			}
			return this;
		}
	};

	function tenInit(selector) {
		return selector?$.isFunction(selector)?$.ready(selector):($.isString(selector)&&selector.match(/^</))?$.create(selector):$.find(selector):init;
	}

	window.ten = window.$ = $.extend(tenInit,init.core);
	
})(window);

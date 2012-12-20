/**	@preserve ten.js - lightweight JavaScript/HTML5 library
	@copyright 2012 Kevin von Flotow <vonflow@gmail.com>
	@license MIT License <http://opensource.org/licenses/MIT> */
(function(window) {
	var init={},
		_$,
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

	function modifyHTML(that,content,which) {
		var len=that.length,i,regex=/<.*?>/g;
		if (_$.isArray(content)) {
			var arr=content,arrLen=arr.length;
			content="";
			for (i=0;i<arrLen;i++)
				content+=_$.isTen(arr[i])?arr[i].outerHTML:arr[i];
		}
		if (content instanceof ten) {
			for (i=0,tenLen=content.length,newContent="";i<tenLen;i++) {
				newContent+=content[i].outerHTML;
			}
			content=newContent;
		}
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
			} else {
				for (i=0;i<len;i++)
					that[i].appendChild(text.cloneNode(true));
			}
		}
		return that;
	}

	function doClasses(that,classes,which) {
		// internal helper for class methods
		for (var i=0,thatLen=that.length;i<thatLen;i++) {
			var classlist=that[i].classList;
			if (_$.isString(classes)) {
				classlist[which](classes);
			} else if (_$.isArray(classes)) {
				var ind,classesLen=classes.length;
				for (ind=0;ind<classesLen;ind++) {
					classlist[which](classes[i]);
				}
			}
		}
		return that;
	}

	// core methods
	init.core=window.ten=window.$=_$={
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
				arguments=Array.prototype.slice.call(arguments,1);
				var ret=true,i,argLen=arguments.length;
				for (i=0;i<argLen;i++) {
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
			// might want to cache these if the same element is created twice
			var regex=/^<(.*?)\s?\/?>(?:(.*?)<\/.*?>)?$/,
				matches=selector.match(regex),
				type=matches[1],
				html=matches[2];
			var element=document.createElement(type);
			html&&(element.innerHTML=html);
			return _$.find(element);
		},
		find:function(selector,cache) {
			var orig=selector;
			selector=new ten();
			if (_$.isElement(orig) || orig instanceof HTMLDocument) {
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
			if (_$.isArray(data)) {
				ret=true;
				for (var i=0,dataLen=data.length;i<dataLen;i++) {
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
			return data instanceof ten;
		},
		trim:function(data) {
			// function( text ) { return (text || "").replace( /^(\s|\u00A0)+|(\s|\u00A0)+$/g, "" );}
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
			var that=this;
			if (_$.isElement(content)) {
				that.innerHTML=content.outerHTML;
			} else {
				if (content) {
					var str=_$.isArray(content)?content.join(""):(_$.isString(content)||_$.isNumeric(content))&&content,
						thatLen=that.length,i;
					if (thatLen>1) {
						for (i=0;i<thatLen;i++) {
							that[i].innerHTML=str;
						}
					} else {
						that[0].innerHTML=str;
					}
				} else {
					that=that.innerHTML;
				}
			}
			return that;
		},

		find:function(selector) {
			var ret=[],
				tempClass="ten-find-"+Math.floor((Math.random()*2e10)+1);
			this.addClass(tempClass);
			ret=_$.find("."+tempClass+" "+selector);
			this.removeClass(tempClass);
			return ret;
		},

		each:function(func) {
			var that=this,
				keys=Object.keys(that),
				thatLen=that.length,i;
			for (i=0;i<thatLen;i++) {
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
			if (_$.isFunction(selector)) {
				func=selector;
				selector=undefined;
			}
			/* if (_$.isElement(selector)) {
				_$.find(selector,false).addClass("ten-event-"+eventClass++);
			} */
			if (!(selector in events)) {
				events[selector]={};
			}
			for (var i=0,thisLen=this.length;i<thisLen;i++) {
				if (!(name in events[selector])) {
					events[selector][name]={};
				} else {
					_$.find(this[i]).off(name,selector,true);
				}
				if (one===1) {
					var orig=func;
					func=function(e) {
						orig.call(e.target,e);
						_$.find(this[i]).off(name,selector);
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

	window.ten = window.$ = function(selector) {
		return selector?_$.isFunction(selector)?_$.ready(selector):(_$.isString(selector)&&selector.match(/^</))?_$.create(selector):_$.find(selector):init;
	}
})(window);

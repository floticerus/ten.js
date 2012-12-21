/**	@preserve ten.js
	@copyright 2012 Kevin von Flotow <vonflow@gmail.com>
	@license MIT License <http://opensource.org/licenses/MIT> */
(function(window) {
	var init={},
		$,
		events={},
		displayCache={},
		textCache={},
		doc=window.document,
		docEl=doc.documentElement,
		matchesSel=docEl.matchesSelector || docEl.webkitMatchesSelector || docEl.mozMatchesSelector || docEl.oMatchesSelector || docEl.msMatchesSelector,
		eventClass=0;

	function tenInit(selector) {
		return new ten(selector);
	}

	// main ten function
	function ten(selector) {
		return selector?$.isFunction(selector)?$.ready(selector):($.isString(selector)&&selector.indexOf("<")===0)?$.create(selector):$.find(selector):selector;
	}

	// convert a ten object into a string using the outerHTML of each element
	function tenToString(data) {
		for (var i=0,len=data.length,str="";i<len;i++)
			str+=data[i].outerHTML;
		return str;
	}

	// convert an array into a string
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

	// function used for append, prepend, and html methods
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
					text=doc.createTextNode(content);
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

	// internal helper for class methods. uses HTML5 classList API (will not work on IE9 and below)
	function doClasses(that,classes,which) {
		for (var i=0,thatLen=that.length;i<thatLen;i++) {
			var classlist=that[i].classList;
			if ($.isString(classes)) {
				classlist[which](classes);
			} else if ($.isArray(classes)) {
				for (var ind=0,classesLen=classes.length;ind<classesLen;ind++)
					classlist[which](classes[i]);
			}
		}
		return that;
	}

	function doTrim(str) {
		return str.replace(/(^\s+|\s+$)/g,"").replace(/\s\s+/g," ");
	}

	// function to add parameters to a URL
	// usage: addParam("http://localhost/index.php","foo=bar");
	function addParam(url,param) {
		$.isArray(param)&&(param=arrayToString(param));
		url=url.indexOf("?") != -1 ? url.split("?")[0]+"?"+param+"&"+url.split("?")[1] : (url.indexOf("#") != -1 ? url.split("#")[0]+"?"+param+"#"+ url.split("#")[1] : url+'?'+param);
		return url;
	}

	// core methods
	init.core=$={
		version:"0.0.10",
		getScript:function(url,func) {
			var script=doc.createElement("script");
			script.type="application/javascript";
			script.async=true;
			script.src=url;
			script.onload=script.onreadystatechange=function() {
				$.isFunction(func)&&func();
				script.onload=script.onreadystatechange=null;
			};
			doc.getElementsByTagName("head")[0].appendChild(script);
			return script;
		},
		ajax:function(config) {
			var opt={
					url:false,
					type:"GET",
					data:false,
					dataType:"html",
					charset:"UTF-8",
					success:false,
					error:false,
					complete:false,
					cache:true,
					target:false
				},
				dataTypes={
					json:"application/json",
					jsonp:"application/javascript",
					html:"text/html",
					plain:"text/plain"
				};
			opt=$.extend(opt,config);
			opt.dataType=opt.dataType.toLowerCase();
			opt.type=opt.type.toUpperCase();
			opt.charset=opt.charset.toUpperCase();
			if (typeof opt.url==="string" && dataTypes.hasOwnProperty(opt.dataType)) {
				if (opt.cache===false) {
					var date=new Date();
					opt.url=addParam(opt.url,"_="+date.getTime());
				}
				var req=new XMLHttpRequest();
				req.open(opt.type,opt.url,true);
				req.setRequestHeader("Content-Type", dataTypes[opt.dataType]+";charset="+opt.charset);
				req.send();
				req.onreadystatechange=function() {
					if (req.readyState===4) {
						if (req.status===200) {
							var data=req.responseXML || req.responseText;
							opt.success.call($.isTen(opt.target)?opt.target:this,data);
						} else if ($.isFunction(opt.error)) {
							opt.error.call($.isTen(opt.target)?opt.target:this,req.statusText);
						}
					}
					req.onreadystatechange=null;
				};

			} else {
				// error - either url isn't a string or dataType is invalid
			}
		},
		length:function(obj) {
			var size=0,key;
			if ($.isObject(obj)) {
				for (key in obj) {
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
			doc.addEventListener("DOMContentLoaded",func,false);
		},
		create:function(selector) {
			// might want to cache these if the same element is created twice
			var regex=/^<(.*?)\s?\/?>(?:(.*?)<\/.*?>)?$/,
				matches=selector.match(regex),
				type=matches[1],
				html=matches[2];
			var element=doc.createElement(type);
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
				var matches=doc.querySelectorAll(orig),i,matchesLen=matches.length;
				for (i=0;i<matchesLen;i++) {
					selector[i]=matches[i];
				}
				selector.length=matches.length;
			}
			return selector;
		},
		each:function(data,func) {
			var ret=false,len=data.length,i;
			if ($.isArray(data)) {
				ret=true;
				for (i=0;i<len;i++) {
					func(i,data[i]);
				}
			} else if ($.isObject(data)) {
				var keys=Object.keys(data);
				ret=true;
				/* for (i=0;i<len;i++)
					func(keys[i],data[key]); */
				for (key in data) {
					func(key,data[key]);
				}
			}
			return ret;
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
		/* clone:function() {
			return this.cloneNode(true);
		}, */
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
				len=this.length,i;
			for (i=0;i<len;i++)
				func(keys[i],this[i]);
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
			var len=this.length;
			return len>0?this[len-1]:this;
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
					var handlers=events[selector][name],i;
					for (func in handlers) {
						for (i=0;i<length;i++)
							this[i].removeEventListener(name,handlers.func,false);
						keep!==true&&(delete events[selector]);
					}
				}
			}
			return this;
		},
		load:function(url,func) {
			$.ajax({
				url:url,
				target:this,
				success:function(data) {
					for (var i=0,len=this.length;i<len;i++)
						this[i].innerHTML=data;
				},
				error:function(err) {
					func.call(this,err);
				}
			});
		}
	};

	window.ten = window.$ = $.extend(tenInit,$);

})(window);

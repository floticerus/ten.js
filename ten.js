/**	@preserve ten.js
	@copyright 2012-2013 Kevin von Flotow <vonflow@gmail.com>
	@license MIT License <http://opensource.org/licenses/MIT> */
(function(window,undefined) {
	var $={},
		elements={},
		events={},
		displayCache={},
		textCache={},
		interval=[],
		doc=window.document,
		docEl=doc.documentElement,
		matchesSel=docEl.matchesSelector || docEl.webkitMatchesSelector || docEl.mozMatchesSelector || docEl.oMatchesSelector || docEl.msMatchesSelector || oldMatchesSelector,
		cssFix=/[\-\s_]./g,
		addHack="add",
		removeHack="remove",
		toggleHack="toggle",
		containsHack="contains";


	function oldMatchesSelector(selector) {
		var node=$.isElement(this)?this.parentNode:doc,
			elems=node.querySelectorAll(selector),
			len=elems.length,
			i;
		for (i=0;i<len;i++) {
			if (elems[i]===this)
				return true;
		}
		return false;
	}

	function ten(selector) {
		return selector?isFunction(selector)?$.ready(selector):($.isString(selector)&&selector.indexOf("<")===0)?$.create(selector):$.find(selector):selector;
	}

	function tenInit(selector) {
		return new ten(selector);
	}

	// convert a ten object into a string using the outerHTML of each element
	function tenToString(data) {
		var str="";
		doCoreEach(data,function(key,val) {
			str+=val.outerHTML;
		});
		/* for (var i=0,len=data.length,str="";i<len;i++)
			str+=data[i].outerHTML; */
		return str;
	}

	// convert an array into a string
	function arrayToString(data) {
		var str="";
		doCoreEach(data,function(key,val) {
			if (val instanceof ten) {
				str+=tenToString(val);
			} else if ($.isElement(val)) {
				str+=val.outerHTML;
			} else {
				str+=val;
			}
		});
		return str;
	}

	function isFunction(data) {
		return "function"===typeof data;
	}

	// function used for append, prepend, and html methods
	function modifyHTML(that,content,which) {
		var len=that.length,i,regex=/<.*?>/g;
		if (len<1) {
			return that;
		}
		if ($.isArray(content)) {
			content=arrayToString(content);
		} else if (content instanceof ten) {
			content=tenToString(content);
		}
		if (which==="inner") {
			if (content) {
				var thatLen=that.length;
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
			if (regex.test(content) || which=="afterend") {
				doCoreEach(that,function(key,val) {
					val.insertAdjacentHTML(which,content);
				});
				/* for (i=0;i<len;i++) {
					that[i].insertAdjacentHTML(which,content);
				} */
			} else {
				var text;
				if (textCache.hasOwnProperty(content) && textCache[content]!==false) {
					text=textCache[content];
				} else {
					text=doc.createTextNode(content);
					textCache[content]=textCache.hasOwnProperty(content) && textCache[content]===false?text:false;
				}
				if (which=="afterbegin") {
					doCoreEach(that,function(key,val) {
						val.insertBefore(text.cloneNode(true),val.firstChild);
					});
					/* for (i=0;i<len;i++)
						that[i].insertBefore(text.cloneNode(true),that[i].firstChild); */
				} else if (which=="beforeend") {
					doCoreEach(that,function(key,val) {
						val.appendChild(text.cloneNode(true));
					});
					/* for (i=0;i<len;i++)
						that[i].appendChild(text.cloneNode(true)); */
				} else if (which=="beforebegin") {
					doCoreEach(that,function(key,val) {
						val.insertBefore(text.cloneNode(true),val);
					});
					/* for (i=0;i<len;i++)
						that[i].insertBefore(text.cloneNode(true),that[i]); */
				}
			}
		}
		return that;
	}

	function classListFallback(which,classes) {
		for (var current=which.className?which.className.split(" "):[],len=current.length,i=0;i<len;i++)
			this[i]=current[i];
		this.which=which;
		this.length=i;
		return this;
	}

	classListFallback.prototype={
		add:function(classes) {
			doClassesFallback(this,classes,addHack);
		},
		remove:function(classes) {
			doClassesFallback(this,classes,removeHack);
		},
		toggle:function(classes) {
			doClassesFallback(this,classes,toggleHack);
		},
		contains:function(classes) {
			return doClassesFallback(this,classes,containsHack);
		}
	};

	function doClassesFallback(that,classes,which) {
		// needs some changing... not dry enough
		var elem=that.which;
		if ($.isString(classes)) {
			if (classes.indexOf(" ")>-1) {
				classes=classes.split(" ");
			} else {
				classes=[classes];
			}
		}
		for (var i=0,len=classes.length,currentClasses="";i<len;i++) {
			var reg=new RegExp("\\b"+classes[i]+"\\b","g");
			if (which==addHack && !reg.test(elem.className)) {
				elem.className+=(elem.className.length>0?" ":"")+classes[i];
			} else if (which==removeHack && reg.test(elem.className)) {
				elem.className=elem.className.replace(new RegExp("(?:\s+)?"+classes[i]+"(?:\s+)?"),"");
			} else if (which==toggleHack) {
				if (reg.test(elem.className)) {
					elem.className=elem.className.replace(new RegExp("(?:\s+)?"+classes[i]+"(?:\s+)?"),"");
				} else {
					elem.className+=(elem.className.length>0?" ":"")+classes[i];
				}
			} else if (which==containsHack) {
				return reg.test(elem.className);
			}
		}
		elem.className=$.trim(elem.className);
	}

	function doClasses(that,classes,which) {
		doCoreEach(that,function(key,val) {
			if (val) {
				var classlist=val.classList || new classListFallback(val,classes);
				// var classlist=new classListFallback(that[i],classes);
				if ($.isString(classes)) {
					if (which==containsHack) {
						return classlist[which](classes);
					} else {
						classlist[which](classes);
					}
				} else if ($.isArray(classes)) {
					doCoreEach(classes,function(key2,val2) {
						classlist[which](val2);
					});
				}
			}
		});
		return that;
	}

	function doTrim(str) {
		return str.replace(/(^\s+|\s+$)/g,"").replace(/\s\s+/g," ");
	}

	// function to add parameters to a URL
	// usage: addParam("http://localhost/index.php","foo=bar");
	// original code found on stackoverflow, source unknown
	function addParam(url,param) {
		$.isArray(param)&&(param=arrayToString(param));
		url=url.indexOf("?") != -1 ? url.split("?")[0]+"?"+param+"&"+url.split("?")[1] : (url.indexOf("#") != -1 ? url.split("#")[0]+"?"+param+"#"+ url.split("#")[1] : url+'?'+param);
		return url;
	}

	function doCSS(that,one,two) {
		if (two) {
			(one!=="opacity"&&$.isNumeric(two))&&(two+="px");
			doCoreEach(that,function(key,val) {
				val.style[camelCase(one)]=two;
			});
			/* for (var i=0,len=that.length;i<len;i++)
				that[i].style[camelCase(one)]=two; */
		} else if (window.getComputedStyle) {
			return window.getComputedStyle(that[0],null).getPropertyValue(one);
			// return window.getComputedStyle?window.getComputedStyle(that[0],null).getPropertyValue(one):that[0].currentStyle[camelCase(one)];
		} else if (that[0] && that[0].currentStyle) {
			return that[0].currentStyle[camelCase(one)];
		}
		return that;
	}

	function camelCase(str) {
		if (cssFix.test(str)) {
			str=str.replace(cssFix,function(v) {
				return v.slice(1).toUpperCase();
			});
		}
		return str;
	}

	function getFile(url,func,which) {
		var what=doc.createElement("script"),
			where=doc.getElementsByTagName("head")[0] || doc.getElementsByTagName("body")[0];
		if (which=="js") {
			what.async=true;
			what.src=url;
		} else if (which=="css") {
			link.type="text/css";
			link.rel="stylesheet";
			link.href=url;
		} else {
			return false;
		}
		what.onload=what.onreadystatechange=function() {
			func&&func();
			what.onload=what.onreadystatechange=null;
		};
		where.appendChild(what);
		return what;
	}

	function preventDefaultFix(e) {
		return e.preventDefault?e.preventDefault:function() {
			e.returnValue=false;
		};
	}

	function isWholeNumber(num) {
		return num%1!=0?false:true;
	}

	function doCoreEach(data,func) {
		var ret=false;
		if ($.isArray(data)) {
			ret=true;
			for (var i=0,len=data.length;i<len;i++)
				func(i,data[i]);
		} else if (data instanceof ten) {
			ret=true;
			data.each(function(index,element) {
				func(index,element);
			});
		} else if ($.isObject(data)) {
			ret=true;
			for (var key in data)
				func(key,data[key]);
		}
		return ret;
	}

	function offsetFallback() {
		// fallback for .offset() method
		return {
			top:0,
			left:0
		}
	}

	// core methods
	$={
		version:"0.0.10",
		getScript:function(url,func) {
			return getFile(url,func,"js");
		},
		getCSS:function(url,func) {
			return getFile(url,func,"css");
		},
		parseJSON:function(json) {
			try {
				ret=JSON.parse(json);
			} catch(err) {
				ret=(function() {
					return json;
				})();
			}
			return ret;
		},
		ajax:function(config) {
			var opt=$.extend({
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
				},config),
				dataTypes={
					json:"application/json",
					jsonp:"application/javascript",
					html:"text/html",
					plain:"text/plain"
				};
			opt.dataType=opt.dataType.toLowerCase();
			opt.type=opt.type.toUpperCase();
			opt.charset=opt.charset.toUpperCase();
			if (typeof opt.url==="string" && dataTypes.hasOwnProperty(opt.dataType)) {
				if (opt.cache===false) {
					var date=new Date();
					opt.url=addParam(opt.url,"_="+date.getTime());
				}
				// support for older browsers?
				// var req=window.XMLHttpRequest?new XMLHttpRequest():window.ActiveXObject&&new ActiveXObject("MSXML2.XMLHTTP.3.0");
				var req=new XMLHttpRequest(),
					dataType=dataTypes[opt.dataType];
				req.open(opt.type,opt.url,true);
				if (opt.type=="POST" && opt.data) {
					var params="";
					$.each(opt.data,function(key,val) {
						params=addParam(params,key+"="+val);
					});
					dataType="application/x-www-form-urlencoded";
					params=params.replace(/^\?/,"");
				}
				req.setRequestHeader("Content-Type", dataType+";charset="+opt.charset);
				req.send(params&&params);
				req.onreadystatechange=function() {
					if (req.readyState===4) {
						isFunction(opt.complete)&&opt.complete();
						if (req.status===200) {
							var data=req.responseText || req.responseXML;
							opt.dataType=="json"&&(data=$.parseJSON(data));
							opt.success.call(opt.target instanceof ten?opt.target:this,data);
						} else if (isFunction(opt.error)) {
							opt.error.call(opt.target instanceof ten?opt.target:this,req.statusText);
						}
						req.onreadystatechange=null;
					}
				};

			} else {
				// error - either url isn't a string or dataType is invalid
				opt.error.call(opt.target instanceof ten?opt.target:this,"invalid usage");
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
			var arg=arguments,
				first=arg[0]||[];
			if (arg.length>=2) {
				arg=Array.prototype.slice.call(arg,1);
				doCoreEach(arg,function(key,val) {
					if (val!=null) {
						doCoreEach(val,function(key2,val2) {
							key2!==undefined&&(first[key2]=val2);
						});
					}
				});
			}
			return first;
		},
		ready:function(func) {
			var state=doc.readyState;
			if (state=="complete" || state=="loaded") {
				func();
			} else {
				doc.onreadystatechange=function() {
					state=doc.readyState;
					if (state=="complete" || state=="loaded") {
						func();
						doc.onreadystatechange=null;
					}
				}
			}
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
		find:function(selector) {
			var orig=selector;
			selector=new ten();
			if ($.isString(orig)) {
				var matches=doc.querySelectorAll(orig)||[],i,matchesLen=matches.length;
				for (i=0;i<matchesLen;i++) {
					selector[i]=matches[i];
				}
				selector.length=matches.length;
			} else {
				if ($.isArray(orig)) {
					for (var i=0,len=orig.length;i<len;i++) {
						selector[i]=orig[i];
					}
					selector.length=i;
				} else {
					selector[0]=orig;
					selector.length=1;
				}
			}
			return selector;
		},
		each:doCoreEach,
		isElement:function(data) {
			return (
			    typeof HTMLElement === "object" ? data instanceof HTMLElement : //DOM2
			    data && typeof data === "object" && data.nodeType === 1 && typeof data.nodeName==="string"
			);
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
		isNumeric:function(num) {
			// return num>-Infinity&&num<Infinity; // much faster but returns true on empty arrays... weird
			return !isNaN(parseFloat(num)) && isFinite(num);
		},
		isTen:function(data) {
			return data instanceof ten;
		},
		trim:function(data) {
			if (isFunction(data)) {
				data=data();
			} else if ($.isString(data)) {
				data=doTrim(data);
			} else if ($.isArray(data)) {
				doCoreEach(data,function(key,val) {
					$.isString(val)&&(data[key]=doTrim(val));
				});
			}
			return data;
		}
	};

	// element methods
	ten.prototype={
		addClass:function(classes) {
			return doClasses(this,classes,addHack);
		},
		removeClass:function(classes) {
			return doClasses(this,classes,removeHack);
		},
		toggleClass:function(classes) {
			return doClasses(this,classes,toggleHack);
		},
		hasClass:function(theClass) {
			// only work with first element
			return this[0]?this[0].classList?this[0].classList.contains(theClass):doClasses(this[0],theClass,containsHack):false;
		},
		clone:function() {
			// clones all elements within a ten object
			// returns new ten object
			var that=this,all=[];
			doCoreEach(this,function(key,val) {
				all[key]=val.cloneNode(true);
			});
			/* for (var i=0,len=this.length,all=[];i<len;i++)
				all[i]=this[i].cloneNode(true); */
			return $.find(all);
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
		before:function(content) {
			return modifyHTML(this,content,"beforebegin");
		},
		after:function(content) {
			return modifyHTML(this,content,"afterend");
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
			for (var i=0,len=this.length;i<len;i++)
				func(i,this[i]);
			return this;
		},
		text:function() {
			// may need to remove .innerText & .textContent, and revert back to the original innerHTML
			return this[0].innerText || this[0].textContent || this[0].innerHTML.replace(/<.*?>/g,"");
		},
		first:function() {
			return $.find(this[0]);
		},
		last:function() {
			return $.find(this[this.length-1]);
		},
		show:function() {
			doCoreEach(this,function(key,val) {
				val.style.display=displayCache[this];
			});
			/* for (var i=0,len=this.length;i<len;i++)
				this[i].style.display=displayCache[this]; */
			return this;
		},
		hide:function() {
			doCoreEach(this,function(key,val) {
				var styles=window.getComputedStyle(val,null),
					current=styles.getPropertyValue("display");
				(displayCache.hasOwnProperty(this) && displayCache[this]!="none")&&(displayCache[this]=current);
				val.style.display="none";
			});
			/* for (var i=0,len=this.length;i<len;i++) {
				var styles=window.getComputedStyle(this[i],null),
					current=styles.getPropertyValue("display");
				(displayCache.hasOwnProperty(this) && displayCache[this]!="none")&&(displayCache[this]=current);
				this[i].style.display="none";
			} */
			return this;
		},
		fadeOut:function(step,callback) {
			var that=this,
				newOpacity=that.css("opacity"),
				interval=setInterval(function() {
					newOpacity=newOpacity-step;
					if (newOpacity>step) {
						that.css({opacity:newOpacity});
					} else {
						callback.call(that);
						clearInterval(interval);
					}
				},25);
			return that;
		},
		on:function(name,selector,func,one) {
			if (isFunction(selector)) {
				func=selector;
				selector=undefined;
			}
			if (!(selector in events)) {
				events[selector]={};
			}
			var finalFunc=function(e) {
				e=e||window.event;
				e.target=e.target||e.srcElement;
				e.preventDefault=preventDefaultFix(e);
				if (selector && matchesSel.call(e.target,selector)) {
					func.call(e.target,e);
				} else if (selector && matchesSel.call(e.target,selector+" *")) {
					var node=e.target.parentNode;
					while (node!=null) {
						if (matchesSel.call(node,selector))
							break;
						node=node.parentNode;
					}
					func.call(node,e);
				} else if (!selector) {
					func.call(e.target,e);
				}
			};
			for (var i=0,thisLen=this.length;i<thisLen;i++) {
				var that=this[i];
				if (!(name in events[selector])) {
					events[selector][name]={};
				} else {
					$.find(that).off(name,selector,true);
				}
				if (one===1) {
					var orig=func;
					func=function(e) {
						e=e||window.event;
						e.target=e.target||e.srcElement;
						e.preventDefault=preventDefaultFix(e);
						orig.call(e.target,e);
						$.find(that).off(name,selector);
					}
				}
				events[selector][name].func=finalFunc;
				that.addEventListener?that.addEventListener(name,finalFunc,false):that.attachEvent("on"+name,finalFunc);
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
					var handlers=events[selector][name]/*,i,len=this.length*/;
					for (func in handlers) {
						doCoreEach(this,function(key,val) {
							val.removeEventListener?val.removeEventListener(name,handlers.func,false):val.detachEvent("on"+name,handlers.func);
						});
						/* for (i=0;i<len;i++)
							this[i].removeEventListener?this[i].removeEventListener(name,handlers.func,false):this[i].detachEvent("on"+name,handlers.func); */
						keep!==true&&(delete events[selector]);
					}
				}
			}
			return this;
		},
		load:function(url,func) {
			// shortcut for ten.ajax() with target set to this
			var that=this;
			$.ajax({
				url:url,
				target:that,
				success:function(data) {
					doCoreEach(that,function(key,val) {
						val.innerHTML=data;
					});
					/* for (var i=0,len=that.length;i<len;i++)
						that[i].innerHTML=data; */
					func&&func.call(that,data);
				},
				error:function(err) {
					func.call(that,err);
				}
			});
		},
		css:function(one,two) {
			var that=this;
			if ($.isString(one)) {
				return doCSS(that,one,two);
			} else if ($.isObject(one)) {
				doCoreEach(one,function(key,val) {
					doCSS(that,key,val);
				});
			}
			return that;
		},
		prop:function(prop,value) {
			return prop && !value && this[0].attributes[prop]?this[0].attributes[prop].value:value?this[0].setAttribute(prop,value):false;
		},
		width:function() {
			// need to set or get
			// needs to be more accurate
			return this[0].offsetWidth||this[0].clientWidth;
		},
		height:function() {
			// need to set or get
			// needs to be more accurate
			return this[0].offsetHeight||this[0].clientHeight;
		},
		offset:function() {
			return this[0].offsetTop?{top:this[0].offsetTop,left:this[0].offsetLeft}:offsetFallback(this[0]);
		},
		parent:function() {
			return $.find(this[0].parentNode);
		},
		is:function(selector) {
			return matchesSel.call(this[0],selector);
		},
		closest:function(selector) {
			var node=this[0];
			if (!matchesSel.call(node,selector)) {
				for (node=this[0].parentNode;null!=node && !matchesSel.call(node, selector);) {
					node=node.parentNode;
				}
			}
			return $.find(node);
		},
		hasParent:function(selector) {
			var node=this[0],ret=false;
			if (matchesSel.call(node,selector)) {
				ret=true;
			} else {
				for (node=this[0].parentNode;node!=null;node=node.parentNode) {
					if (node.parentNode && matchesSel.call(node,selector)) {
						ret=true;
						break;
					}
				}
			}
			return ret;
		},
		remove:function() {
			doCoreEach(this,function(key,val) {
				val.remove?val.remove():val.parentNode&&val.parentNode.removeChild(val);
			});
		},
		eq:function(num) {
			return isWholeNumber(num)&&this.length>0?$.find(this[num>0?num-1:num<=0&&this.length-1-(-num)]):false;
		}/* ,
		animate:function(obj,timer,callback) {
			// this function sucks, just experimenting
			doCoreEach(this,function(i,element) {
				var current=$.find(element);
				$.each(obj,function(key,val) {
					var reg=new RegExp(/^(.*?)(\D+)$/),
						initial=current.css(key).match(reg),
						start=initial[1],
						newInitial=val.match(reg),
						type=newInitial[2],
						distance=newInitial[1]-start,
						steps=distance/timer,
						currentVal=start;
					interval[current]=setInterval(function() {
						currentVal=+(currentVal<=newInitial[1]?currentVal+steps*15:currentVal-steps*15);
						if (currentVal<=newInitial[1]) {
							// current.css(key,currentVal+type);
							doCSS(current,key,currentVal+type);
						} else {
							clearInterval(interval[current]);
							callback&&$.isFunction(callback)&&callback();
						}
					},10);
				});
			});
			return this;
		} */
	};

	window.ten = $.extend(tenInit,$,{fn:ten.prototype});

})(window);

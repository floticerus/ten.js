/** @preserve
 ten.js - lightweight JavaScript/HTML5 library
 @copyright 2012 Kevin von Flotow <vonflow@gmail.com>
 @license MIT License <http://opensource.org/licenses/MIT>
 */
(function() {
	var _$={
		version:"0.0.3",
		events:{},
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
			if (_$.isObject(obj)) {
				var size=0,key;
				for (key in obj) {
					obj.hasOwnProperty(key)&&size++;
				}
			}
			return _$.isDefined(size)?size:false;
		},
		extend:function() {
			var first=arguments.length>0?arguments[0]:false;
			if (first!==false && arguments.length>=2) {
				var ret=true;
				arguments=Array.prototype.slice.call(arguments,1);
				for (var i=0;i<arguments.length;i++) {
					_$.each(arguments[i],function(target,val) {
						first[target]=val;
					});
				}
			}
			return _$.isDefined(ret)?first:false;
		},
		ready:function(func) {
			document.addEventListener("DOMContentLoaded",func,false);
		},
		find:function(selector,internal) {
			var element={};
			!internal&&(internal=document);
			if (!_$.isString(selector)) {
				element=selector;
			} else {
				if (selector.match(/^</)) {
					var regex=/^<(.*?)\s?\/?>(?:(.*?)<\/.*?>)?/,
						matches=selector.match(regex),
						type=matches[1],
						match=matches[2];
					element=document.createElement(type);
					match&&(element.innerHTML=match);
				} else {
					var that=selector.replace(/^(?:#|\.)(.*?)$/,"$1");
					if (selector.indexOf("#")===0) {
						element=internal.getElementById(that);
					} else if (selector.indexOf(".")===0) {
						element=internal.getElementsByClassName(that);
					}	
				}
			}
			var proto=element.__proto__;

			//****************************
			// begin CLASS HANDLING
				var doClasses=function(that,classes,which) {
					var classlist=that.classList;
					if (_$.isString(classes)) {
						classlist[which](classes);
					} else if (_$.isArray(classes)) {
						_$.each(classes,function(key,val) {
							classlist[which](val);
						});
					} else {
						// classes must be string or array
					}
					return that;
				}
				proto.addClass=function(classes) {
					return doClasses(this,classes,"add");
				}
				proto.removeClass=function(classes) {
					return doClasses(this,classes,"remove");
				}
				proto.toggle=function(classes) {
					return doClasses(this,classes,"toggle");
				}
				proto.hasClass=function(theClass) {
					return this.classList.contains(theClass);
				}
			// end CLASS HANDLING
			//****************************

			//****************************
			// begin HTML MANIPULATION
				var manipulateHtml=function(that,content,which) {
					_$.isString(content)&&(content=[content]);
					if (_$.isArray(content)) {
						for (var i=0;i<content.length;i++) {
							that.innerHTML=which=="append"?that.innerHTML+content[i]:(which=="prepend"&&content[i]+that.innerHTML);
						}
					}
					return that;
				}
				proto.append=function(content) {
					return _$.isElement(content)?(this.appendChild(content)):manipulateHtml(this,content,"append");
				}
				proto.prepend=function(content) {
					return manipulateHtml(this,content,"prepend");
				}
				proto.html=function(content) {
					var ret=this;
					if (_$.isElement(content)) {
						that.innerHTML+=content.outerHTML;
					} else {
						if (content) {
							var str=_$.isArray(content)?content.join(""):(_$.isString(content)||_$.isNumeric(content))&&content;
							if (this.length>1) {
								for (var i=0;i<this.length;i++) {
									this[i].innerHTML=str;
								}
							} else {
								this.innerHTML=str;
							}
						} else {
							ret=this.innerHTML;
						}
					}
					return ret;
				}
			// end HTML MANIPULATION
			//****************************

			//****************************
			// begin EVENT HANDLING
				proto.on=function(name,selector,func,one) {
					var events=_$.events;
					if (_$.isFunction(selector)) {
						func=selector;
						selector=undefined;
					}
					if (!(this in events)) {
						events[this]={};
					}
					if (!(name in events[this])) {
						events[this][name]={};
					}
					if (one===1) {
						var orig=func;
						func=function(e) {
							orig(e);
							this.off(name);
						}
					}
					events[this][name].func=func;
					that=selector?this.find(selector):this;
					that.addEventListener(name,func,false);
					return this;
				}

				proto.one=function(name,selector,func) {
					return this.on(name,selector,func,1);
				}

				proto.off=function(name) {
					if (this in _$.events) {
						if (name in _$.events[this]) {
							var handlers=_$.events[this][name];
							for (func in handlers) {
								this.removeEventListener(name,handlers.func,false);
							}
						}
					}
					return this;
				}
			//****************************
			// end EVENT HANDLING

				proto.find=function(selector) {
					return _$.find(selector,this);
				}

				proto.each=function(func) {
					var keys=Object.keys(this);
					for (var i=0;i<this.length;i++) {
						func(keys[i],this[i]);
					}
					return this;
				}
				proto.text=function() {
					// may need to remove .innerText & .textContent, and revert back to the original innerHTML
					return this.innerText || _$.trim(this.textContent) || _$.trim(this.innerHTML.replace(/<.*?>/g,""));
				}

			// finished building the object, return the element
			return element;
		},
		each:function(data,func) {
			var ret=false;
			if (_$.isFunction(func)) {
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
			}
			return ret;
		},
		isDefined:function(data) {
			return "undefined"!==typeof data;
		},
		isElement:function(data) {
			return _$.isDefined(data.nodeType);
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
	var proto=window.__proto__,ten=proto.ten;
	ten=function(selector) {
		return selector?_$.isFunction(selector)?_$.ready(selector):_$.find(selector):false;
	}
	proto.ten=_$.extend(ten,_$);
	typeof $==="undefined"&&($=ten);
})();

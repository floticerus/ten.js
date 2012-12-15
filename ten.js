/** @preserve
 ten.js - lightweight JavaScript/HTML5 library
 @copyright 2012 Kevin von Flotow <vonflow@gmail.com>
 @license MIT License <http://opensource.org/licenses/MIT>
 */
(function() {
	var _$={
		version:"0.0.3",
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
		find:function(theId) {
			var element={};
			if (!_$.isString(theId)) {
				element=theId;
			} else {
				// element=zest(theId);
				var that=theId.replace(/^(?:#|\.)(.*?)$/,"$1");
				if (theId.indexOf("#")===0) {
					element=document.getElementById(that);
				} else if (theId.indexOf(".")===0) {
					element=document.getElementsByClassName(that);
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
					return manipulateHtml(this,content,"append");
				}
				proto.prepend=function(content) {
					return manipulateHtml(this,content,"prepend");
				}
				proto.html=function(content) {
					return content?(this.innerHTML=_$.isArray(content)?content.join(""):(_$.isString(content)||_$.isNumeric(content))&&content):this.innerHTML;
				}
			// end HTML MANIPULATION
			//****************************

				proto.each=function(func) {
					var keys=Object.keys(this);
					for (var i=0;i<this.length;i++) {
						func(keys[i],this[i]);
					}
				}
				proto.text=function() {
					return _$.trim(this.innerHTML.replace(/<.*?>/g," "));
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
		},
		ease:function(num) {
			if (_$.isNumeric(num)) {
				var ret=true;
				// do ease function here

			}
			return _$.isDefined(ret);
		}
	};
	var proto=this.__proto__;
	proto.ten=function(selector) {
		return selector?_$.find(selector):false;
	}
	proto.ten=_$.extend(proto.ten,_$);
	typeof $==="undefined"&&(proto.$=proto.ten);
})();

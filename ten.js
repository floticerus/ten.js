/** @preserve
 ten.js - lightweight JavaScript/HTML5 library
 @copyright 2012 Kevin von Flotow <vonflow@gmail.com>
 @license MIT License <http://opensource.org/licenses/MIT>
 */
(function() {
	function doLog(name,message) {
		console.log("ten."+name+"(): "+message);
		return false;
	}
	ten={
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
			opt=ten.extend(opt,config);
			var req=new XMLHttpRequest();
			var url="/json.php?foo=bar";
			req.open(opt.type,url,true);
			req.setRequestHeader("Content-Type", dataTypes[opt.dataType]+";charset=UTF-8");
			req.send();
			/* if (ten.isObject(obj)) {

			} else {
				doLog("ajax","parameter must be an object");
			} */
		},
		length:function(obj) {
			if (ten.isObject(obj)) {
				var size=0,key; 
				for (key in obj) {
					obj.hasOwnProperty(key)&&size++;
				}
			} else {
				doLog("length","argument must be an object");
			}
			return ten.isDefined(size)?size:false;
		},
		extend:function() {
			var first=arguments.length>0?arguments[0]:doLog("extend","no arguments given");
			if (first!==false && arguments.length>=2) {
				var ret=true;
				arguments=Array.prototype.slice.call(arguments,1);
				for (var i=0;i<arguments.length;i++) {
					ten.each(arguments[i],function(target,value) {
						first[target]=value;
					});
				}
			} else {
				doLog("extend","must have at least 2 arguments");
			}
			return ten.isDefined(ret)?first:false;
		},
		ready:function(func) {
			document.addEventListener("DOMContentLoaded",func,false);
		},
		find:function(theId) {
			var element={};
			if (!ten.isString(theId)) {
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
				function doClasses(that,classes,which) {
					var classlist=that.classList;
					if (ten.isArray(classes)) {
						ten.each(classes,function(key,val) {
							classlist[which](val);
						});
					} else if (ten.isString(classes)) {
						classlist[which](classes);
					} else {
						// classes must be string or array
					}
					return that;
				}
				proto.each=function(func) {
					var keys=Object.keys(this);
					for (var i=0;i<this.length;i++) {
						func(keys[i],ten.find(this[i]));
					}
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
				function manipulateHtml(that,content,which) {
					ten.isString(content)&&(content=[content]);
					if (ten.isArray(content)) {
						for (var i=0;i<content.length;i++) {
							that.innerHTML=which=="append"?that.innerHTML+content[i]:(which=="prepend"&&content[i]+that.innerHTML);
						}
					} else {
						doLog(which,"invalid parameters");
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
					return content?(this.innerHTML=ten.isString(content)?content:ten.isArray(content)?content.join(""):doLog("html","argument expects a string or array"),this):this.innerHTML;
				}
			// end HTML MANIPULATION
			//****************************

				proto.text=function() {
					return ten.trim(this.innerHTML.replace(/<.*?>/g," "));
				}

			// finished building the object, return the element
			return element;
		},
		each:function(data,func) {
			var ret=false;
			if (ten.isFunction(func)) {
				if (ten.isArray(data)) {
					ret=true;
					for (var i=0;i<data.length;i++) {
						func(i,data[i]);
					}
				} else if (ten.isObject(data)) {
					ret=true;
					for (key in data) {
						func(key,data[key]);
					}
				} else {
					doLog("each","1st argument expects object or array");
				}
			} else {
				doLog("each","2nd argument expects function");
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
				return str.replace(/(^\s+|\s+$)/g,"").replace(/\s\s+/g," ");
			}
			if (ten.isString(data)) {
				data=doTrim(data);
			} else if (ten.isArray(data)) {
				ten.each(data,function(key,val) {
					ten.isString(val)&&(data[key]=doTrim(val));
				});
			}
			return data;
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
})();

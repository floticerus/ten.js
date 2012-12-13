/** @preserve
 ten.js - lightweight JavaScript/HTML5 library
 @copyright 2012 Kevin von Flotow <vonflow@gmail.com>
 @license MIT License <http://opensource.org/licenses/MIT>
 */
(function() {
	function doLog(name,message) {
		console.log("ten."+name+"(): "+message);
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
			console.log(opt);
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
			return ten.isNumeric(size)?size:false;
		},
		extend:function() {
			var first=arguments.length>0?arguments[0]:doLog("extend","no arguments given");
			if (arguments.length>=2) {
				var ret=true;
				arguments=Array.prototype.slice.call(arguments,1);
				ten.each(arguments,function(key,val) {
					ten.each(val,function(target,value) {
						first[target]=value;
					});
				});
			} else {
				doLog("extend","must have at least 2 arguments");
			}
			return ten.isDefined(ret)?first:false;
		},
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
					for (var i=0;i<ten.length(data);i++) {
						var key=Object.keys(data)[i];
						func(key,data[key]);
					}
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

ten.js
======

An open-source and lightweight (1.4kb minified & gzipped) JavaScript/HTML5 library. Work began on December 10th, 2012.

Modular additions will come in the future.

## Performance
The goal of ten.js is to at least match the speeds of other common libraries, while maintaining functionality and minimal filesize. The testing done so far has shown that ten.js is often at least twice as fast as similar libraries (though this is not always the case). Testing has been done against jQuery, jqMobi, and Zepto. 

## Compatibility
ten.js is primarily intended to work with Google Chrome, Mozilla Firefox, Safari, Opera, and mobile devices such as Android and iPhone.

To keep the code as small and simple as possible, compatibility with Internet Explorer has been skipped, although it might work with IE10. If there is demand for compatibility, it may be included in the future.

## Contribute
### CSS selectors
ten.js is in dire need of a CSS selector engine. The ones I have checked out (Sizzle and Zest) are both larger than I would like, and Zest as-is throws warnings in Google Closure Compiler.

So, what we need most is very lightweight, error-free CSS selector functionality. Minified filesize should be at maximum 5kb, with performance on par with Sizzle and other CSS selector engines. It does not need to be as complete as the heavy-weights, but should cover most selectors that are commonly used. If you know of an engine which is fitting, or would like to help build our own, PLEASE get in touch.

### Performance testing
My knowledge and patience with performance testing is limited. If you are at all interested in testing ten.js performance against other libraries (such as jQuery, jqMobi, Zepto, ExtJS, Prototype, etc), your help would be greatly appreciated.

#Documentation

- [Setup](#setup)
- [API](#api)
 - [ten.each()](#teneach)
 - [ten.extend()](#tenextend)
 - [ten.find()](#tenfind)
 - [ten.isArray()](#tenisarray)
 - [ten.isDefined()](#tenisdefined)
 - [ten.isFunction()](#tenisfunction)
 - [ten.isNumeric()](#tenisnumeric)
 - [ten.isObject()](#tenisobject)
 - [ten.isString()](#tenisstring)
 - [ten.length()](#tenlength)
 - [ten.ready()](#tenready)
 - [ten.trim()](#tentrim)
 - [.addClass()](#addclass)
 - [.append()](#append)
 - [.each()](#each)
 - [.hasClass()](#hasclass)
 - [.html()](#html)
 - [.prepend()](#prepend)
 - [.removeClass()](#removeclass)
 - [.text()](#text)
 - [.toggle()](#toggle)
 - [.version](#version)
- [Tips](#tips)

## Setup
Just link the ten.js or ten.min.js file in the head section of your website,
or use a script loader such as [yepnope](http://yepnopejs.com/), [RequireJS](http://requirejs.org/),
[LABjs](http://labjs.com/), etc.
```
<script type="application/javascript" src="ten.min.js"></script>
```

## API

### ten.each()
Parameters

1. `object` OR `array`
2. `function(key,value)`

Iterates over an object or array, executing a function for each entry.
###### Note: the `key` and `value` names can be anything
> ```
> var array=["foo","bar"];
> ten.each(array, function(key,value) {
>   element.append("<div>" + key + ": " + value + "</div>");
> });
> ```
> Will append to the element
> ```
> 0: foo
> 1: bar
> ```

> The same applies to objects
> ```
> var object={
>   one:"foo",
>   two:"bar"
> }
> ten.each(object,function(key,value) {
>   element.append("<div>" + key + ": " + value + "</div>");
> });
> ```
> Will append to the element
> ```
> one: foo
> two: bar
> ```

-----
### ten.extend()
Parameters

1. `object` to extend
2. any additional `object` - comma separated

Extends any additional arguments to the first `object` provided. All arguments must be an `object`.
> 
> ```
> var obj={
>       foo:"bar",
>       some:"more",
>       and:"another"
>     },
>     add1={
>       add1:true
>     },
>     add2={
>       foo:"barred"
>     };
> 
> obj=ten.extend(obj,add1,add2);
> ```
> `obj` becomes
> ```
> {
>   foo:"barred",
>   some:"more",
>   and:"another",
>   add1:true
> }
> ```

-----
### ten.find()
Parameters

1. `string` (selector)

Selects an element or elements based on either class or ID. Advanced CSS selectors are not implemented yet,
but will be eventually.
> ```
> var foo=ten.find(".foo"); // selects all elements with the `foo` class
> 
> var bar=ten.find("#bar"); // selects the element with the ID `bar`
> ```

-----
### ten.isArray()
Parameters

1. `var`

Returns true if the argument is a numeric array.
> ```
> var arr=["foo","bar"];
> if (ten.isArray(arr)) {
>   // it's an array, do something here
> }
> ```

-----
### ten.isDefined()
Parameters

1. `var`

Returns true if the argument is defined.
> ```
> var str="i am defined";
> if (ten.isDefined(str)) {
>   // it's defined, do something here
> }
> ```

-----
### ten.isFunction()
Parameters

1. `var`

Returns true if the argument is a function.
> ```
> var func=someFunction;
> function someFunction() {
>   return "i am the function";
> }
> if (ten.isFunction(func)) {
>   // it's a function, do something here
> }
> ```

-----
### ten.isNumeric()
Parameters

1. `var`

Returns true if the argument is a number.
> ```
> var num=5;
> if (ten.isNumeric(num)) {
>   // it's a number, do something here
> }
> ```

-----
### ten.isObject()
Parameters

1. `var`

Returns true if the argument is an object. Returns false for numeric arrays.
> ```
> var obj={foo:"bar"};
> if (ten.isObject(obj)) {
>   // it's an object, do something here
> }
> ```

-----
### ten.isString()
Parameters

1. `var`

Returns true if the argument is a string.
> ```
> var str="i am the string";
> if (ten.isString(str)) {
>   // it's a string, do something here
> }
> ```

-----
### ten.length()
Parameters

1. `object`

Returns the length of an object, equivalent to `.length` for arrays.
> ```
> var obj={foo:"bar",food:"barred"},
>     objLength=obj.length(); // objLength will be set to 2
> ```

-----
### ten.ready()
Parameters

1. `function`

Executes the provided function when the DOM is fully loaded.
> ```
> ten.ready(function() {
>   console.log("page is loaded");
> });
> ```

-----
### ten.trim()
Parameters

1. `string` OR `array`

Strips all leading & trailing spaces, and converts multiple spaces to a single space.
If an array is given, it will convert all strings within the array.
> ```
> var string="    foo        bar ";
> string=ten.trim(string);
> ```
> `string` becomes  `foo bar`
> ```
> var array=["    foo  ","   foo       bar "];
> array=ten.trim(array);
> ```
> `array` becomes `["foo","foo bar"]`

-----
### .addClass()
Parameters

1. `string` OR `array`

Accepts a string or an array of strings. Adds the specified class(es) to the targeted element. If a string is used, spaces separate the different classes.
> ```
> element.addClass("foo");
> ```
> ```
> element.addClass("foo bar");
> ```
> ```
> element.addClass(["foo", "bar"]);
> ```

-----
### .append()
Parameters

1. `string` OR `array`

Appends the string or strings to the end of the targeted element.
> ```
> var element=ten.find("#foo");
> element.append('<div>some div</div>'); // appends a div to the end of the targeted element
> 
> var element=ten.find("#foo"),
>     arr=['<div>some div</div>','<div>another div</div>'];
> element.append(arr); // appends two divs to the end of the targeted element
> ```

-----
### .each()
Parameters

1. `function(index,element)`

Runs the specified function for each element selected.
###### Note: the `index` and `element` names can be anything
> ```
> var foo=ten.find(".foo");
> foo.each(function(index,element) {
>   console.log(element.text()); // logs the text contents of each element with the class `foo`
> });
> ```

-----
### .hasClass()
Parameters

1. `string`

Checks if the targeted element has the specified class. Returns boolean.
> ```
> if (element.hasClass("foo")) {
>  // it has foo!
> }
> ```

-----
### .html()
Parameters

1. `string` OR `array` (optional)

Erases the current HTML within the element and replaces it with the `string` provided. If no argument is given, it will return the current HTML within the element. If an array is provided, it will merge the contents of the array into a string.
> ```
> var element=ten.find("#foo");
> element.html("<span>bar</span>");
> ```
> Replaces the current HTML within the element with a `span` element
> 
> -----
> ```
> var element=ten.find("#foo");
> element.html(["<span>foo</span>","<span>bar</span>"]);
> ```
> Replaces the current HTML within the element with two `span` elements
> 
> -----
> ```
> <div id="foo">
>   <span>bar</span>
> </div>
> 
> <script>
>   var element=ten.find("#foo");
>   console.log(element.html());
> </script>
> ```
> Logs "<span>bar</span>"

-----
### .prepend()
Parameters

1. `string` OR `array`

Inserts the string or strings at the beginning of the targeted element.
> ```
> var element=ten.find("#foo");
> element.prepend('<div>some div</div>'); // prepends a div at the beginning of the targeted element
> 
> var element=ten.find("#foo"),
>     arr=['<div>some div</div>','<div>another div</div>'];
> element.prepend(arr); // prepends two divs at the beginning of the targeted element
> ```

-----
### .removeClass()
Parameters

1. `string` OR `array`

Accepts a string or an array of strings. Removes the specified class(es) from the targeted element. If a string is used, spaces separate the different classes.
> ```
> element.removeClass("foo");
> ```
> ```
> element.removeClass("foo bar");
> ```
> ```
> element.removeClass(["foo", "bar"]);
> ```

-----
### .text()
No parameters

Returns the text content of an element, stripping any HTML.
> ```
> <div id="foo">
>   <ul>
>     <li>foo</li>
>     <li>bar</li>
>   </ul>
> </div>
> ```
> ```
> ten.find("#foo").text();
> ```
> Will return `foobar`

-----
### .toggle()
Parameters

1. `string` OR `array`

Accepts a string or an array of strings. Will toggle all of the classes provided. If a string is used, spaces separate the different classes.
> ```
> element.toggle("foo");
> ```
> ```
> element.toggle("foo bar");
> ```
> ```
> element.toggle(["foo", "bar"]);
> ```

-----
### .version
Returns the version of ten.js as a `string`.
> ```
> console.log(ten.version); // logs the version. eg. "0.0.3"
> ```

## Tips
By default, ten.js uses an object called `ten`. You can also wrap your code like so, which allows the object to be
called whatever you want.
```
(function($) {
  $.ready(function() {
    var foo=$.find("#foo"),
        fooText=$.trim(foo.text());
    console.log(fooText);
  });
})(ten);
```

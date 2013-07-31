ten.js
======

A lightweight (~2.4kb minified & gzipped) JavaScript library. Work began on December 10th, 2012 as a personal experiment with hopes of becoming more.

The goal is to provide a minimal set of functions that perform well, is easy to use, and fast.

This documentation is out of date and may not be entirely accurate.

## Performance

## Compatibility
ten.js is primarily intended to work with Google Chrome, Mozilla Firefox, Safari, Opera, Internet Explorer 8+, and mobile devices such as Android and iPhone.

#Documentation

- [Setup](#setup)
- [API](#api)
 - [ten()](#ten)
 - [ten.ajax()](#tenajax)
 - [ten.create()](#tencreate)
 - [ten.each()](#teneach)
 - [ten.extend()](#tenextend)
 - [ten.find()](#tenfind)
 - [ten.getCSS()](#tengetcss)
 - [ten.getScript()](#tengetscript)
 - [ten.isArray()](#tenisarray)
 - [ten.isDefined()](#tenisdefined)
 - [ten.isFunction()](#tenisfunction)
 - [ten.isNumeric()](#tenisnumeric)
 - [ten.isObject()](#tenisobject)
 - [ten.isString()](#tenisstring)
 - [ten.isTen()](#tenisten)
 - [ten.length()](#tenlength)
 - [ten.ready()](#tenready)
 - [ten.remove()](#tenremove)
 - [ten.trim()](#tentrim)
 - [.addClass()](#addclass)
 - [.append()](#append)
 - [.closest()](#closest)
 - [.css()](#css)
 - [.each()](#each)
 - [.eq()](#eq)
 - [.find()](#find)
 - [.first()](#first)
 - [.hasClass()](#hasclass)
 - [.hasParent()](#hasparent)
 - [.height()](#height)
 - [.html()](#html)
 - [.is()](#is)
 - [.last()](#last)
 - [.length()](#length)
 - [.load()](#load)
 - [.on()](#on)
 - [.one()](#one)
 - [.off()](#off)
 - [.offset()](#offset)
 - [.parent()](#parent)
 - [.prepend()](#prepend)
 - [.removeClass()](#removeclass)
 - [.text()](#text)
 - [.toggle()](#toggle)
 - [.version](#version)
 - [.width()](#width)
- [Tips](#tips)

## Setup
Just link the ten.js or ten.min.js file in the head section of your website,
or use a script loader such as [yepnope](http://yepnopejs.com/), [RequireJS](http://requirejs.org/),
[LABjs](http://labjs.com/), etc.
```
<script type="application/javascript" src="ten.min.js"></script>
```

## API

### ten()
Parameters

1. `selector` OR `function`

Shortcut for the ten.create(), ten.find(), and ten.ready() methods.

If argument is a function, it will execute once the DOM is fully loaded. Otherwise, it is used as a shortcut for the element selector method ten.find().
> ```
> ten(function() {
>   console.log("loaded"); // executes once the DOM is loaded
> });
> ```
>
> ```
> var foo=ten(".foo"); // selects all elements with the `foo` class
> 
> var bar=ten("#bar"); // selects the element with the ID `bar`
> ```

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

Selects an element or elements based on the selector provided. Supports CSS selectors.
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
### .first()
No parameters (yet)

Returns the first element in an array of elements.
> ```
> <ul>
>   <li>red</li>
>   <li>green</li>
>   <li>blue</li>
>   <li>yellow</li>
> </ul>
>
> <script>
>   var color=$("ul>li").first().text(); // returns "red"
> </script>
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
> Logs `<span>bar</span>`

-----
### .last()
No parameters (yet)

Returns the last element in an array of elements.
> ```
> <ul>
>   <li>red</li>
>   <li>green</li>
>   <li>blue</li>
>   <li>yellow</li>
> </ul>
>
> <script>
>   var color=$("ul>li").last().text(); // returns "yellow"
> </script>
> ```

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
By default, ten.js uses an object called `ten`, but if `$` is available it will use that as well. The following code produces the same results:
> ```
> var element=ten(".foo");
> ten.each(function(index,element) {
>   ten(element).html("bar");
> });
> ```
> ```
> var element=$(".foo");
> $.each(function(index,element) {
>   $(element).html("bar");
> });
> ```

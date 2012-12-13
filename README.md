ten.js
======

A lightweight JavaScript/HTML5 library. Work began on December 10th, 2012.

Modular additions will come in the future.

#Documentation

- [Performance](#performance)
- [Compatibility](#compatibility)
- [Setup](#setup)
- [Methods](#methods)
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

## Performance
I am currently looking for developers who are interested in performance testing. The goal of ten.js is to outperform (or at least match) other JavaScript libraries, while maintaining a high level of functionality.

## Compatibility
ten.js is tested primarily on Google Chrome, but also works with recent versions of Firefox, Opera, Safari, Android, and iPhone. To keep the code as small and simple as possible, compatibility with Internet Explorer has been skipped, although it might work with IE10.

If there is a demand for Internet Explorer compatibility, it may be included in the future.

## Setup
Just link the ten.js or ten.min.js file in the head section of your website,
or use a script loader such as [yepnope](http://yepnopejs.com/), [RequireJS](http://requirejs.org/),
[LABjs](http://labjs.com/), etc.
```
<script type="application/javascript" src="ten.min.js"></script>
```

## Methods

### ten.each()
Parameters

1. `object` OR `array`
2. `function(key,value)`

Iterates over an object or array, executing a function for each entry.
###### Note: the `key` and `value` names can be anything
>
```
var array=["foo","bar"];
ten.each(array, function(key,value) {
  element.append("<div>" + key + ": " + value + "</div>");
});
```
Will append to the element
```
0: foo
1: bar
```
>
The same applies to objects
```
var object={
  one:"foo",
  two:"bar"
}
ten.each(object,function(key,value) {
  element.append("<div>" + key + ": " + value + "</div>");
});
```
Will append to the element
```
one: foo
two: bar
```

-----
### ten.find()
Parameters

1. `string` (selector)

Selects an element or elements based on either class or ID. Advanced CSS selectors are not implemented yet,
but will be eventually.
>
```
var foo=ten.find(".foo");
```
Selects all elements with the `foo` class
```
var bar=ten.find("#bar");
```
Selects the element with the ID `bar`

-----
### ten.trim()
Parameters

1. `string` OR `array`

Strips all leading & trailing spaces, and converts multiple spaces to a single space.
If an array is given, it will convert all strings within the array.
>
```
var string="    foo        bar ";
string=ten.trim(string);
```
`string` becomes  `foo bar`
```
var array=["    foo  ","   foo       bar "];
array=ten.trim(array);
```
`array` becomes `["foo","foo bar"]`

-----
### .addClass()
Parameters

1. `string` OR `array`

Accepts a string or an array of strings. Adds the specified class(es) to the targeted element. If a string is used, spaces separate the different classes.
>
```
element.addClass("foo");
```
```
element.addClass("foo bar");
```
```
element.addClass(["foo", "bar"]);
```

-----
### .each()
Parameters

1. `function(index,element)`

Runs the specified function for each element selected.
###### Note: the `index` and `element` names can be anything
>
```
var foo=ten.find(".foo");
foo.each(function(index,element) {
  console.log(element.text());
});
```
Will log the text contents of each element with the class `foo`

-----
### .hasClass()
Parameters

1. `string`

Checks if the targeted element has the specified class. Returns boolean.
>
```
if (element.hasClass("foo")) {
 // it has foo!
}
```

-----
### .removeClass()
Parameters

1. `string` OR `array`

Accepts a string or an array of strings. Removes the specified class(es) from the targeted element. If a string is used, spaces separate the different classes.
>
```
element.removeClass("foo");
```
```
element.removeClass("foo bar");
```
```
element.removeClass(["foo", "bar"]);
```

-----
### .text()
No parameters

Returns the text content of an element, stripping any HTML.
>
```
<div id="foo">
  <ul>
    <li>foo</li>
    <li>bar</li>
  </ul>
</div>
```
```
ten.find("#foo").text();
```
Will return `foobar`

-----
### .toggle()
Parameters

1. `string` OR `array`

Accepts a string or an array of strings. Will toggle all of the classes provided. If a string is used, spaces separate the different classes.
>
```
element.toggle("foo");
```
```
element.toggle("foo bar");
```
```
element.toggle(["foo", "bar"]);
```

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

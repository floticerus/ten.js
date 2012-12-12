ten.js
======

Lightweight JavaScript/HTML5 library

## methods

### ten.each(object/array, function(key,value))
Iterates over an object or array, executing a function for each entry.
###### Note: the key and values names can be anything
#### Examples
```
var array=["foo","bar"];
ten.each(array, function(key,value) {
  element.append(key + ": " + value + "<br/>");
});
```
Will append to the element
```
0: foo
1: bar
```
-----
### .addClass(class)
Accepts a string or an array of strings. Adds the specified class(es) to the targeted element.
#### Examples
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
### .removeClass(class)
Accepts a string or an array of strings. Removes the specified class(es) to the targeted element.
#### Examples
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
### .hasClass(string)
Checks if the targeted element has the specified class. Returns boolean.
#### Examples
```
if (element.hasClass("foo")) {
 // it has foo!
}
```
-----
### .toggle(class)
Accepts a string or an array of strings. Will toggle all of the classes provided.
#### Examples
```
element.toggle("foo");
```
```
element.toggle("foo bar");
```
```
element.toggle(["foo", "bar"]);
```

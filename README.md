ten.js
======

Lightweight JavaScript/HTML5 library

## methods

### ten.each(object/array, function(key,value))
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
### .addClass(class)
Accepts a string or an array of strings. Adds the specified class(es) to the targeted element.
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
### .removeClass(class)
Accepts a string or an array of strings. Removes the specified class(es) to the targeted element.
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
### .hasClass(string)
Checks if the targeted element has the specified class. Returns boolean.
>
```
if (element.hasClass("foo")) {
 // it has foo!
}
```

-----
### .toggle(class)
Accepts a string or an array of strings. Will toggle all of the classes provided.
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

-----
### .each(function(key,value))
Runs the specified function for each element selected.
###### Note: the `index` and `element` names can be anything
>
```
var foo=ten.find(".foo");
foo.each(function(index,element) {
  element.addClass("bar");
});
```
Will add class `bar` to all elements with the `foo` class

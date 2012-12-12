ten.js
======

Lightweight JavaScript/HTML5 library

## methods

### .addClass(class)
Accepts a string or an array of strings
#### Examples
```
element.addClass("something");
```
```
element.addClass("something another");
```
```
element.addClass(["something", "another"]);
```

### .removeClass(class)
Accepts a string or an array of strings
#### Examples
```
element.removeClass("something");
```
```
element.removeClass("something another");
```
```
element.removeClass(["something", "another"]);
```

### .hasClass(string)
Checks if the targeted element has the specified class. Returns boolean.
#### Examples
```
if (element.hasClass("something")) {
 // it has something!
}
```

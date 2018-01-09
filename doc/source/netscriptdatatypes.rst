Netscript Data Types and Variables
==================================


Data Types
----------
Netscript supports three primitive data types:

**Numbers** - Positive numerics, such as integers and floats. Examples: 6, 0, 10.5

**Strings** - A sequence of characters that represents text. The characters must be encapsulated by single or
double quotes. Example: "This is a string" or equivalently 'This is a string'.
*Strings are fully functional* `Javascript strings <https://www.w3schools.com/jsref/jsref_obj_string.asp>`_,
*which means that all of the member functions of Javascript strings such as toLowerCase() and includes() are also available in Netscript!*

**Boolean** - true or false

**Array** - An array is a special container object that is capable of holding many different values. Arrays are simply Javascript
arrays, and most Javascript array methods can be used in Netscript as well (join(), pop(), splice(), etc.). You can read more about
`Javascript arrays here <https://www.w3schools.com/js/js_arrays.asp>`_

Variables
---------

Variables can be thought of as named containers. Their purpose is to label and store data. The data stored in the
variable can then be accessed and changed by referring to the variable's name. The name of a variable must start with
either a letter or an underscore. The rest of the variable name can contain any alphanumeric (letters and numbers),
as well as hyphens and underscores.

The Netscript language is untyped, meaning that any variable can hold any of the data types above. The value type of a variable
can also change. For example, if a variable initially holds a number, it can later hold a string.

The following shows how you can declare and initialize variables::

    i = 1;
    s = "This is a string";
    b = false;

After declaring a variable, the values in variables can be used simply by referencing the name. For example::

    j = i + 5;
    s2 = s + " Adding more letters onto the string"

The first command above will store the value 6 in the variable j. The second command will store the string "This is a string Adding more letters onto the string" into the variable s2.

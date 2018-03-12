Netscript Miscellaneous
=======================

Netscript Ports
---------------
Netscript ports are endpoints that can be used to communicate between scripts.
A port is implemented as a sort of serialized queue, where you can only write
and read one element at a time from the port. When you read data from a port,
the element that is read is removed from the port.

The :js:func:`read`, :js:func:`write`, :js:func:`clear`, and :js:func:`peek`
Netscript functions can be used to interact with ports.

Right now, there are only 20 ports for Netscript, denoted by the number 1
through 20. When using the functions above, the ports are specified
by passing the number as the first argument.

IMPORTANT: The data inside ports are not saved! This means if you close and
re-open the game, or reload the page then you will lose all of the data in
the ports!

**Example Usage**

Here's a brief example of how ports work. For the sake of simplicity we'll only deal with port 1.

Let's assume Port 1 starts out empty (no data inside). We'll represent the port as such::

    []

Now assume we ran the following simple script::

    for (i = 0; i < 10; ++i) {
        write(1, i); //Writes the value of i to port 1
    }

After this script executes, our script will contain every number from 0 through 9, as so::

    [0, 1, 2, 3, 4, 5, 6, 7 , 8, 9]

Then, assume we run the following script::

    for (i = 0; i < 3; ++i) {
        print(read(1)); //Reads a value from port 1 and then prints it
    }

This script above will read the first three values from port 1 and then print them to the script's log. The log will end up looking like::

    0
    1
    2

And the data in port 1 will look like::

    [3, 4, 5, 6, 7, 8, 9]

**Port Handles**

The :js:func:`getPortHandle` Netscript function can be used to get a handle to a Netscript Port.
This handle allows you to access several new port-related functions and the
port's underlying data structure, which is just a Javascript array. The functions are:

.. js:method:: NetscriptPort.write(data)

    :param data: Data to write to the port
    :returns: If the port is full, the item that is removed from the port is returned.
              Otherwise, null is returned.

    Writes `data` to the port. Works the same as the Netscript function `write`.

.. js:method:: NetscriptPort.tryWrite(data)

    :param data: Data to try to write to the port
    :returns: True if the data is successfully written to the port, and false otherwise.

    Attempts to write `data` to the Netscript port. If the port is full, the data will
    not be written. Otherwise, the data will be written normally.

.. js::method:: NetscriptPort.read()

    :returns: The data read from the port. If the port is empty, "NULL PORT DATA" is returned

    Removes and returns the first element from the port.
    Works the same as the Netscript function `read`

.. js::method:: NetscriptPort.peek()

    :returns: The first element in the port, or "NULL PORT DATA" if the port is empty.

    Returns the first element in the port, but does not remove it.
    Works the same as the Netscript function `peek`

.. js:method:: NetscriptPort.full()

    :returns: True if the Netscript Port is full, and false otherwise

.. js:method:: NetscriptPort.empty()

    :returns: True if the Netscript Port is empty, and false otherwise

.. js:method:: NetscriptPort.clear()

    Clears all data from the port. Works the same as the Netscript function `clear`

.. js:attribute:: NetscriptPort.data

    The Netscript port underlying data structure, which is just a Javascript array. All
    valid Javascript Array methods can be called on this.

Port Handle Example::

    port = getPortHandle(5);
    back = port.data.pop(); //Get and remove last element in port

    //Remove an element from the port
    i = port.data.findIndex("foo");
    if (i != -1) {
        port.data.slice(i, 1);
    }

    //Wait for port data before reading
    while(port.empty()) {
        sleep(10000);
    }
    res = port.read();

    //Wait for there to be room in a port before writing
    while (!port.tryWrite(5)) {
        sleep(5000);
    }

    //Successfully wrote to port!


Comments
--------
Netscript supports comments using the same syntax as `Javascript comments <https://www.w3schools.com/js/js_comments.asp>`_.
Comments are not evaluated as code, and can be used to document and/or explain code::

    //This is a comment and will not get executed even though its in the code
    /* Multi
     * line
     * comment */
    print("This code will actually get executed");

Importing Functions
-------------------

In Netscript you can import functions that are declared in other scripts.
The script will incur the RAM usage of all imported functions.
There are two ways of doing this::

    import * as namespace from "script filename"; //Import all functions from script
    import {fn1, fn2, ...} from "script filename"; //Import specific functions from script

Suppose you have a library script called *testlibrary.script*::

    function foo1(args) {
        //function definition...
    }

    function foo2(args) {
        //function definition...
    }

    function foo3(args) {
        //function definition...
    }

    function foo4(args) {
        //function definition...
    }

Then, if you wanted to use these functions in another script, you can import them like so::

    import * as testlib from "testlibrary.script";

    values = [1,2,3];

    //The imported functions must be specified using the namespace
    someVal1 = testlib.foo3(values);
    someVal2 = testlib.foo1(values);
    if (someVal1 > someVal2) {
        //...
    } else {
        //...
    }

If you only wanted to import certain functions, you can do so without needing
to specify a namespace for the import::

    import {foo1, foo3} from "testlibrary.script"; //Saves RAM since not all functions are imported!

    values = [1,2,3];

    //No namespace needed
    someVal1 = foo3(values);
    someVal2 = foo1(values);
    if (someVal1 > someVal2) {
        //...
    } else {
        //...
    }

Note that exporting functions is not required. 


Javascript Math Module
----------------------

The `Javascript Math Module <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math>`_ is
supported in Netscript and is used in the same way::

    numThreads = Math.floor(getServerRam("foodnstuff")[1] / 3.4);

Javascript Date Module
----------------------

The `Javascript Date Module <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date>`_ is supported in Netscript.
However, since the 'new' operator does not work in Netscript, only the Date module's static functions can be used:

* now()
* UTC()
* Parse()
* Maybe some others I don't know about

Example::

    time = Date.now();

Javascript Number Module
------------------------

The `Javascript Number module <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number>`_ is supported in Netscript.

Example::

    tprint(Number.isInteger(1));        //True
    tprint(Number.isInteger(1.534059)); //False

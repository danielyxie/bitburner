Netscript Miscellaneous
=======================


Comments
--------
Netscript supports comments using the same syntax as `Javascript comments <https://www.w3schools.com/js/js_comments.asp>`_.
Comments are not evaluated as code, and can be used to document and/or explain code::

    //This is a comment and will not get executed even though its in the code
    /* Multi
     * line
     * comment */
    print("This code will actually get executed");

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

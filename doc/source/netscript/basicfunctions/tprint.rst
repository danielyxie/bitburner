tprint() Netscript Function
===========================

.. js:function:: tprint(x...)

    :RAM cost: 0 GB
    :param x: Value to be printed

    Prints any number of values to the Terminal. Objects are converted to json.

    Example:

    .. code-block:: javascript

        tprint("Hello world!"); // Prints "Hello world!" to the terminal.
        tprint({a: 5}); // Prints '{"a":5}' to the terminal.
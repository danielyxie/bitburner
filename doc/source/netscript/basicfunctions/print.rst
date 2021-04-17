print() Netscript Function
===========================

.. js:function:: print(x...)

    :RAM cost: 0 GB
    :param x: Values to be printed.

    Prints any number of values to the script's logs. Objects are converted to json.

    Example:

    .. code-block:: javascript

        print("Hello world!"); // Prints "Hello world!" in the logs.
        print({a: 5}); // Prints '{"a":5}' in the logs.
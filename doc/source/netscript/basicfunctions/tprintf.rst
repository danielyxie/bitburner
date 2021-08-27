tprint() Netscript Function
===========================

.. js:function:: tprintf(format, args...)

    :RAM cost: 0 GB
    :param format: Format of the string to be printed.
    :param args: Values to be formatted

    Prints a raw formatted string to the terminal.

    Example:

    .. code-block:: javascript

        tprintf("Hello world!"); // Prints "Hello world!" to the terminal.
        tprintf("Hello %s", "world!"); // Prints "Hello world!" to the terminal.

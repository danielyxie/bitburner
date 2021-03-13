ls() Netscript Function
=======================

.. js:function:: ls(hostname[, grep])

    :RAM cost: 0.2 GB
    :param string hostname: Hostname of the target server.
    :param string grep: a substring to search for in the filename.
    :returns: String array of all files in alphabetical order.

    Example:

    .. code-block:: javascript

        ls("home"); // returns: ["demo.script", "msg1.txt"]
connect() Netscript Function
============================

.. js:function:: connect(hostname)

    :RAM cost: 2 GB
    :param string hostname: hostname of the server to connect.
    :returns: ``true`` if the connection was a success.

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function.

    This function will connect you to the specified server if it's directly connected to the current server.
    You can also pass in 'home' to return to your home server from anywhere.

    Examples:

    .. code-block:: javascript

        connect("joesguns");
        connect("CSEC");

scan() Netscript Function
=========================

.. js:function:: scan(hostname=current hostname)

    :RAM cost: 0.2 GB
    :param string hostname: Hostname of the server to scan.
    :returns: array of strings of all the host directly connected to the target
        server.

    Example:

    .. code-block:: javascript

        scan("home"); // returns: ["foodnstuff", "sigma-cosmetics", "joesguns", "hong-fang-tea", "harakiri-sushi", "iron-gym"]

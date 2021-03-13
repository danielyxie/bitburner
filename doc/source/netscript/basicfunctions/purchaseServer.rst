purchaseServer() Netscript Function
===================================

.. js:function:: purchaseServer(hostname, ram)

    :RAM cost: 2.25 GB
    :param string hostname: Hostname of the purchased server.
    :param number ram: Amount of RAM of the purchased server. Must be a power of
        2. Maximum value of :doc:`getPurchasedServerMaxRam<getPurchasedServerMaxRam>`
    :returns: The hostname of the newly purchased server.

    Purchased a server with the specified hostname and amount of RAM.

    The ``hostname`` argument can be any data type, but it will be converted to
    a string and have whitespace removed. Anything that resolves to an empty
    string will cause the function to fail. If there is already a server with
    the specified hostname, then the function will automatically append a number
    at the end of the ``hostname`` argument value until it finds a unique
    hostname. For example, if the script calls ``purchaseServer("foo", 4)`` but
    a server named "foo" already exists, the it will automatically change the
    hostname to "foo-0". If there is already a server with the hostname "foo-0",
    then it will change the hostname to "foo-1", and so on.

    Note that there is a maximum limit to the amount of servers you can purchase.

    Example:

    .. code-block:: javascript

        ram = 64;
        hn = "pserv-";
        for (i = 0; i < 5; ++i) {
            purchaseServer(hn + i, ram);
        }

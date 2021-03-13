getServerNumPortsRequired() Netscript Function
==============================================

.. js:function:: getServerNumPortsRequired(hostname)

    :RAM cost: 0.1 GB
    :param string hostname: Hostname of target server.
    :returns: The number of open ports required to successfully run NUKE.exe on
        the specified server.

    Example:

    .. code-block:: javascript

        getServerNumPortsRequired("unitalife"); // returns: 4

hasRootAccess() Netscript Function
==================================

.. js:function:: hasRootAccess(hostname/ip)

    :param string hostname/ip: Hostname or IP of the target server
    :RAM cost: 0.05 GB

    Returns a boolean indicating whether or not the player has root access to the specified target server.

    Example::

        if (hasRootAccess("foodnstuff") == false) {
            nuke("foodnstuff");
        }

hasRootAccess() Netscript Function
==================================

.. js:function:: hasRootAccess(hostname)

    :RAM cost: 0.05 GB
    :param string hostname: Hostname of the target server.
    :returns: ``true`` if you have root access on the target server.

    Example:

    .. code-block:: javascript

        if (hasRootAccess("foodnstuff") == false) {
            nuke("foodnstuff");
        }

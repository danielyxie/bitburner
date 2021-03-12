getServerBaseSecurityLevel() Netscript Function
===============================================

.. js:function:: getServerBaseSecurityLevel(hostname)

    :RAM cost: 0.1 GB
    :param string hostname: Hostname of target server.
    :returns: Base security level of target server.

    The base security level is the security level that the server starts out with.
    
    This function isn't particularly useful.
    :doc:`getServerSecurityLevel<getServerSecurityLevel>` and
    :doc:`getServerMinSecurityLevel<getServerMinSecurityLevel>` are more often
    used.

    Example:

    .. code-block:: javascript

        getServerBaseSecurityLevel('foodnstuff'); // returns: 9

.. note:: This is different than :doc:`getServerSecurityLevel<getServerSecurityLevel>`
        because :doc:`getServerSecurityLevel<getServerSecurityLevel>` returns the current
        security level of a server, which can constantly change due to
        :doc:`hack<hack>`, :doc:`grow<grow>`, and :doc:`weaken<weaken>` calls on
        that server. The base security level will stay the same until you reset
        by installing augmentation(s).

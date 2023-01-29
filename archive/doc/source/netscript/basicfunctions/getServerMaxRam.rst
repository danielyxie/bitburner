getServerMaxRam() Netscript Function
====================================

.. js:function:: getServerMaxRam(hostname)

    :RAM cost: 0.05 GB
    :param string hostname: Hostname of target server.
    :returns: Total ram available on that server. In GB.

    Example:

    .. code-block:: javascript

        maxRam = getServerMaxRam("helios"); // returns: 16
        print("helios has "+maxRam + "GB");

getServerUsedRam() Netscript Function
=====================================

.. js:function:: getServerUsedRam(hostname)

    :RAM cost: 0.05 GB
    :param string hostname: Hostname of target server.
    :returns: Used ram on that server. In GB.

    Example:

    .. code-block:: javascript

        usedRam = getServerUsedRam("harakiri-sushi"); // returns: 5.6
        print("harakiri-sushi uses "+usedRam + "GB");

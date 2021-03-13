getServerMoneyAvailable() Netscript Function
============================================

.. js:function:: getServerMoneyAvailable(hostname)

    :RAM cost: 0.1 GB
    :param string hostname: Hostname of target server.
    :returns: Money available on that server.

    .. note::

        Running this function on the home computer will return the player's money.

    Example:

    .. code-block:: javascript

        getServerMoneyAvailable("foodnstuff"); // returns: 120000
        getServerMoneyAvailable("home"); // returns: 1000
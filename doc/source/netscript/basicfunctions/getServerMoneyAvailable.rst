getServerMoneyAvailable() Netscript Function
============================================

.. js:function:: getServerMoneyAvailable(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server
    :RAM cost: 0.1 GB

    Returns the amount of money available on a server. **Running this function on the home computer will return
    the player's money.**

    Example::

        getServerMoneyAvailable("foodnstuff");
        getServerMoneyAvailable("home"); //Returns player's money

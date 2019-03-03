hack() Netscript Function
=========================

.. js:function:: hack(hostname/ip)

    :param string hostname/ip: IP or hostname of the target server to hack
    :returns: The amount of money stolen if the hack is successful, and zero otherwise
    :RAM cost: 0.1 GB

    Function that is used to try and hack servers to steal money and gain hacking experience. The runtime for this command depends
    on your hacking level and the target server's security level. In order to hack a server you must first gain root access
    to that server and also have the required hacking level.

    A script can hack a server from anywhere. It does not need to be running on the same server to hack that server. For example,
    you can create a script that hacks the 'foodnstuff' server and run that script on any server in the game.

    A successful hack() on a server will raise that server's security level by 0.002.

    Example::

        hack("foodnstuff");
        hack("10.1.2.3");

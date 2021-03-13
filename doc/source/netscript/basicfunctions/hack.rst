hack() Netscript Function
=========================

.. js:function:: hack(hostname[, opts={}])

    :RAM cost: 0.1 GB
    :param string hostname: Hostname of the target server.
    :param object opts: Optional parameters for configuring function behavior. Properties:

        * threads (*number*) - Number of threads to use for this function.
          Must be less than or equal to the number of threads the script is running with.
        * stock (*boolean*) - If true, the function can affect the stock market. See
          :ref:`gameplay_stock_market_player_actions_influencing_stock`
    :returns: The amount of money stolen if the hack is successful, and zero otherwise

    Function that is used to try and hack servers to steal money and gain
    hacking experience. The runtime for this command depends on your hacking
    level and the target server's security level. In order to hack a server you
    must first gain root access to that server and also have the required
    hacking level.

    A script can hack a server from anywhere. It does not need to be running on
    the same server to hack that server. For example, you can create a script
    that hacks the 'foodnstuff' server and run that script on any server in the
    game.

    A successful :doc:`hack<hack>` on a server will raise that server's security
    level by 0.002.

    Example:

    .. code-block:: javascript

        hack("foodnstuff");
        hack("10.1.2.3");
        hack("foodnstuff", { threads: 5 }); // Only use 5 threads to hack

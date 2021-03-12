grow() Netscript Function
=========================

.. js:function:: grow(hostname[, opts={}])

    :RAM cost: 0.15 GB
    :param string hostname: Hostname of the target server.
    :param object opts: Optional parameters for configuring function behavior. Properties:

        * threads (*number*) - Number of threads to use for this function.
          Must be less than or equal to the number of threads the script is running with.
        * stock (*boolean*) - If true, the function can affect the stock market. See
          :ref:`gameplay_stock_market_player_actions_influencing_stock`

    :returns: The number by which the money on the server was multiplied for the growth

    Increase the amount of money available on a server. The time it takes to
    execute depends on your hacking level and the target server's security
    level. When :doc:`grow<grow>` completes, the money available on a target
    server will be increased by a certain, fixed percentage. This percentage is
    determined by the target server's growth rate (which varies between servers)
    and security level. Generally, higher-level servers have higher growth
    rates. The :doc:`getServerGrowth<getServerGrowth>` function can be used to
    obtain a server's growth rate.

    Like :doc:`hack<hack>`, :doc:`grow<grow>` can be called on any server, from
    any server. The :doc:`grow<grow>` command requires root access to the target
    server, but there is no required hacking level to run the command. It also
    raises the security level of the target server by 0.004 per thread.

    Example:

    .. code-block:: javascript

        while(true) {
            grow("foodnstuff");
        }

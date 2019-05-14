grow() Netscript Function
=========================

.. js:function:: grow(hostname/ip[, opts={}])

    :param string hostname/ip: IP or hostname of the target server to grow
    :param object opts: Optional parameters for configuring function behavior. Properties:

        * threads (*number*) - Number of threads to use for this function.
          Must be less than or equal to the number of threads the script is running with.

    :returns: The number by which the money on the server was multiplied for the growth
    :RAM cost: 0.15 GB

    Use your hacking skills to increase the amount of money available on a server. The runtime for this command depends on your hacking
    level and the target server's security level. When grow() completes, the money available on a target server will be increased by a
    certain, fixed percentage. This percentage is determined by the target server's growth rate (which varies between servers) and security level.
    Generally, higher-level servers have higher growth rates. The getServerGrowth() function can be used to obtain a server's growth rate.

    Like hack(), grow() can be called on any server, regardless of where the script is running. The grow() command requires
    root access to the target server, but there is no required hacking level to run the command. It also raises the security level
    of the target server by 0.004.

    Example::

        grow("foodnstuff");
        grow("foodnstuff", { threads: 5 }); // Only use 5 threads to grow

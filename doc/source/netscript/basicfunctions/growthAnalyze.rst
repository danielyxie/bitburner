growthAnalyze() Netscript Function
==================================

.. js:function:: growthAnalyze(hostname, growthAmount[, cores])

    :RAM cost: 1 GB
    :param string hostname: Hostname of server to analyze.
    :param number growthAmount: Multiplicative factor by which the server is
        grown. Decimal form. Must be >= 1.
    :param number cores: Amount of cores on the server that would run the growth, defaults to 1
    :returns: The amount of :doc:`grow<grow>` threads needed to grow the specified
        server by the specified amount.

    Example:

    .. code-block:: javascript

        // How many grow threads are needed to double the current money on 'foodnstuff'
        growthAnalyze("foodnstuff", 2); // returns: 5124

    If this returns 5124, then this means you need to call :doc:`grow<grow>`
    5124 times in order to double the money (or once with 5124 threads).

    **Warning**: The value returned by this function isn't necessarily a whole number.

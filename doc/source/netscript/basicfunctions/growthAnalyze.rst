growthAnalyze() Netscript Function
==================================

.. js:function:: growthAnalyze(hostname/ip, growthAmount)

    :param string hostname/ip: IP or hostname of server to analyze
    :param number growthAmount: Multiplicative factor by which the server is grown. Decimal form. Must be >= 1.
    :returns: The amount of grow() calls needed to grow the specified server by the specified amount
    :RAM cost: 1 GB

    This function returns the number of "growths" needed in order to increase the amount
    of money available on the specified server by the specified amount.

    The specified amount is multiplicative and is in decimal form, not percentage.

    For example, if you want to determine how many `grow()` calls you need
    to double the amount of money on `foodnstuff`, you would use::

        growthAnalyze("foodnstuff", 2);

    If this returns 100, then this means you need to call `grow()` 100 times
    in order to double the money (or once with 100 threads).

    **Warning**: The value returned by this function isn't necessarily a whole number.

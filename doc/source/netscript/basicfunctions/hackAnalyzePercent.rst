hackAnalyzePercent() Netscript Function
=======================================

.. js:function:: hackAnalyzePercent(hostname/ip)

    :param string hostname/ip: IP or hostname of target server
    :returns: The percentage of money you will steal from the target server with a single hack
    :RAM cost: 1 GB

    Returns the percentage of the specified server's money you will steal with a
    single hack. This value is returned in **percentage form, not decimal (Netscript
    functions typically return in decimal form, but not this one).**

    For example, assume the following returns 1::

        hackAnalyzePercent("foodnstuff");

    This means that if hack the `foodnstuff` server, then you will steal 1% of its
    total money. If you `hack()` using N threads, then you will steal N% of its total
    money.

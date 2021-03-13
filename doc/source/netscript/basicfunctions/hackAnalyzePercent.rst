hackAnalyzePercent() Netscript Function
=======================================

.. js:function:: hackAnalyzePercent(hostname)

    :RAM cost: 1 GB
    :param string hostname: Hostname of target server.
    :returns: The percentage of money you will steal from the target server with
        a single hack.

    Returns the percentage of the specified server's money you will steal with a
    single hack. This value is returned in percentage form, not decimal.

    For example, assume the following returns 1:

    .. code-block:: javascript

        hackAnalyzePercent("foodnstuff"); // returns: 1

    This means that if hack the 'foodnstuff' server, then you will steal 1% of its
    total money. If you :doc:`hack<hack>` using N threads, then you will steal N% of its total
    money.

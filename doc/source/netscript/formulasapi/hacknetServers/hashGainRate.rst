hashGainRate() Netscript Function
==========================================

.. js:function:: hashGainRate(level, ramUsed, maxRam, core[, mult])

    :RAM cost: 0 GB
    :param number level: level of the server.
    :param number ramUsed: ram used on the server.
    :param number maxRam: max ram of the server.
    :param number core: cores of the server.
    :returns: Money per second that a server with those stats would gain per second.

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to
    use this function. In addition, if you are not in BitNode-9, then you must
    have Source-File 9-1 in order to use this function.

    This function calculates the hash rate of a server with the given stats.

    Examples:

    .. code-block:: javascript

        server = hacknet.getNodeStats(1);
        currentRate = formulas.hacknetServers.hashGainRate(server.level, 0, server.ram, server.cores);
        levelRate = formulas.hacknetServers.hashGainRate(server.level+1, 0, server.ram, server.cores);
        ramRate = formulas.hacknetServers.hashGainRate(server.level, 0, server.ram*2, server.cores);
        coresRate = formulas.hacknetServers.hashGainRate(server.level, 0, server.ram, server.cores+1);

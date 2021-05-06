hashGainRate() Netscript Function
==========================================

.. js:function:: hashGainRate(level, ramUsed, maxRam, core[, mult])

    :RAM cost: 0 GB
    :param number level: level of the server.
    :param number ramUsed: ram used on the server.
    :param number maxRam: max ram of the server.
    :param number core: cores of the server.
    :returns: Money per second that a server with those stats would gain per second.

    You must have Source-File 5-1 and Source-File 9-1 in order to use this function.

    This function calculates the hash rate of a server with the given stats.

    Examples:

    .. code-block:: javascript

        server = hacknet.getNodeStats(1);
        currentRate = formulas.hacknetNodes.hashGainRate(server.level, 0, server.ram, server.cores);
        levelRate = formulas.hacknetNodes.hashGainRate(server.level+1, 0, server.ram, server.cores);
        ramRate = formulas.hacknetNodes.hashGainRate(server.level, 0, server.ram*2, server.cores);
        coresRate = formulas.hacknetNodes.hashGainRate(server.level, 0, server.ram, server.cores+1);
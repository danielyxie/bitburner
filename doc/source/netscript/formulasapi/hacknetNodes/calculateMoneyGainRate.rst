calculateMoneyGainRate() Netscript Function
===========================================

.. js:function:: calculateMoneyGainRate(level, ram, core[, mult])

    :RAM cost: 0 GB
    :param number level: level of the node.
    :param number ram: ram of the node.
    :param number core: cores of the node.
    :returns: Money per second that a node with those stats would gain per second.

    You must have Source-File 5-1 in order to use this function.

    This function calculates the money rate of a node with the given stats.

    Examples:

    .. code-block:: javascript

        node = hacknet.getNodeStats(1);
        currentRate = formulas.hacknetNodes.calculateMoneyGainRate(node.level, node.ram, node.cores);
        levelRate = formulas.hacknetNodes.calculateMoneyGainRate(node.level+1, node.ram, node.cores);
        ramRate = formulas.hacknetNodes.calculateMoneyGainRate(node.level, node.ram*2, node.cores);
        coresRate = formulas.hacknetNodes.calculateMoneyGainRate(node.level, node.ram, node.cores+1);
ramUpgradeCost() Netscript Function
============================================

.. js:function:: ramUpgradeCost(startingRam[, extraRamLevels[, costMult]])

    :RAM cost: 0 GB
    :param number startingRam: Amount of RAM at the start the calculation.
    :param number extraRamLevels: Extra number of levels you want to buy. Default to ``1``.
    :param number costMult: Aug multiplier that reduces cost. Defaults to ``1``.
    :returns: Money required to go from ``startingRam`` to ``startingRam+extraRamLevels``.

    ..note:: ``startingRam`` is the actual amount of ram, not the amount of levels of ram.

    You must have Source-File 5-1 in order to use this function.

    This function calculates the cost of upgrading levels from any level to any level.

    Examples:

    .. code-block:: javascript

        formulas.hacknetNodes.ramUpgradeCost(1, 5); // returns: 2095000
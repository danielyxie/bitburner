calculateLevelUpgradeCost() Netscript Function
=============================================

.. js:function:: calculateLevelUpgradeCost(startingLevel[, extraLevels[, costMult]])

    :RAM cost: 0 GB
    :param number startingLevel: Number of level at the start the calculation.
    :param number extraLevels: Extra number of levels you want to buy. Default to ``1``.
    :param number costMult: Aug multiplier that reduces cost. Defaults to ``1``.
    :returns: Money required to go from ``startingLevel`` to ``startingLevel+extraLevels``.

    You must have Source-File 5-1 and Source-File 9-1 in order to use this function.

    This function calculates the cost of upgrading levels from any level to any level.

    Examples:

    .. code-block:: javascript

        formulas.hacknetServers.calculateLevelUpgradeCost(1, 5); // returns: 2792000
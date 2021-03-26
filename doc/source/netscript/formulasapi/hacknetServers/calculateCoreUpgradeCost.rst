calculateCoreUpgradeCost() Netscript Function
=============================================

.. js:function:: calculateCoreUpgradeCost(startingCores[, extraCores[, costMult]])

    :RAM cost: 0 GB
    :param number startingCores: Number of core at the start the calculation.
    :param number extraCores: Extra number of cores you want to buy. Default to ``1``.
    :param number costMult: Aug multiplier that reduces cost. Defaults to ``1``.
    :returns: Money required to go from ``startingCores`` to ``startingCores+extraCores``.

    You must have Source-File 5-1 and Source-File 9-1 in order to use this function.

    This function calculates the cost of upgrading cores from any level to any level.

    Examples:

    .. code-block:: javascript

        formulas.hacknetServers.calculateCoreUpgradeCost(1, 5); // returns: 12015000

coreUpgradeCost() Netscript Function
=============================================

.. js:function:: coreUpgradeCost(startingCores[, extraCores[, costMult]])

    :RAM cost: 0 GB
    :param number startingCores: Number of core at the start the calculation.
    :param number extraCores: Extra number of cores you want to buy. Default to ``1``.
    :param number costMult: Aug multiplier that reduces cost. Defaults to ``1``.
    :returns: Money required to go from ``startingCores`` to ``startingCores+extraCores``.

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to
    use this function.

    This function calculates the cost of upgrading cores from any level to any level.

    Examples:

    .. code-block:: javascript

        formulas.hacknetNodes.coreUpgradeCost(1, 5); // returns: 6355000

hashUpgradeCost() Netscript Function
=============================================

.. js:function:: hashUpgradeCost(upgName, level)

    :RAM cost: 0 GB
    :param string upgName: Name of the Hash upgrade.
    :param number level: Level of the upgrade.
    :returns: Amount of Hash.

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to
    use this function. In addition, if you are not in BitNode-9, then you must
    have Source-File 9-1 in order to use this function.

    This function calculates amount of Hash require to buy level ``level`` of upgrade ``upgName``.

    Examples:

    .. code-block:: javascript

        formulas.hacknetServers.hashUpgradeCost("Increase Maximum Money", 5); // returns: 250

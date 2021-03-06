hacknetServerCost() Netscript Function
===============================================

.. js:function:: hacknetServerCost(serverN[, costMult]])

    :RAM cost: 0 GB
    :param number serverN: Number of the new node.
    :param number costMult: Aug multiplier that reduces cost. Defaults to ``1``.
    :returns: Money required to buy your ``serverN`` th node.

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to
    use this function. In addition, if you are not in BitNode-9, then you must
    have Source-File 9-1 in order to use this function.

    This function calculates the cost purchasing a hacknet node.

    Examples:

    .. code-block:: javascript

        formulas.hacknetNodes.hacknetServerCost(2); // returns: 1800000

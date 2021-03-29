hacknetNodeCost() Netscript Function
=============================================

.. js:function:: hacknetNodeCost(nodeN[, costMult]])

    :RAM cost: 0 GB
    :param number nodeN: Number of the new node.
    :param number costMult: Aug multiplier that reduces cost. Defaults to ``1``.
    :returns: Money required to buy your ``nodeN`` th node.

    You must have Source-File 5-1 in order to use this function.

    This function calculates the cost purchasing a hacknet node.

    Examples:

    .. code-block:: javascript

        formulas.hacknetNodes.hacknetNodeCost(2); // returns: 1800

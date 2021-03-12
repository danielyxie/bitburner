getBlackOpRank() Netscript Function
====================================

.. js:function:: getBlackOpRank(name)

    :RAM cost: 2 GB
    :param string name: name of the BlackOp. Must be an exact match.
    :returns: Rank required to complete this BlackOp. -1 for invalid BlackOp.

    Example:

    .. code-block:: javascript

        bladeburner.getBlackOpRank("Operation Typhoon"); // returns: 2500
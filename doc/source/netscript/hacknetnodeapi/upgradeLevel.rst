upgradeLevel() Netscript Function
=================================

.. js:function:: upgradeLevel(i, n)

    :RAM cost: 0 GB

    :param number i: Index/Identifier of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`
    :param number n: Number of levels to purchase. Must be positive. Rounded to nearest integer

    Tries to upgrade the level of the specified Hacknet Node by *n*.

    Returns true if the Hacknet Node's level is successfully upgraded by *n* or
    if it is upgraded by some positive amount and the Node reaches its max level.

    Returns false otherwise.

getLevelUpgradeCost() Netscript Function
========================================

.. js:function:: getLevelUpgradeCost(i, n)

    :RAM cost: 0 GB
    :param number i: Index of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`
    :param number n: Number of levels to upgrade. Must be positive. Rounded to nearest integer
    :returns: Cost of upgrading the specified Hacknet Node by ``n`` levels.

    If an invalid value for ``n`` is provided, then this function returns ``0``. If the
    specified Hacknet Node is already at max level, then ``Infinity`` is returned.

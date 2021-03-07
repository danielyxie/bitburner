getRamUpgradeCost() Netscript Function
======================================

.. js:function:: getRamUpgradeCost(i, n)

    :param number i: Index/Identifier of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`
    :param number n: Number of times to upgrade RAM. Must be positive. Rounded to nearest integer

    Returns the cost of upgrading the RAM of the specified Hacknet Node *n* times.

    If an invalid value for *n* is provided, then this function returns 0. If the
    specified Hacknet Node is already at max RAM, then Infinity is returned.

    :RAM cost: 0 GB

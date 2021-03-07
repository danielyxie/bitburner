getCoreUpgradeCost() Netscript Function
=======================================

.. js:function:: getCoreUpgradeCost(i, n)

    :param number i: Index/Identifier of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`
    :param number n: Number of times to upgrade cores. Must be positive. Rounded to nearest integer

    Returns the cost of upgrading the number of cores of the specified Hacknet Node by *n*.

    If an invalid value for *n* is provided, then this function returns 0. If the
    specified Hacknet Node is already at the max number of cores, then Infinity is returned.

    :RAM cost: 0 GB

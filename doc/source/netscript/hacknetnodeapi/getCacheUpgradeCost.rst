getCacheUpgradeCost() Netscript Function
========================================

.. warning:: This page contains spoilers for the game

.. js:function:: getCacheUpgradeCost(i, n)

    :param number i: Index/Identifier of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`
    :param number n: Number of times to upgrade cache. Must be positive. Rounded to nearest integer

    .. note:: This function is only applicable for Hacknet Servers (the upgraded version of
              a Hacknet Node).

    Returns the cost of upgrading the cache level of the specified Hacknet Server by *n*.

    If an invalid value for *n* is provided, then this function returns 0. If the
    specified Hacknet Server is already at the max cache level, then Infinity is returned.

    :RAM cost: 0 GB

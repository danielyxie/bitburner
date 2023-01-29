upgradeCore() Netscript Function
================================

.. js:function:: upgradeCore(i, n)

    :RAM cost: 0 GB
    :param number i: Index of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`
    :param number n: Number of cores to purchase. Must be positive. Rounded to nearest integer
    :returns: ``true`` if the upgrade was successful.

    Tries to purchase ``n`` cores for the specified Hacknet Node.

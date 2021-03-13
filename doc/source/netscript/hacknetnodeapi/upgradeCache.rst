upgradeCache() Netscript Function
=================================

.. warning:: This page contains spoilers for the game

.. js:function:: upgradeCache(i, n)

    :RAM cost: 0 GB
    :param number i: Index of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`
    :param number n: Number of cache levels to purchase. Must be positive. Rounded to nearest integer
    :returns: ``true`` if the upgrade was successful.

    .. note:: This function is only applicable for Hacknet Servers (the upgraded version of
              a Hacknet Node).

    Tries to upgrade the specified Hacknet Server's cache ``n`` times.

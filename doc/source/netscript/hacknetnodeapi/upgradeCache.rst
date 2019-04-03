upgradeCache() Netscript Function
=================================

.. warning:: This page contains spoilers for the game

.. js:function:: upgradeCache(i, n)

    :param number i: Index/Identifier of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`
    :param number n: Number of cache levels to purchase. Must be positive. Rounded to nearest integer

    .. note:: This function is only applicable for Hacknet Servers (the upgraded version of
              a Hacknet Node).

    Tries to upgrade the specified Hacknet Server's cache *n* times.

    Returns true if it successfully upgrades the Server's cache *n* times, or if
    it purchases some positive amount and the Server reaches its max cache level.

    Returns false otherwise.

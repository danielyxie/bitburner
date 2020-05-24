hashCost() Netscript Function
=============================

.. warning:: This page contains spoilers for the game

.. js:function:: hashCost(upgName)

    :param string upgName: Name of upgrade to get the cost of. Must be an exact match

    .. note:: This function is only applicable for Hacknet Servers (the upgraded version
              of a Hacknet Node).

    Returns the number of hashes required for the specified upgrade.  The name of the
    upgrade must be an exact match.
    
    :RAM cost: 0 GB

    Example:

    .. code:: javascript

        var upgradeName = "Sell for Corporation Funds";
        if (hacknet.numHashes() > hacknet.hashCost(upgradeName)) {
            hacknet.spendHashes(upgName);
        }

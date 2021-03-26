getHashUpgradeLevel() Netscript Function
========================================

.. js:function:: getHashUpgradeLevel(upgName)

    :RAM cost: 0 GB
    :param string upgName: Name of upgrade to spend hashes on. Must be an exact match.
    :returns: level of the upgrade.

    .. note:: This function is only applicable for Hacknet Servers (the upgraded version
              of a Hacknet Node).

    Example:

    .. code:: javascript

        hacknet.getHashUpgradeLevel("Sell for Money"); // returns: 5
        // "Sell for Money" was bought 5 times.

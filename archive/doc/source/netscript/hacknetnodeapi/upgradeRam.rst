upgradeRam() Netscript Function
===============================

.. js:function:: upgradeRam(i, n)

    :RAM cost: 0 GB
    :param number i: Index of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`
    :param number n: Number of times to upgrade RAM. Must be positive. Rounded to nearest integer.
    :returns: ``true`` if the upgrade was successful.

    Tries to upgrade the specified Hacknet Node's RAM ``n`` times. Note that
    each upgrade doubles the Node's RAM. So this is equivalent to multiplying
    the Node's RAM by 2 :sup:`n`.

upgradeCore() Netscript Function
================================

.. js:function:: upgradeCore(i, n)

    :RAM cost: 0 GB

    :param number i: Index/Identifier of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`
    :param number n: Number of cores to purchase. Must be positive. Rounded to nearest integer

    Tries to purchase *n* cores for the specified Hacknet Node.

    Returns true if it successfully purchases *n* cores for the Hacknet Node or if
    it purchases some positive amount and the Node reaches its max number of cores.

    Returns false otherwise.

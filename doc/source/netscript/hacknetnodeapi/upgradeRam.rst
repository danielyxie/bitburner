upgradeRam() Netscript Function
===============================

.. js:function:: upgradeRam(i, n)

    :param number i: Index/Identifier of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`
    :param number n: Number of times to upgrade RAM. Must be positive. Rounded to nearest integer

    Tries to upgrade the specified Hacknet Node's RAM *n* times. Note that each upgrade
    doubles the Node's RAM. So this is equivalent to multiplying the Node's RAM by
    2 :sup:`n`.

    Returns true if the Hacknet Node's RAM is successfully upgraded *n* times or if
    it is upgraded some positive number of times and the Node reaches it max RAM.

    Returns false otherwise.

    :RAM cost: 0 GB

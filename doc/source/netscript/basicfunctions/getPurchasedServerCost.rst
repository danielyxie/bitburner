getPurchasedServerCost() Netscript Function
===========================================

.. js:function:: getPurchasedServerCost(ram)

    :RAM cost: 0.25 GB

    :param number ram: Amount of RAM of a potential purchased server. Must be a power of 2 (2, 4, 8, 16, etc.). Maximum value of 1048576 (2^20)

    Returns the cost to purchase a server with the specified amount of *ram*.

    Examples::

        for (i = 1; i <= 20; i++) {
            tprint(i + " -- " + getPurchasedServerCost(Math.pow(2, i)));
        }

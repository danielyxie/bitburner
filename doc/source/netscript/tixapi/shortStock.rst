shortStock() Netscript Function
===============================

.. js:function:: shortStock(sym, shares)

    :param string sym: Symbol of stock to short
    :param number shares: Number of shares to short. Must be positive. Will be rounded to nearest integer
    :RAM cost: 2.5 GB

    Attempts to purchase a `short <http://bitburner.wikia.com/wiki/Stock_Market#Positions:_Long_vs_Short>`_ position of a stock
    using a `Market Order <http://bitburner.wikia.com/wiki/Stock_Market#Order_Types>`_.

    The ability to short a stock is **not** immediately available to the player and must be unlocked later on in the game.

    If the player does not have enough money to purchase the specified number of shares, then no shares will be purchased.
    Remember that every transaction on the stock exchange costs a certain commission fee.

    If the purchase is successful, this function will return the stock price at which each share was purchased. Otherwise, it will return 0.

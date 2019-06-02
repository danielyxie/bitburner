sellShort() Netscript Function
==============================

.. js:function:: sellShort(sym, shares)

    :param string sym: Symbol of stock to sell
    :param number shares: Number of shares to sell. Must be positive. Will be rounded to nearest integer
    :RAM cost: 2.5 GB

    Attempts to sell a `short <http://bitburner.wikia.com/wiki/Stock_Market#Positions:_Long_vs_Short>`_ position of a stock
    using a `Market Order <http://bitburner.wikia.com/wiki/Stock_Market#Order_Types>`_.

    The ability to short a stock is **not** immediately available to the player and must be unlocked later on in the game.

    If the specified number of shares exceeds the amount that the player actually owns, then this function will sell all owned
    shares. Remember that every transaction on the stock exchange costs a certain commission fee.

    If the sale is successful, this function will return the stock price at which each share was sold. Otherwise it will return 0.

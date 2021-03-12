buyStock() Netscript Function
=============================

.. js:function:: buyStock(sym, shares)

    :RAM cost: 2.5 GB
    :param string sym: Symbol of stock to purchase
    :param number shares: Number of shares to purchased. Must be positive. Will be rounded to nearest integer


    Attempts to purchase shares of a stock using a `Market Order <http://bitburner.wikia.com/wiki/Stock_Market#Order_Types>`_.

    If the player does not have enough money to purchase the specified number of shares, then no shares will be purchased. Remember
    that every transaction on the stock exchange costs a certain commission fee.

    If this function successfully purchases the shares, it will return the stock price at which each share was purchased. Otherwise,
    it will return 0.

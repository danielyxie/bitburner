sellStock() Netscript Function
==============================

.. js:function:: sellStock(sym, shares)

    :param string sym: Symbol of stock to sell
    :param number shares: Number of shares to sell. Must be positive. Will be rounded to nearest integer
    :RAM cost: 2.5 GB

    Attempts to sell shares of a stock using a `Market Order <http://bitburner.wikia.com/wiki/Stock_Market#Order_Types>`_.

    If the specified number of shares in the function exceeds the amount that the player actually owns, then this function will
    sell all owned shares. Remember that every transaction on the stock exchange costs a certain commission fee.

    The net profit made from selling stocks with this function is reflected in the script's statistics.
    This net profit is calculated as::

        shares * (sell price - average price of purchased shares)

    If the sale is successful, this function will return the stock price at which each share was sold. Otherwise, it will return 0.

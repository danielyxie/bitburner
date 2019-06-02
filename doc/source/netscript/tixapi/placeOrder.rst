placeOrder() Netscript Function
===============================

.. js:function:: placeOrder(sym, shares, price, type, pos)

    :param string sym: Symbol of stock to player order for
    :param number shares: Number of shares for order. Must be positive. Will be rounded to nearest integer
    :param number price: Execution price for the order
    :param string type: Type of order. It must specify "limit" or "stop", and must also specify "buy" or "sell". This is NOT
        case-sensitive. Here are four examples that will work:

        * limitbuy
        * limitsell
        * stopbuy
        * stopsell

    :param string pos:
        Specifies whether the order is a "Long" or "Short" position. The Values "L" or "S" can also be used. This is
        NOT case-sensitive.
    :RAM cost: 2.5 GB

    Places an order on the stock market. This function only works
    for :ref:`Limit and Stop Orders <gameplay_stock_market_order_types>`.

    Returns true if the order is successfully placed, and false otherwise.

    .. note:: The ability to place limit and stop orders is **not** immediately available to
              the player and must be unlocked later on in the game.

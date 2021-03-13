cancelOrder() Netscript Function
================================

.. js:function:: cancelOrder(sym, shares, price, type, pos)

    :RAM cost: 2.5 GB
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

    Cancels an oustanding Limit or Stop order on the stock market.

    The ability to use limit and stop orders is **not** immediately available to the player and must be unlocked later on in the game.

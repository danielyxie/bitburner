getStockVolatility() Netscript Function
=======================================

.. js:function:: getStockVolatility(sym)

    :RAM cost: 2.5 GB
    :param string sym: Symbol of stock


    Returns the volatility of the specified stock.

    Volatility represents the maximum percentage by which a stock's price can
    change every tick. The volatility is returned as a decimal value, NOT
    a percentage (e.g. if a stock has a volatility of 3%, then this function will
    return 0.03, NOT 3).

    In order to use this function, you must first purchase access to the Four Sigma (4S)
    Market Data TIX API.

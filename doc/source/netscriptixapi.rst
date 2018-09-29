Netscript Trade Information eXchange (TIX) API
==============================================

The Trade Information eXchange (TIX) is the communications protocol supported by the World Stock Exchange (WSE).
The WESE provides an API that allows you to automatically communicate with the
`Stock Market <http://bitburner.wikia.com/wiki/Stock_Market>`_. This API lets you write code using Netscript
to build automated trading systems and create your own algorithmic trading strategies. Access to this
TIX API can be purchased by visiting the World Stock Exchange in-game.

Access to the TIX API currently costs $5 billion. After you purchase it, you will retain this
access even after you 'reset' by installing Augmentations

getStockPrice
-------------

.. js:function:: getStockPrice(sym)

    :param string sym: Stock symbol

    Returns the price of a stock, given its symbol (NOT the company name). The symbol is a sequence
    of two to four capital letters.

    Example::

        getStockPrice("FISG");

getStockSymbols
-------------

.. js:function:: getStockSymbols()

    Returns an array of the symbols of the tradable stocks.


getStockPosition
----------------

.. js:function:: getStockPosition(sym)

    :param string sym: Stock symbol

    Returns an array of four elements that represents the player's position in a stock.

    The first element is the returned array is the number of shares the player owns of the stock in the
    `Long position <http://bitburner.wikia.com/wiki/Stock_Market#Positions:_Long_vs_Short>`_. The second
    element in the array is the average price of the player's shares in the Long position.

    The third element in the array is the number of shares the player owns of the stock in the
    `Short position <http://bitburner.wikia.com/wiki/Stock_Market#Positions:_Long_vs_Short>`_. The fourth
    element in the array is the average price of the player's Short position.

    All elements in the returned array are numeric.

    Example::

        pos = getStockPosition("ECP");
        shares      = pos[0];
        avgPx       = pos[1];
        sharesShort = pos[2];
        avgPxShort  = pos[3];

buyStock
--------

.. js:function:: buyStock(sym, shares)

    :param string sym: Symbol of stock to purchase
    :param number shares: Number of shares to purchased. Must be positive. Will be rounded to nearest integer

    Attempts to purchase shares of a stock using a `Market Order <http://bitburner.wikia.com/wiki/Stock_Market#Order_Types>`_.

    If the player does not have enough money to purchase the specified number of shares, then no shares will be purchased. Remember
    that every transaction on the stock exchange costs a certain commission fee.

    If this function successfully purchases the shares, it will return the stock price at which each share was purchased. Otherwise,
    it will return 0.

sellStock
---------

.. js:function:: sellStock(sym, shares)

    :param string sym: Symbol of stock to sell
    :param number shares: Number of shares to sell. Must be positive. Will be rounded to nearest integer

    Attempts to sell shares of a stock using a `Market Order <http://bitburner.wikia.com/wiki/Stock_Market#Order_Types>`_.

    If the specified number of shares in the function exceeds the amount that the player actually owns, then this function will
    sell all owned shares. Remember that every transaction on the stock exchange costs a certain commission fee.

    The net profit made from selling stocks with this function is reflected in the script's statistics.
    This net profit is calculated as::

        shares * (sell price - average price of purchased shares)

    If the sale is successful, this function will return the stock price at which each share was sold. Otherwise, it will return 0.

shortStock
----------

.. js:function:: shortStock(sym, shares)

    :param string sym: Symbol of stock to short
    :param number shares: Number of shares to short. Must be positive. Will be rounded to nearest integer

    Attempts to purchase a `short <http://bitburner.wikia.com/wiki/Stock_Market#Positions:_Long_vs_Short>`_ position of a stock
    using a `Market Order <http://bitburner.wikia.com/wiki/Stock_Market#Order_Types>`_.

    The ability to short a stock is **not** immediately available to the player and must be unlocked later on in the game.

    If the player does not have enough money to purchase the specified number of shares, then no shares will be purchased.
    Remember that every transaction on the stock exchange costs a certain commission fee.

    If the purchase is successful, this function will return the stock price at which each share was purchased. Otherwise, it will return 0.

sellShort
---------

.. js:function:: sellShort(sym, shares)

    :param string sym: Symbol of stock to sell
    :param number shares: Number of shares to sell. Must be positive. Will be rounded to nearest integer

    Attempts to sell a `short <http://bitburner.wikia.com/wiki/Stock_Market#Positions:_Long_vs_Short>`_ position of a stock
    using a `Market Order <http://bitburner.wikia.com/wiki/Stock_Market#Order_Types>`_.

    The ability to short a stock is **not** immediately available to the player and must be unlocked later on in the game.

    If the specified number of shares exceeds the amount that the player actually owns, then this function will sell all owned
    shares. Remember that every transaction on the stock exchange costs a certain commission fee.

    If the sale is successful, this function will return the stock price at which each share was sold. Otherwise it will return 0.

placeOrder
----------

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

    Places an order on the stock market. This function only works for `Limit and Stop Orders <http://bitburner.wikia.com/wiki/Stock_Market#Order_Types>`_.

    The ability to place limit and stop orders is **not** immediately available to the player and must be unlocked later on in the game.

    Returns true if the order is successfully placed, and false otherwise.

cancelOrder
-----------

.. js:function:: cancelOrder(sym, shares, price, type, pos)

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

getStockVolatility
------------------

.. js:function:: getStockVolatility(sym)

    :param string sym: Symbol of stock

    Returns the volatility of the specified stock.

    Volatility represents the maximum percentage by which a stock's price can
    change every tick. The volatility is returned as a decimal value, NOT
    a percentage (e.g. if a stock has a volatility of 3%, then this function will
    return 0.03, NOT 3).

    In order to use this function, you must first purchase access to the Four Sigma (4S)
    Market Data TIX API.

getStockForecast
----------------

.. js:function:: getStockForecast(sym)

    :param string sym: Symbol of stock

    Returns the probability that the specified stock's price will increase
    (as opposed to decrease) during the next tick.

    The probability is returned as a decimal value, NOT a percentage (e.g. if a
    stock has a 60% chance of increasing, then this function will return 0.6,
    NOT 60).

    In other words, if this function returned 0.30 for a stock, then this means
    that the stock's price has a 30% chance of increasing and a 70% chance of
    decreasing during the next tick.

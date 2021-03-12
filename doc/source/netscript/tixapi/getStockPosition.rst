getStockPosition() Netscript Function
=====================================

.. js:function:: getStockPosition(sym)

    :RAM cost: 2 GB
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

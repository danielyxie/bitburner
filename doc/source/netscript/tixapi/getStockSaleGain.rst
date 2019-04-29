getStockSaleGain() Netscript Function
=====================================

.. js:function:: getStockSaleGain(sym, shares, posType)

    :param string sym: Stock symbol
    :param number shares: Number of shares to purchase
    :param string posType: Specifies whether the order is a "Long" or "Short" position.
                           The values "L" or "S" can also be used.
    :RAM cost: 2 GB

    Calculates and returns how much you would gain from selling a given number of
    shares of a stock. This takes into account :ref:`spread <gameplay_stock_market_spread>`,
    :ref:`large transactions influencing the price of the stock <gameplay_stock_spread_price_movement>`
    and commission fees.

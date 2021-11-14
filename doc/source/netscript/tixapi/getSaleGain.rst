getSaleGain() Netscript Function
=====================================

.. js:function:: getSaleGain(sym, shares, posType)

    :RAM cost: 2 GB
    :param string sym: Stock symbol
    :param number shares: Number of shares to sell
    :param string posType: Specifies whether the order is a "Long" or "Short" position.
                           The values "L" or "S" can also be used.


    Calculates and returns how much you would gain from selling a given number of
    shares of a stock. This takes into account :ref:`spread <gameplay_stock_market_spread>`
    and commission fees.

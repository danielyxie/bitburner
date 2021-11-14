getPrice() Netscript Function
==================================

.. js:function:: getPrice(sym)

    :RAM cost: 2 GB
    :param string sym: Stock symbol


    Given a stock's symbol, returns the price of that stock (the symbol is a sequence
    of two to four capital letters, **not** the name of the company to which that stock belongs).

    .. note:: The stock's price is the average of its bid and ask price.
              See :ref:`gameplay_stock_market_spread` for details on what this means.

    Example::

        getPrice("FSIG");

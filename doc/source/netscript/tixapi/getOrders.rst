getOrders() Netscript Function
==============================

.. js:function:: getOrders()

    :RAM cost: 2.5 GB

    Returns your order book for the stock market. This is an object containing information
    for all the Limit and Stop Orders you have in the stock market.

    The object has the following structure::

        {
            StockSymbol1: [ // Array of orders for this stock
                {
                    shares: Order quantity
                    price: Order price
                    type: Order type
                    position: Either "L" or "S" for Long or Short position
                },
                {
                    ...
                },
                ...
            ],
            StockSymbol2: [ // Array of orders for this stock
                ...
            ],
            ...
        }

    The "Order type" property can have one of the following four values:

        * "Limit Buy Order"
        * "Limit Sell Order"
        * "Stop Buy Order"
        * "Stop Sell Order"

    **Note that the order book will only contain information for stocks that you actually
    have orders in**. For example, if you do not have orders in Nova Medical (NVMD), then the returned
    object will not have a "NVMD" property.

    Example::

        {
            ECP: [
                {
                    shares: 5,
                    price: 100,000
                    type: "Stop Buy Order",
                    position: "S",
                },
                {
                    shares: 25,
                    price: 125,000
                    type: "Limit Sell Order",
                    position: "L",
                },
            ],
            SYSC: [
                {
                    shares: 100,
                    price: 10,000
                    type: "Limit Buy Order",
                    position: "L",
                },
            ],
        }

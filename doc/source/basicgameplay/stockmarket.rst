.. _gameplay_stock_market:

Stock Market
============
The Stock Market refers to the World Stock Exchange (WSE), through which you can
buy and sell stocks in order to make money.

The WSE can be found in the 'City' tab, and is accessible in every city.

Fundamentals
------------
The Stock Market is not as simple as "buy at price X and sell at price Y". The following
are several fundamental concepts you need to understand about the stock market.

.. note:: For those that have experience with finance/trading/investing, please be aware
          that the game's stock market does not function exactly like it does in the real
          world. So these concepts below should seem similar, but won't be exactly the same.

Positions: Long vs Short
^^^^^^^^^^^^^^^^^^^^^^^^
When making a transaction on the stock market, there are two types of positions:
Long and Short. A Long position is the typical scenario where you buy a stock and
earn a profit if the price of that stock increases. Meanwhile, a Short position
is the exact opposite. In a Short position you purchase shares of a stock and
earn a profit if the price of that stock decreases. This is also called 'shorting'
a stock.

.. note:: Shorting stocks is not available immediately, and must be unlocked later in the
          game.

Forecast & Second-Order Forecast
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
A stock's forecast is its likelihood of increasing or decreasing in value. The
forecast is typically represented by its probability of increasing in either
a decimal or percentage form. For example, a forecast of 70% means the stock
has a 70% chance of increasing and a 30% chance of decreasing.

A stock's second-order forecast is the target value that its forecast trends towards.
For example, if a stock has a forecast of 60% and a second-order forecast of 70%,
then the stock's forecast should slowly trend towards 70% over time. However, this is
determined by RNG so there is a chance that it may never reach 70%.

Both the forecast and the second-order forecast change over time.

A stock's forecast can be viewed after purchasing Four Sigma (4S) Market Data
access. This lets you see the forecast info on the Stock Market UI. If you also
purchase access to the 4S Market Data TIX API, then you can view a stock's forecast
using the :js:func:`getStockForecast` function.

A stock's second-order forecast is always hidden.

.. _gameplay_stock_market_spread:

Spread (Bid Price & Ask Price)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The **bid price** is the maximum price at which someone will buy a stock on the
stock market.

The **ask price** is the minimum price that a seller is willing to receive for a stock
on the stock market

The ask price will always be higher than the bid price (This is because if a seller
is willing to receive less than the bid price, that transaction is guaranteed to
happen). The difference between the bid and ask price is known as the **spread**.
A stock's "price" will be the average of the bid and ask price.

The bid and ask price are important because these are the prices at which a
transaction actually occurs. If you purchase a stock in the long position, the cost
of your purchase depends on that stock's ask price. If you then try to sell that
stock (still in the long position), the price at which you sell is the stock's
bid price. Note that this is reversed for a short position. Purchasing a stock
in the short position will occur at the stock's bid price, and selling a stock
in the short position will occur at the stock's ask price.

Transactions Influencing Stock Forecast
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Buying or selling a large number of shares
of a stock will influence that stock's forecast & second-order forecast.
The forecast is the likelihood that the stock will increase or decrease in price.
The magnitude of this effect depends on the number of shares being transacted.
More shares will have a bigger effect.

The effect that transactions have on a stock's second-order forecast is
significantly smaller than the effect on its forecast.

.. _gameplay_stock_market_order_types:

Order Types
^^^^^^^^^^^
There are three different types of orders you can make to buy or sell stocks on the exchange:
Market Order, Limit Order, and Stop Order.

.. note:: Limit Orders and Stop Orders are not available immediately, and must be unlocked
          later in the game.

When you place a Market Order to buy or sell a stock, the order executes immediately at
whatever the current price of the stock is. For example if you choose to short a stock
with 5000 shares using a Market Order, you immediately purchase those 5000 shares in a
Short position at whatever the current market price is for that stock.

A Limit Order is an order that only executes under certain conditions. A Limit Order is
used to buy or sell a stock at a specified price or better. For example, lets say you
purchased a Long position of 100 shares of some stock at a price of $10 per share. You
can place a Limit Order to sell those 100 shares at $50 or better. The Limit Order will
execute when the price of the stock reaches a value of $50 or higher.

A Stop Order is the opposite of a Limit Order. It is used to buy or sell a stock at a
specified price (before the price gets 'worse'). For example, lets say you purchased a
Short position of 100 shares of some stock at a price of $100 per share. The current
price of the stock is $80 (a profit of $20 per share). You can place a Stop Order to
sell the Short position if the stock's price reaches $90 or higher. This can be used
to lock in your profits and limit any losses.

Here is a summary of how each order works and when they execute:

**In a LONG Position:**

A Limit Order to buy will execute if the stock's price <= order's price

A Limit Order to sell will execute if the stock's price >= order's price

A Stop Order to buy will execute if the stock's price >= order's price

A Stop Order to sell will execute if the stock's price <= order's price

**In a SHORT Position:**

A Limit Order to buy will execute if the stock's price >= order's price

A Limit Order to sell will execute if the stock's price <= order's price

A Stop Order to buy will execute if the stock's price <= order's price

A Stop Order to sell will execute if the stock's price >= order's price.

.. _gameplay_stock_market_player_actions_influencing_stock:

Player Actions Influencing Stocks
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
It is possible for your actions elsewhere in the game to influence the stock market.

Hacking
    If a server has a corresponding stock (e.g. *foodnstuff* server -> FoodNStuff
    stock), then hacking that server can decrease the stock's second-order
    forecast. This causes the corresponding stock's forecast to trend downwards in value
    over time.

    This effect only occurs if you set the *stock* option to
    true when calling the :js:func:`hack` function. The chance that hacking a
    server will cause this effect is based on what percentage of the
    server's total money you steal.

    A single hack will have a minor
    effect, but continuously hacking a server for lots of money over time
    will have a noticeable effect in making the stock's forecast trend downwards.

Growing
    If a server has a corresponding stock (e.g. *foodnstuff* server -> FoodNStuff
    stock), then growing that server's money can increase the stock's
    second-order forecast. This causes the corresponding stock's
    forecast to trend upwards in value over time.

    This effect only occurs if you set the *stock* option to true when calling the
    :js:func:`grow` function. The chance that growing a server will cause this
    effect is based on what percentage of the server's total money to add to it.

    A single grow operation will have a minor effect, but continuously growing
    a server for lots of money over time will have a noticeable effect in making
    the stock's forecast trend upwards.

Working for a Company
    If a company has a corresponding stock, then working for that company will
    increase the corresponding stock's second-order forecast. This will
    cause the stock's forecast to (slowly) trend upwards in value
    over time.

    The potency of this effect is based on how "effective" you are when you work
    (i.e. its based on your stats and multipliers).

Automating the Stock Market
---------------------------
You can write scripts to perform automatic and algorithmic trading on the Stock Market.
See :ref:`netscript_tixapi` for more details.

Under the Hood
--------------
Stock prices are updated very ~6 seconds.

Whether a stock's price moves up or down is determined by RNG. However,
stocks have properties that can influence the way their price moves. These properties
are hidden, although some of them can be made visible by purchasing the
Four Sigma (4S) Market Data upgrade. Some examples of these properties are:

* Volatility
* Likelihood of increasing or decreasing (i.e. the stock's forecast)
* Likelihood of forecast increasing or decreasing (i.e. the stock's second-order forecast)
* How easily a stock's price/forecast is influenced by transactions
* Spread percentage
* Maximum price (not a real maximum, more of a "soft cap")

Each stock has its own unique values for these properties.

Offline Progression
-------------------
The Stock Market does not change or process anything while the game has closed.
However, it does accumulate time when offline. This accumulated time allows
the stock market to run 50% faster when the game is opened again. This means
that stock prices will update every ~4 seconds instead of 6.

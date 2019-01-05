.. _gameplay_stock_market:

Stock Market
============
The Stock Market refers to the World Stock Exchange (WSE), through which you can
buy and sell stocks in order to make money.

The WSE can be found in the 'City' tab, and is accessible in every city.

Positions: Long vs Short
^^^^^^^^^^^^^^^^^^^^^^^^
When making a transaction on the stock market, there are two types of positions:
Long and Short. A Long position is the typical scenario where you buy a stock and
earn a profit if the price of that stock increases. Meanwhile, a Short position
is the exact opposite. In a Short position you purchase shares of a stock and
earn a profit if the price of that stock decreases. This is also called 'shorting'
a stock.

NOTE: Shorting stocks is not available immediately, and must be unlocked later in the
game.

Order Types
^^^^^^^^^^^
There are three different types of orders you can make to buy or sell stocks on the exchange:
Market Order, Limit Order, and Stop Order.

Note that Limit Orders and Stop Orders are not available immediately, and must be unlocked
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

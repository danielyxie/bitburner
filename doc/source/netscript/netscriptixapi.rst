.. _netscript_tixapi:

Netscript Trade Information eXchange (TIX) API
==============================================

The Trade Information eXchange (TIX) is the communications protocol supported by the World Stock Exchange (WSE).
The WSE provides an API that allows you to automatically communicate with the
:ref:`Stock Market <gameplay_stock_market>`.
This API lets you write code using Netscript
to build automated trading systems and create your own algorithmic trading strategies. Access to this
TIX API can be purchased by visiting the World Stock Exchange in-game.

Access to the TIX API currently costs $5 billion. After you purchase it, you will retain this
access even after you 'reset' by installing Augmentations

**TIX API functions must be accessed through the stock namespace**

.. toctree::
    :caption: API Functions:

    getSymbols() <tixapi/getSymbols>
    getPrice() <tixapi/getPrice>
    getAskPrice() <tixapi/getAskPrice>
    getBidPrice() <tixapi/getBidPrice>
    getPosition() <tixapi/getPosition>
    getMaxShares() <tixapi/getMaxShares>
    getPurchaseCost() <tixapi/getPurchaseCost>
    getSaleGain() <tixapi/getSaleGain>
    buy() <tixapi/buy>
    sell() <tixapi/sell>
    short() <tixapi/short>
    sellShort() <tixapi/sellShort>
    placeOrder() <tixapi/placeOrder>
    cancelOrder() <tixapi/cancelOrder>
    getOrders() <tixapi/getOrders>
    getVolatility() <tixapi/getVolatility>
    getForecast() <tixapi/getForecast>
    purchase4SMarketData() <tixapi/purchase4SMarketData>
    purchase4SMarketDataTixApi() <tixapi/purchase4SMarketDataTixApi>

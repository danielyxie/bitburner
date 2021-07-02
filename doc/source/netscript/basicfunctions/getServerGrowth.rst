getServerGrowth() Netscript Function
====================================

.. js:function:: getServerGrowth(hostname)

    :RAM cost: 0.1 GB
    :param string hostname: Hostname of target server.
    :returns: Server growth parameter.

    The growth parameter is a number, typically between 1 and 100, that affects
    the percentage by which the server's money is increased when using the
    :doc:`grow<grow>` function. A higher growth parameter will result in a
    higher percentage increase.

    Example:

    .. code-block:: javascript

        getServerGrowth('foodnstuff'); // returns: 5

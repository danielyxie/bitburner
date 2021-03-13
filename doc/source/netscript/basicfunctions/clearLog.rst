clearLog() Netscript Function
=============================

.. js:function:: clearLog()

    :RAM cost: 0 GB

    Clears the script's logs. Useful when making monitoring scripts.

    Examples:

    .. code-block:: javascript

        while(true) {
            clearLog();
            print(getServerMoneyAvailable('foodnstuff'));
        }

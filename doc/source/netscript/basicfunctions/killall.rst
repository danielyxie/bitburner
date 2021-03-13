killall() Netscript Function
============================

.. js:function:: killall(hostname)

    :RAM cost: 0.5 GB
    :param string hostname: Hostname of the server on which to kill all scripts.
    :returns: ``true`` if scripts were killed on target server.

    Kills all running scripts on the specified server.


    Example:

    .. code-block:: javascript

        killall('foodnstuff'); // returns: true
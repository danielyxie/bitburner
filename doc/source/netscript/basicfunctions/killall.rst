killall() Netscript Function
============================

.. js:function:: killall(hostname/ip)

    :param string hostname/ip: IP or hostname of the server on which to kill all scripts
    :RAM cost: 0.5 GB

    Kills all running scripts on the specified server. This function returns true if any scripts were killed, and
    false otherwise. In other words, it will return true if there are any scripts running on the target server.

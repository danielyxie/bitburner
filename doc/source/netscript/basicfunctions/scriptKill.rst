scriptKill() Netscript Function
===============================

.. js:function:: scriptKill(scriptname, hostname/ip)

    :param string scriptname: Filename of script to kill. This is case-sensitive.
    :param string hostname/ip: Hostname or IP of target server
    :RAM cost: 1 GB

    Kills all scripts with the specified filename on the target server specified by *hostname/ip*, regardless of arguments. Returns
    true if one or more scripts were successfully killed, and false if none were.

getGrowTime() Netscript Function
================================

.. js:function:: getGrowTime(hostname/ip[, hackLvl=current level])

    :param string hostname/ip: Hostname or IP of target server
    :param number hackLvl: Optional hacking level for the calculation. Defaults to player's current hacking level
    :RAM cost: 0.05 GB

    Returns the amount of time in seconds it takes to execute the *grow()* Netscript function on the target server.

    The function takes in an optional *hackLvl* parameter that can be specified
    to see what the grow time would be at different hacking levels.

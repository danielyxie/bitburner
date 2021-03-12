getGrowTime() Netscript Function
================================

.. js:function:: getGrowTime(hostname[, hackLvl=current level])

    :RAM cost: 0.05 GB

    :param string hostname: Hostname of target server.
    :param number hackLvl: Optional hacking level for the calculation. Defaults
        to player's current hacking level.
    :returns: seconds it takes to execute :doc:`grow<grow>` on that server.

    The function takes in an optional ``hackLvl`` parameter that can be
    specified to see what the grow time would be at different hacking levels.


    Example:

    .. code-block:: javascript

        getGrowTime("foodnstuff"); // returns: 53.4

.. note:: For Hacknet Servers (the upgraded version of a Hacknet Node), this function will
              return ``Infinity``.

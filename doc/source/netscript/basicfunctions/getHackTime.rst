getHackTime() Netscript Function
================================

.. js:function:: getHackTime(hostname[, hackLvl=current level])

    :RAM cost: 0.05 GB
    :param string hostname: Hostname of target server.
    :returns: seconds it takes to execute :doc:`hack<hack>` on that server.

    The function takes in an optional ``hackLvl`` parameter that can be
    specified to see what the hack time would be at different hacking levels.

    Example:

    .. code-block:: javascript

        getHackTime("foodnstuff"); // returns: 53.4

    .. note:: For Hacknet Servers (the upgraded version of a Hacknet Node), this function will
              return :code:`Infinity`. 

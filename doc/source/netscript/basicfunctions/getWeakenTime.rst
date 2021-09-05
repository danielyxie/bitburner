getWeakenTime() Netscript Function
==================================

.. js:function:: getWeakenTime(hostname[, hackLvl=current level])

    :RAM cost: 0.05 GB
    :param string hostname: Hostname of target server.
    :returns: seconds it takes to execute the :doc:`weaken<weaken>` Netscript
        function on the target server.

    The function takes in an optional *hackLvl* parameter that can be specified
    to see what the weaken time would be at different hacking levels.

    Example:

    .. code-block:: javascript

        getWeakenTime("foodnstuff"); // returns: 34.5

    .. note:: For Hacknet Servers (the upgraded version of a Hacknet Node), this function will
              return :code:`Infinity`. 

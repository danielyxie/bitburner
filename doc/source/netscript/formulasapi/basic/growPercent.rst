growPercent() Netscript Function
=================================

.. js:function:: growPercent(server, threads, player)

    :RAM cost: 0 GB
    :param server server: The server that receives the growth.
    :param number threads: The number of thread that would be used.
    :param player player: The player.
    :returns: The percentage growth this server would receive with these parameters.

    You must have Source-File 5-1 in order to use this function.

    Server can be acquired with the :doc:`getServer<../../advancedfunctions/getServer>` function.
    Player can be acquired with the :doc:`getPlayer<../../singularityfunctions/getPlayer>` function.

    This function calculates percentage of growth a server would receive with these parameters.

    Examples:

    .. code-block:: javascript

        tprint(formulas.basic.growPercent(getServer(), 50, getPlayer()))
hackTime() Netscript Function
=================================

.. js:function:: hackTime(server, player)

    :RAM cost: 0 GB
    :param server server: The server to hack.
    :param player player: The player.
    :returns: The time it takes to hack this server. In seconds.

    You must have Source-File 5-1 in order to use this function.

    Server can be acquired with the :doc:`getServer<../../advancedfunctions/getServer>` function.
    Player can be acquired with the :doc:`getPlayer<../../singularityfunctions/getPlayer>` function.

    This function calculates the amount of time it takes to hack a server.

    Examples:

    .. code-block:: javascript

        server = getServer();
        server.hackDifficulty = server.minDifficulty;
        tprint(formulas.basic.hackTime(server, getPlayer()));
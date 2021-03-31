hackChance() Netscript Function
=================================

.. js:function:: hackChance(server, player)

    :RAM cost: 0 GB
    :param server server: The server to hack.
    :param player player: The player.
    :returns: The change to hack that server. between 0 and 1.

    You must have Source-File 5-1 in order to use this function.

    Server can be acquired with the :doc:`getServer<../../advancedfunctions/getServer>` function.
    Player can be acquired with the :doc:`getPlayer<../../singularityfunctions/getPlayer>` function.

    This function calculates percentage chance to hack a server.

    Examples:

    .. code-block:: javascript

        server = getServer();
        server.hackDifficulty = server.minDifficulty;
        tprint(hackChance(server, getPlayer()));
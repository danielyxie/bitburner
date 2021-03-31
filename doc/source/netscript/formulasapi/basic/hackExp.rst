hackExp() Netscript Function
=================================

.. js:function:: hackExp(server, player)

    :RAM cost: 0 GB
    :param server server: The server to hack.
    :param player player: The player.
    :returns: The amount of exp that would be acquired if this server were to be hacked.

    You must have Source-File 5-1 in order to use this function.

    Server can be acquired with the :doc:`getServer<../../advancedfunctions/getServer>` function.
    Player can be acquired with the :doc:`getPlayer<../../singularityfunctions/getPlayer>` function.

    This function calculates the amount of exp obtained by hacking a server.

    Examples:

    .. code-block:: javascript

        server = getServer();
        server.hackDifficulty = 99.9;
        tprint(hackExp(server, getPlayer()));
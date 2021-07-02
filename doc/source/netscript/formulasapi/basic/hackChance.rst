hackChance() Netscript Function
=================================

.. js:function:: hackChance(server, player)

    :RAM cost: 0 GB
    :param server server: The server to hack.
    :param player player: The player.
    :returns: The chance to hack that server, between 0 and 1.

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to
    use this function.

    Server can be acquired with the :doc:`getServer<../../advancedfunctions/getServer>` function.
    Player can be acquired with the :doc:`getPlayer<../../basicfunctions/getPlayer>` function.

    This function calculates the probability to successfully hack a server.

    Examples:

    .. code-block:: javascript

        server = getServer();
        server.hackDifficulty = server.minDifficulty;
        tprint(formulas.basic.hackChance(server, getPlayer()));

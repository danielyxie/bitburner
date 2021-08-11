growTime() Netscript Function
=================================

.. js:function:: growTime(server, player)

    :RAM cost: 0 GB
    :param server server: The server to grow.
    :param player player: The player.
    :returns: The time it takes to grow this server. In seconds.

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to
    use this function.

    Server can be acquired with the :doc:`getServer<../../advancedfunctions/getServer>` function.
    Player can be acquired with the :doc:`getPlayer<../../basicfunctions/getPlayer>` function.

    This function calculates the amount of time it takes to grow a server.

    Examples:

    .. code-block:: javascript

        server = getServer();
        server.hackDifficulty = server.minDifficulty;
        tprint(formulas.basic.growTime(server, getPlayer()));

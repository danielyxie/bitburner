hackPercent() Netscript Function
=================================

.. js:function:: hackPercent(server, player)

    :RAM cost: 0 GB
    :param server server: The server to hack.
    :param player player: The player.
    :returns: The percentage of money hacked from the server's money.

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to
    use this function.

    Server can be acquired with the :doc:`getServer<../../advancedfunctions/getServer>` function.
    Player can be acquired with the :doc:`getPlayer<../../basicfunctions/getPlayer>` function.

    This function calculates the percentage of money hacked from a server.
    Multiply this by thread count to calculate the percentage for more than 1 thread.

    Examples:

    .. code-block:: javascript

        server = getServer();
        server.hackDifficulty = server.minDifficulty;
        tprint(formulas.basic.hackPercent(server, getPlayer()));

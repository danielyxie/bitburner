growPercent() Netscript Function
=================================

.. js:function:: growPercent(server, threads, player)

    :RAM cost: 0 GB
    :param server server: The server that receives the growth.
    :param number threads: The number of thread that would be used.
    :param player player: The player.
    :returns: The amount the server's money would be multiplied by with these
        parameters.

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to
    use this function.

    Server can be acquired with the :doc:`getServer<../../advancedfunctions/getServer>` function.
    Player can be acquired with the :doc:`getPlayer<../../basicfunctions/getPlayer>` function.

    This function calculates the amount of growth, as a multiplier, a server
    would receive with these parameters. Despite its name, it does not return
    a percentage.

    Examples:

    .. code-block:: javascript

        tprint(formulas.basic.growPercent(getServer(), 50, getPlayer()))

getHackingMultipliers() Netscript Function
==========================================

.. js:function:: getHackingMultipliers()

    :RAM cost: 4 GB
    :returns: object containing the player's hacking multipliers. These
        multipliers are returned in decimal forms, not percentages (e.g. 1.5
        instead of 150%).

    Structure::

        {
            chance: Player's hacking chance multiplier,
            speed: Player's hacking speed multiplier,
            money: Player's hacking money stolen multiplier,
            growth: Player's hacking growth multiplier
        }

    Example:

    .. code-block:: javascript

        mults = getHackingMultipliers();
        print(mults.chance);
        print(mults.growth);

getHackingMultipliers() Netscript Function
==========================================

.. js:function:: getHackingMultipliers()

    :RAM cost: 4 GB

    Returns an object containing the Player's hacking related multipliers. These multipliers are
    returned in decimal forms, not percentages (e.g. 1.5 instead of 150%). The object has the following structure::

        {
            chance: Player's hacking chance multiplier,
            speed: Player's hacking speed multiplier,
            money: Player's hacking money stolen multiplier,
            growth: Player's hacking growth multiplier
        }

    Example of how this can be used::

        mults = getHackingMultipliers();
        print(mults.chance);
        print(mults.growth);

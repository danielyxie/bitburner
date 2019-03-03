getHacknetMultipliers() Netscript Function
==========================================

.. js:function:: getHacknetMultipliers()

    :RAM cost: 4 GB

    Returns an object containing the Player's hacknet related multipliers. These multipliers are
    returned in decimal forms, not percentages (e.g. 1.5 instead of 150%). The object has the following structure::

        {
            production: Player's hacknet production multiplier,
            purchaseCost: Player's hacknet purchase cost multiplier,
            ramCost: Player's hacknet ram cost multiplier,
            coreCost: Player's hacknet core cost multiplier,
            levelCost: Player's hacknet level cost multiplier
        }

    Example of how this can be used::

        mults = getHacknetMultipliers();
        print(mults.production);
        print(mults.purchaseCost);

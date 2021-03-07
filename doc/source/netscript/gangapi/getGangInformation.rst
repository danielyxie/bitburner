getGangInformation() Netscript Function
========================================

.. js:function:: getGangInformation()

    Get general information about the gang

    :returns: An object with the gang information.

    The object has the following structure::

        {
            faction:                Name of faction that the gang belongs to ("Slum Snakes", etc.)
            isHacking:              Boolean indicating whether or not its a hacking gang
            moneyGainRate:          Money earned per second
            power:                  Gang's power for territory warfare
            respect:                Gang's respect
            respectGainRate:        Respect earned per second
            territory:              Amount of territory held. Returned in decimal form, not percentage
            territoryClashChance:   Clash chance. Returned in decimal form, not percentage
            wantedLevel:            Gang's wanted level
            wantedLevelGainRate:    Wanted level gained/lost per second (negative for losses)
        }

    :RAM cost: 2 GB

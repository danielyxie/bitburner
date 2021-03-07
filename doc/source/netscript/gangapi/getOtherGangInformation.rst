getOtherGangInformation() Netscript Function
============================================

.. js:function:: getOtherGangInformation()

    Get territory and power information about all gangs

    :returns: An object with information about all gangs

    The object has the following structure::

        {
            "Slum Snakes" : {
                power: Slum Snakes' power
                territory: Slum Snakes' territory, in decimal form
            },
            "Tetrads" : {
                power: ...
                territory: ...
            },
            "The Syndicate" : {
                power: ...
                territory: ...
            },
            ... (for all six gangs)
        }

    :RAM cost: 2 GB

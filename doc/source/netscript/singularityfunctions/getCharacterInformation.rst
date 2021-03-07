getCharacterInformation() Netscript Function
============================================

.. js:function:: getCharacterInformation()

    :RAM cost: 0.5 GB

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to run this function.

    Returns an object with various information about your character. The object has the following properties::

        {
            bitnode:                Current BitNode number
            city:                   Name of city you are currently in
            factions:               Array of factions you are currently a member of
            hp:                     Current health points
            jobs:                   Array of all companies at which you have jobs
            jobTitle:               Array of job positions for all companies you are employed at. Same order as 'jobs'
            maxHp:                  Maximum health points
            tor:                    Boolean indicating whether or not you have a tor router

            // The following is an object with many of the player's multipliers from Augmentations/Source Files
            mult: {
                agility:            Agility stat
                agilityExp:         Agility exp
                companyRep:         Company reputation
                crimeMoney:         Money earned from crimes
                crimeSuccess:       Crime success chance
                defense:            Defense stat
                defenseExp:         Defense exp
                dexterity:          Dexterity stat
                dexterityExp:       Dexterity exp
                factionRep:         Faction reputation
                hacking:            Hacking stat
                hackingExp:         Hacking exp
                strength:           Strength stat
                strengthExp:        Strength exp
                workMoney:          Money earned from jobs
            },

            // The following apply only to when the character is performing
            // some type of working action, such as working for a company/faction
            timeWorked:             Timed worked in ms
            workHackExpGain:        Hacking experience earned so far from work
            workStrExpGain:         Str experience earned so far from work
            workDefExpGain:         Def experience earned so far from work
            workDexExpGain:         Dex experience earned so far from work
            workAgiExpGain:         Agi experience earned so far from work
            workChaExpGain:         Cha experience earned so far from work
            workRepGain:            Reputation earned so far from work, if applicable
            workMoneyGain:          Money earned so far from work, if applicable
        }

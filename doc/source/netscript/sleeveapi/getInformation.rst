getInformation() Netscript Function
=======================================

.. js:function:: getInformation(sleeveNumber)
    
    :RAM cost: 4 GB

    :param int sleeveNumber: Index of the sleeve to retrieve information. See :ref:`here <netscript_sleeveapi_referencingaduplicatesleeve>`

    Return a struct containing tons of information about this sleeve

.. code-block:: javascript

    {
        city:     location of the sleeve,
        hp:       current hp of the sleeve,
        maxHp:    max hp of the sleeve,
        jobs:     jobs available to the sleeve,
        jobTitle: job titles available to the sleeve,
        
        mult: {
            agility:      agility multiplier,
            agilityExp:   agility exp multiplier,
            companyRep:   company reputation multiplier,
            crimeMoney:   crime money multiplier,
            crimeSuccess: crime success chance multiplier,
            defense:      defense multiplier,
            defenseExp:   defense exp multiplier,
            dexterity:    dexterity multiplier,
            dexterityExp: dexterity exp multiplier,
            factionRep:   faction reputation multiplier,
            hacking:      hacking skill multiplier,
            hackingExp:   hacking exp multiplier,
            strength:     strength multiplier,
            strengthExp:  strength exp multiplier,
            workMoney:    work money multiplier,
        },
        timeWorked: time spent on the current task in milliseconds,
        earningsForSleeves : { earnings synchronized to other sleeves
                workHackExpGain: hacking exp gained from work,
                workStrExpGain:  strength exp gained from work,
                workDefExpGain:  defense exp gained from work,
                workDexExpGain:  dexterity exp gained from work,
                workAgiExpGain:  agility exp gained from work,
                workChaExpGain:  charisma exp gained from work,
                workMoneyGain:   money gained from work,
        },
        earningsForPlayer : { earnings synchronized to the player
                workHackExpGain: hacking exp gained from work,
                workStrExpGain:  strength exp gained from work,
                workDefExpGain:  defense exp gained from work,
                workDexExpGain:  dexterity exp gained from work,
                workAgiExpGain:  agility exp gained from work,
                workChaExpGain:  charisma exp gained from work,
                workMoneyGain:   money gained from work,
        },
        earningsForTask : { earnings for this sleeve
                workHackExpGain: hacking exp gained from work,
                workStrExpGain:  strength exp gained from work,
                workDefExpGain:  defense exp gained from work,
                workDexExpGain:  dexterity exp gained from work,
                workAgiExpGain:  agility exp gained from work,
                workChaExpGain:  charisma exp gained from work,
                workMoneyGain:   money gained from work,
        },
        workRepGain: Reputation gain rate when working for factions or companies
    }

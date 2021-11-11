getPlayer() Netscript Function
==============================

.. js:function:: getPlayer()

    :RAM cost: 0.5 GB

    The result of this function can be passed to the :doc:`formulas API<../netscriptformulasapi>`.

    Returns an object with the Player's stats. The object has the following properties::

        {
            hacking:                         Current Hacking skill level
            hp:                              Current health points
            max_hp:                          Maximum health points
            strength:                        Current Strength skill level
            defense:                         Current Defense skill level
            dexterity:                       Current Dexterity skill level
            agility:                         Current Agility skill level
            charisma:                        Current Charisma skill level
            intelligence:                    Current Intelligence skill level (from BitNode-5)
            hacking_chance_mult:             Hacking Chance multiplier (from Source-Files and Augments)
            hacking_speed_mult:              Hacking Speed multiplier (from Source-Files and Augments)
            hacking_money_mult:              Hacking Money multiplier (from Source-Files and Augments)
            hacking_grow_mult:               Hacking Growth multiplier (from Source-Files and Augments)
            hacking_exp:                     Current Hacking experience points
            strength_exp:                    Current Strength experience points
            defense_exp:                     Current Defense experience points
            dexterity_exp:                   Current Dexterity experience points
            agility_exp:                     Current Agility experience points
            charisma_exp:                    Current Charisma experience points
            hacking_mult:                    Hacking Level multiplier (from Source-Files and Augments)
            strength_mult:                   Strength Level multiplier (from Source-Files and Augments)
            defense_mult:                    Defense Level multiplier (from Source-Files and Augments)
            dexterity_mult:                  Dexterity Level multiplier (from Source-Files and Augments)
            agility_mult:                    Agility Level multiplier (from Source-Files and Augments)
            charisma_mult:                   Charisma Level multiplier (from Source-Files and Augments)
            hacking_exp_mult:                Hacking Experience multiplier (from Source-Files and Augments)
            strength_exp_mult:               Strength Experience multiplier (from Source-Files and Augments)
            defense_exp_mult:                Defense Experience multiplier (from Source-Files and Augments)
            dexterity_exp_mult:              Dexterity Experience multiplier (from Source-Files and Augments)
            agility_exp_mult:                Agility Experience multiplier (from Source-Files and Augments)
            charisma_exp_mult:               Charisma Experience multiplier (from Source-Files and Augments)
            company_rep_mult:                Company reputation gain multiplier (from Source-Files and Augments)
            faction_rep_mult:                Faction reputation gain multiplier (from Source-Files and Augments)
            money:                           Current money
            city:                            Name of city you are currently in
            location:                        Name of the last location visited
            crime_money_mult:                Crime money multiplier (from Source-Files and Augments)
            crime_success_mult:              Crime success multiplier (from Source-Files and Augments)
            isWorking:                       Boolean indicating whether the player is currently performing work
            workType:                        Name of the kind of work the player is performing
            currentWorkFactionName:          Name of the faction the player is currently working for
            currentWorkFactionDescription:   Description of the kind of work the player is currently doing
            workHackExpGainRate:             Amount of Hacking experience the player will gain every cycle (fifth of a second)
            workStrExpGainRate:              Amount of Strength experience the player will gain every cycle
            workDefExpGainRate:              Amount of Defense experience the player will gain every cycle
            workDexExpGainRate:              Amount of Dexterity experience the player will gain every cycle
            workAgiExpGainRate:              Amount of Agility experience the player will gain every cycle
            workChaExpGainRate:              Amount of Charisma experience the player will gain every cycle
            workRepGainRate:                 Amount of Reputation the player will gain every cycle
            workMoneyGainRate:               Amount of Money the player will gain every cycle
            workMoneyLossRate:               Amount of Money the player will lose every cycle
            workHackExpGained:               Total Hacking experience gained while working thus far
            workStrExpGained:                Total Strength experience gained while working thus far
            workDefExpGained:                Total Defense experience gained while working thus far
            workDexExpGained:                Total Dexterity experience gained while working thus far
            workAgiExpGained:                Total Agility experience gained while working thus far
            workChaExpGained:                Total Charisma experience gained while working thus far
            workRepGained:                   Total Reputation gained while working thus far
            workMoneyGained:                 Total Money gained while working thus far
            createProgramName:               Name of the program the player is currently creating
            createProgramReqLvl:             Hacking skill required to make that program
            className:                       Name of the class the player is currently studying
            crimeType:                       Name of the crime the player last started
            work_money_mult:                 Salary multiplier (from Source-Files and Augments)
            hacknet_node_money_mult:         Hacknet Node production multiplier (from Source-Files and Augments)
            hacknet_node_purchase_cost_mult: Hacknet Node purchase cost multiplier (from Source-Files and Augments)
            hacknet_node_ram_cost_mult:      Hacknet Node RAM upgrade cost multiplier (from Source-Files and Augments)
            hacknet_node_core_cost_mult:     Hacknet Node Core purchase cost multiplier (from Source-Files and Augments)
            hacknet_node_level_cost_mult:    Hacknet Node level upgrade cost multiplier (from Source-Files and Augments)
            hasWseAccount:                   Boolean indicating whether the player has a WSE Account
            hasTixApiAccess:                 Boolean indicating whether the player has TIX API Access
            has4SData:                       Boolean indicating whether the player has 4S Market Data Access
            has4SDataTixApi:                 Boolean indicating whether the player has 4S Market Data TIX API Access
            bladeburner_max_stamina_mult:    Bladeburner Max Stamina multiplier (from Source-Files and Augments)
            bladeburner_stamina_gain_mult:   Bladeburner Stamina Gain multiplier (from Source-Files and Augments)
            bladeburner_success_chance_mult: Bladeburner Success Chance multiplier (from Source-Files and Augments)
            bitNodeN:                        Current BitNode number
            totalPlaytime:                   Total amount of time the game has been running, in milliseconds
            playtimeSinceLastAug:            Milliseconds since the last time Augmentations were installed
            playtimeSinceLastBitnode:        Milliseconds since this BitNode was started
            jobs:                            A mapping of companies the player works for to the title of the player's job at that company
            factions:                        An array of factions the player is currently a member of
            tor:                             Boolean indicating whether or not you have a tor router
        }

    Example::

        player = getPlayer();
        print('My charisma level is: ' + player.charisma);

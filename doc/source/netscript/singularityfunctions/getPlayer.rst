getPlayer() Netscript Function
==============================

.. js:function:: getPlayer()

    :RAM cost: 0.5 GB

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to run this function.

    The result of this function can be passed to the :doc:`formulas API<../netscriptformulasapi>`.

    Returns an object with the Player's stats. The object has the following properties::

        {
            hacking_skill
            hp
            max_hp
            strength
            defense
            dexterity
            agility
            charisma
            intelligence
            hacking_chance_mult
            hacking_speed_mult
            hacking_money_mult
            hacking_grow_mult
            hacking_exp
            strength_exp
            defense_exp
            dexterity_exp
            agility_exp
            charisma_exp
            hacking_mult
            strength_mult
            defense_mult
            dexterity_mult
            agility_mult
            charisma_mult
            hacking_exp_mult
            strength_exp_mult
            defense_exp_mult
            dexterity_exp_mult
            agility_exp_mult
            charisma_exp_mult
            company_rep_mult
            faction_rep_mult
            money
            city
            location
            crime_money_mult
            crime_success_mult
            isWorking
            workType
            currentWorkFactionName
            currentWorkFactionDescription
            workHackExpGainRate
            workStrExpGainRate
            workDefExpGainRate
            workDexExpGainRate
            workAgiExpGainRate
            workChaExpGainRate
            workRepGainRate
            workMoneyGainRate
            workMoneyLossRate
            workHackExpGained
            workStrExpGained
            workDefExpGained
            workDexExpGained
            workAgiExpGained
            workChaExpGained
            workRepGained
            workMoneyGained
            createProgramName
            createProgramReqLvl
            className
            crimeType
            work_money_mult
            hacknet_node_money_mult
            hacknet_node_purchase_cost_mult
            hacknet_node_ram_cost_mult
            hacknet_node_core_cost_mult
            hacknet_node_level_cost_mult
            hasWseAccount
            hasTixApiAccess
            has4SData
            has4SDataTixApi
            bladeburner_max_stamina_mult
            bladeburner_stamina_gain_mult
            bladeburner_success_chance_mult
            bitNodeN
            totalPlaytime
            playtimeSinceLastAug
            playtimeSinceLastBitnode
            jobs
        }

    Example::

        player = getPlayer();
        print('My charisma level is: ' + player.charisma);

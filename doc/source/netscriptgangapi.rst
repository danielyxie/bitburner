Netscript Gang API
==================

Netscript provides the following API for interacting with the game's Gang mechanic.

The Gang API is **not** immediately available to the player and must be unlocked
later in the game

**WARNING: This page contains spoilers for the game**

The Gang API is unlocked in BitNode-2. Currently, BitNode-2 is the only location
where the Gang mechanic is accessible. This may change in the future

**Gang API functions must be accessed through the 'gang' namespace**

In :ref:`netscript1`::

    gang.getMemberNames();
    gang.recruitMember("Fry");

In :ref:`netscriptjs`::

    ns.gang.getMemberNames();
    ns.gang.recruitMember("Fry");

getMemberNames
--------------

.. js:function:: getMemberNames()

    Get the names of all Gang members

    :returns: An array of the names of all Gang members as strings

getGangInformation
------------------

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

getOtherGangInformation
-----------------------

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

getMemberInformation
--------------------

.. js:function:: getMemberInformation(name)

    :param string name: Name of member

    Get stat and equipment-related information about a Gang Member

    :returns: An object with the gang member information.

    The object has the following structure::

        {
            agility:                Agility stat
            agilityEquipMult:       Agility multiplier from equipment. Decimal form
            agilityAscensionMult:   Agility multiplier from ascension. Decimal form
            augmentations:          Array of names of all owned Augmentations
            charisma:               Charisma stat
            charismaEquipMult:      Charisma multiplier from equipment. Decimal form
            charismaAscensionMult:  Charisma multiplier from ascension. Decimal form
            defense:                Defense stat
            defenseEquipMult:       Defense multiplier from equipment. Decimal form
            defenseAscensionMult:   Defense multiplier from ascension. Decimal form
            dexterity:              Dexterity stat
            dexterityEquipMult:     Dexterity multiplier from equipment. Decimal form
            dexterityAscensionMult: Dexterity multiplier from ascension. Decimal form
            equipment:              Array of names of all owned Non-Augmentation Equipment
            hacking:                Hacking stat
            hackingEquipMult:       Hacking multiplier from equipment. Decimal form
            hackingAscensionMult:   Hacking multiplier from ascension. Decimal form
            strength:               Strength stat
            strengthEquipMult:      Strength multiplier from equipment. Decimal form
            strengthAscensionMult:  Strength multiplier from ascension. Decimal form
            task:                   Name of currently assigned task
        }

canRecruitMember
----------------

.. js:function:: canRecruitMember()

    :returns: Boolean indicating whether a member can currently be recruited

recruitMember
-------------

.. js:function:: recruitMember(name)

    :param string name: Name of member to recruit

    Attempt to recruit a new gang member.

    Possible reasons for failure:
    * Cannot currently recruit a new member
    * There already exists a member with the specified name

    :returns: True if the member was successfully recruited. False otherwise

getTaskNames
------------

.. js:function:: getTaskNames()

    Get the name of all valid tasks that Gang members can be assigned to

    :returns: Array of strings of all task names

setMemberTask
-------------

.. js:function:: setMemberTask(memberName, taskName)

    :param string memberName: Name of Gang member to assign
    :param string taskName: Task to assign

    Attempts to assign the specified Gang Member to the specified task.
    If an invalid task is specified, the Gang member will be set to idle ("Unassigned")

    :returns: True if the Gang Member was successfully assigned to the task. False otherwise

getEquipmentNames
-----------------

.. js:function:: getEquipmentNames()

    Get the name of all possible equipment/upgrades you can purchase for your
    Gang Members. This includes Augmentations.

    :returns: Array of strings of the names of all Equpiment/Augmentations

getEquipmentCost
----------------

.. js:function:: getEquipmentCost(equipName)

    :param string equipName: Name of equipment

    Get the amount of money it takes to purchase a piece of Equipment or an Augmentation.
    If an invalid Equipment/Augmentation is specified, this function will return Infinity.

    :returns: Cost to purchase the specified Equipment/Augmentation (number). Infinity
             for invalid arguments

getEquipmentType
----------------

.. js:function:: getEquipmentType(equipName)

    :param string equipName: Name of equipment

    Get the specified equipment type, which can be one of the following:

    * Weapon
    * Armor
    * Vehicle
    * Rootkit
    * Augmentation

    :returns: A string stating the type of the equipment

purchaseEquipment
-----------------

.. js:function:: purchaseEquipment(memberName, equipName)

    :param string memberName: Name of Gang member to purchase the equipment for
    :param string equipName: Name of Equipment/Augmentation to purchase

    Attempt to purchase the specified Equipment/Augmentation for the specified
    Gang member.

    :returns: True if the equipment was successfully purchased. False otherwise


ascendMember
------------

.. js:function:: ascendMember(name)

    :param string name: Name of member to ascend

    Ascend the specified Gang Member.

    :returns: An object with info about the ascension results.

    The object has the following structure::

        {
            respect:    Amount of respect lost from ascending
            hack:       Hacking multiplier gained from ascending. Decimal form
            str:        Strength multiplier gained from ascending. Decimal form
            def:        Defense multiplier gained from ascending. Decimal form
            dex:        Dexterity multiplier gained from ascending. Decimal form
            agi:        Agility multiplier gained from ascending. Decimal form
            cha:        Charisma multiplier gained from ascending. Decimal form
        }


setTerritoryWarfare
-------------------

.. js:function:: setTerritoryWarfare(engage)

    :param bool engage: Whether or not to engage in territory warfare

    Set whether or not the gang should engage in territory warfare

getChanceToWinClash
-------------------

.. js:function:: getChanceToWinClash(gangName)

    :param string gangName: Target gang

    Returns the chance you have to win a clash with the specified gang. The chance
    is returned in decimal form, not percentage


getBonusTime
------------

.. js:function:: getBonusTime()

    Returns the amount of accumulated "bonus time" (seconds) for the Gang mechanic.

    "Bonus time" is accumulated when the game is offline or if the game is
    inactive in the browser.

    "Bonus time" makes the game progress faster, up to 10x the normal speed.

    :returns: Bonus time for the Gang mechanic in seconds

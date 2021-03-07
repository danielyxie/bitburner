getMemberInformation() Netscript Function
=========================================

.. js:function:: getMemberInformation(name)

    :param string name: Name of member

    Get stat and equipment-related information about a Gang Member

    :returns: An object with the gang member information.

    :RAM cost: 2 GB

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

getMemberInformation() Netscript Function
=========================================

.. js:function:: getMemberInformation(name)

    :RAM cost: 2 GB
    :param string name: Name of member
    :returns: An object with the gang member information.

    The object has the following structure::

        {
            name:          Name of this member.
            task:          Name of currently assigned task.
            earnedRespect: Total amount of respect earned by this member.

            hack:          Hacking stat
            str:           Strength stat
            def:           Defense stat
            dex:           Dexterity stat
            agi:           Agility stat
            cha:           Charisma stat

            hack_exp:      Hacking experience
            str_exp:       Strength experience
            def_exp:       Defense experience
            dex_exp:       Dexterity experience
            agi_exp:       Agility experience
            cha_exp:       Charisma experience

            hack_mult:     Hacking multiplier from equipment. Decimal form
            str_mult:      Strength multiplier from equipment. Decimal form
            def_mult:      Defense multiplier from equipment. Decimal form
            dex_mult:      Dexterity multiplier from equipment. Decimal form
            agi_mult:      Agility multiplier from equipment. Decimal form
            cha_mult:      Charisma multiplier from equipment. Decimal form

            hack_asc_mult: Hacking multiplier from ascension. Decimal form
            str_asc_mult:  Strength multiplier from ascension. Decimal form
            def_asc_mult:  Defense multiplier from ascension. Decimal form
            dex_asc_mult:  Dexterity multiplier from ascension. Decimal form
            agi_asc_mult:  Agility multiplier from ascension. Decimal form
            cha_asc_mult:  Charisma multiplier from ascension. Decimal form

            hack_asc_points: Hacking ascension points.
            str_asc_points:  Strength ascension points.
            def_asc_points:  Defense ascension points.
            dex_asc_points:  Dexterity ascension points.
            agi_asc_points:  Agility ascension points.
            cha_asc_points:  Charisma ascension points.

            upgrades:      Array of names of all owned Non-Augmentation Equipment
            augmentations: Array of names of all owned Augmentations
        }

    Get stat and equipment-related information about a Gang Member
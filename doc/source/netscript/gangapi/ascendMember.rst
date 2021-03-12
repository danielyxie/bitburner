ascendMember() Netscript Function
=================================

.. js:function:: ascendMember(name)

    :RAM cost: 4 GB
    :param string name: Name of member to ascend
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

    Ascend the specified Gang Member.
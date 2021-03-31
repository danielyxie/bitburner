getStats() Netscript Function
=============================

.. js:function:: getStats()

    .. warning:: This function is deprecated.

    :RAM cost: 0.5 GB

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to run this function.

    Returns an object with the Player's stats. The object has the following properties::

        {
            hacking
            strength
            defense
            dexterity
            agility
            charisma
            intelligence
        }

    Example::

        res = getStats();
        print('My charisma level is: ' + res.charisma);

    :RAM cost: 0.5 GB

getSleeveStats() Netscript Function
===================================

.. js:function:: getSleeveStats(sleeveNumber)

    :param int sleeveNumber: Index of the sleeve to get stats of. See :ref:`here <netscript_sleeveapi_referencingaduplicatesleeve>`

    Return a structure containing the stats of the sleeve

.. code-block:: javascript

    {
        shock: current shock of the sleeve [0-1],
        sync: current sync of the sleeve [0-1],
        hacking_skill: current hacking skill of the sleeve,
        strength: current strength of the sleeve,
        defense: current defense of the sleeve,
        dexterity: current dexterity of the sleeve,
        agility: current agility of the sleeve,
        charisma: current charisma of the sleeve,
    }

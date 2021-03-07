getSleevePurchasableAugs() Netscript Function
=============================================

.. js:function:: getSleevePurchasableAugs(sleeveNumber)

    :param int sleeveNumber: Index of the sleeve to retrieve purchasable augmentations from. See :ref:`here <netscript_sleeveapi_referencingaduplicatesleeve>`

    Return a list of augmentations that the player can buy for this sleeve.
    
    :RAM cost: 4 GB

.. code-block:: javascript

    [
        {
            name: string, // augmentation name
            cost: number, // augmentation cost
        }
    ]

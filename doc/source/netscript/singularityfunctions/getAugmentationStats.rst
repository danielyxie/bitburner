getAugmentationStats() Netscript Function
=========================================

.. js:function:: getAugmentationStats(name)

    :RAM cost: 5 GB

    :param string name: Name of Augmentation. CASE-SENSITIVE

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    Examples:

    .. code-block:: javascript

        ns.getAugmentationStats("Synfibril Muscle")
        {
           strength_mult: 1.3,
           defense_mult: 1.3,
        }

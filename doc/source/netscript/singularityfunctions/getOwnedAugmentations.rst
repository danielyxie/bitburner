getOwnedAugmentations() Netscript Function
==========================================

.. js:function:: getOwnedAugmentations(purchased=false)

    :RAM cost: 5 GB

    :param boolean purchase:
        Specifies whether the returned array should include Augmentations you have purchased but not yet installed.
        By default, this argument is false which means that the return value will NOT have the purchased Augmentations.

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function returns an array containing the names (as strings) of all Augmentations you have.

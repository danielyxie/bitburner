getAugmentationPrereq() Netscript Function
==========================================

.. js:function:: getAugmentationPrereq(augName)

    :RAM cost: 5 GB
    
    :param string augName: Name of Augmentation. CASE-SENSITIVE

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function returns an array with the names of the prerequisite Augmentation(s) for the specified Augmentation.
    If there are no prerequisites, a blank array is returned.

    If an invalid Augmentation name is passed in for the *augName* argument, this function will return a blank array.

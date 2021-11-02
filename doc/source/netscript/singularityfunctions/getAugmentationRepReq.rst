getAugmentationRepReq() Netscript Function
==========================================

.. js:function:: getAugmentationRepReq(augName)

    :RAM cost: 2.5 GB
    
    :param string augName: Name of Augmentation. CASE-SENSITIVE

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function returns the reputation requirement for the specified Augmentation.

    If an invalid Augmentation name is passed in for the *augName* argument, this function will throw a runtime error.

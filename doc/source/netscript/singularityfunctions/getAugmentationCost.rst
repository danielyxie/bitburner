getAugmentationCost() Netscript Function
========================================

.. js:function:: getAugmentationCost(augName)

    .. warning:: This function is deprecated. It still functions, but new
                 scripts should prefer :doc:`getAugmentationPrice<getAugmentationPrice>`
                 and :doc:`getAugmentationRepReq<getAugmentationRepReq>` instead.

    :RAM cost: 5 GB

    :param string augName: Name of Augmentation. CASE-SENSITIVE

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function returns an array with two elements that gives the cost for the specified Augmentation.
    The first element in the returned array is the reputation requirement of the Augmentation, and the second element is the money cost.

    If an invalid Augmentation name is passed in for the ``augName`` argument, this function will throw a runtime error.

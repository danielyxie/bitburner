getActionEstimatedSuccessChance() Netscript Function
====================================================

.. js:function:: getActionEstimatedSuccessChance(type, name)
    :RAM cost: 4 GB

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match

    Returns the estimated success chance for the specified action. This chance
    is returned as a decimal value, NOT a percentage (e.g. if you have an estimated
    success chance of 80%, then this function will return 0.80, NOT 80).

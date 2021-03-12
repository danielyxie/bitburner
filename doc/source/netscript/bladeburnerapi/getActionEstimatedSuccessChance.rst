getActionEstimatedSuccessChance() Netscript Function
====================================================

.. js:function:: getActionEstimatedSuccessChance(type, name)

    :RAM cost: 4 GB
    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :returns: Estimated success chance in decimal

    Example:

    .. code-block:: javascript

        bladeburner.getActionEstimatedSuccessChance("Contracts", "Tracking"); // returns: .3

getActionEstimatedSuccessChance() Netscript Function
====================================================

.. js:function:: getActionEstimatedSuccessChance(type, name)

    :RAM cost: 4 GB
    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :returns: Array of 2 number, lower and upper bound of the action chance.

    Example:

    .. code-block:: javascript

        bladeburner.getActionEstimatedSuccessChance("Contracts", "Tracking"); // returns: [.3, .6]

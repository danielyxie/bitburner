getActionMaxLevel() Netscript Function
======================================

.. js:function:: getActionMaxLevel(type, name)

    :RAM cost: 4 GB
    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :returns: Action max level, -1 for invalid actions.

    Example:

    .. code-block:: javascript

        bladeburner.getActionMaxLevel("Contracts", "Tracking"); // returns: 15

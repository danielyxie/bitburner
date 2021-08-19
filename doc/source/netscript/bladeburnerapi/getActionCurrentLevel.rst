getActionCurrentLevel() Netscript Function
==========================================

.. js:function:: getActionCurrentLevel(type, name)

    :RAM cost: 4 GB
    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match.
    :returns: Action current level, -1 for invalid actions.

    Example:

    .. code-block:: javascript

        bladeburner.getActionCurrentLevel("Contracts", "Tracking"); // returns: 9
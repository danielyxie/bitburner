getActionAutolevel() Netscript Function
=======================================

.. js:function:: getActionAutolevel(type, name)

    :RAM cost: 4 GB
    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :returns: ``true`` if this action is set to auto level.

    Examples:

    .. code-block:: javascript

        bladeburner.getActionAutolevel("Contracts", "Tracking"); // returns: true
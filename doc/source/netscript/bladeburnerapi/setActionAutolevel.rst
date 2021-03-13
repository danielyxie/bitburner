setActionAutolevel() Netscript Function
=======================================

.. js:function:: setActionAutolevel(type, name, autoLevel)

    :RAM cost: 4 GB
    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :param boolean autoLevel: Whether or not to autolevel this action

    Enable/disable autoleveling for the specified action.

    Example:

    .. code-block:: javascript

        bladeburner.setActionAutolevel("Contracts", "Tracking", true);

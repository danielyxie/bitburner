getActionTime() Netscript Function
==================================

.. js:function:: getActionTime(type, name)

    :RAM cost: 4 GB
    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :returns: Number of seconds it takes to complete the specified action.


    Example:

    .. code-block:: javascript

        bladeburner.getActionTime("Contracts", "Tracking"); // returns: 4

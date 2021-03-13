startAction() Netscript Function
================================

.. js:function:: startAction(type, name)

    :RAM cost: 4 GB
    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :returns: ``true`` if the action was started successfully.

    Attempts to start the specified Bladeburner action.

    Example:

    .. code-block:: javascript

        bladeburner.startAction("Contracts", "Tracking"); // returns: true
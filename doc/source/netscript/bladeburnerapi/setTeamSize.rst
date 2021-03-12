setTeamSize() Netscript Function
================================

.. js:function:: setTeamSize(type, name, size)

    :RAM cost: 4 GB
    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :param int size: Number of team members to set. Will be converted using Math.round()
    :returns: Team size or -1 for invalid actions.

    Set the team size for the specified Bladeburner action.

    Example:

    .. code-block:: javascript

        bladeburner.setTeamSize("Operations", "Investigation", 7);
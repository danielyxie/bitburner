getTeamSize() Netscript Function
================================

.. js:function:: getTeamSize(type, name)

    :RAM cost: 4 GB
    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :returns: Number of Bladeburner team members you have assigned to the
        specified action.

    Setting a team is only applicable for Operations and BlackOps. This function
    will return 0 for other action types.

    Example:

    .. code-block:: javascript

        bladeburner.getTeamSize("Operations", "Investigation"); // returns: 7
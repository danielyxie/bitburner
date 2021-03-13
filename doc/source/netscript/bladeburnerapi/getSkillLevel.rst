getSkillLevel() Netscript Function
==================================

.. js:function:: getSkillLevel(skillName)

    :RAM cost: 4 GB
    :param string skillName: Name of skill. Case-sensitive.
    :returns: Level of specified skill, -1 for invalid skills.

    Example:

    .. code-block:: javascript

        bladeburner.getSkillLevel("Overclock"); // returns: 90
getSkillUpgradeCost() Netscript Function
========================================

.. js:function:: getSkillUpgradeCost(skillName)

    :RAM cost: 4 GB
    :param string skillName: Name of skill. Case-sensitive and must be an exact match
    :returns: Amount of skill points needed to upgrade the specified skill. -1 for invalid skills.

    Example:

    .. code-block:: javascript

        bladeburner.getSkillUpgradeCost("Overclock"); // returns: 120

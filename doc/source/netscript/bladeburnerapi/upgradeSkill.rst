upgradeSkill() Netscript Function
=================================

.. js:function:: upgradeSkill(skillName)

    :RAM cost: 4 GB
    :param string skillName: Name of Skill to be upgraded. Case-sensitive and must be an exact match
    :returns: ``true`` if the skill is successfully upgraded.

    Attempts to upgrade the specified Bladeburner skill. 

    Example:

    .. code-block:: javascript

        bladeburner.upgradeSkill("Overclock"); // returns: true
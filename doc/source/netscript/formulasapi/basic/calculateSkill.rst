calculateSkill() Netscript Function
===================================

.. js:function:: calculateSkill(exp[, mult])

    :RAM cost: 0 GB
    :param number exp: ``exp`` to convert to skillLevel.
    :param number mult: Assume a specific skill multipler.
    :returns: skillLevel that ``exp`` would reach with that multiplier.

    You must have Source-File 5-1 in order to use this function.

    This function calculates the skillLevel that the given amount of ``exp`` would reach.

    Examples:

    .. code-block:: javascript

        skillLevel = formulas.basic.calculateSkill(1000);
        tprint("1000 exp would reach level " + skillLevel);

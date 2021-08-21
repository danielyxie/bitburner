calculateExp() Netscript Function
=================================

.. js:function:: calculateExp(skillLevel[, mult])

    :RAM cost: 0 GB
    :param number skillLevel: ``skillLevel`` to convert to exp.
    :param number mult: Assume a specific skill multipler (not exp multiplier).
    :returns: number of exp required to reach given ``skillLevel`` with that multiplier.

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to
    use this function.

    This function calculates the amount of experience needed to reach the given
    ``skillLevel``.

    Examples:

    .. code-block:: javascript

        var player = getPlayer();
        var nextHacking = player.hacking_skill+1;
        var nextExp = formulas.basic.calculateExp(nextHacking);
        var missingExp = nextExp - player.hacking_exp;
        tprint("Missing " + missingExp + " to reach next hacking level");

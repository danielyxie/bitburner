calculateExp() Netscript Function
=================================

.. js:function:: calculateExp(skillLevel[, mult])

    :RAM cost: 0 GB
    :param number skillLevel: ``skillLevel`` to convert to exp.
    :param number mult: Assume a specific skill multipler.
    :returns: number of exp required to reach given ``skillLevel`` with that multiplier.

    You must have Source-File 5-1 in order to use this function.

    This function calculates the amount of experience needed to reach level the given ``skillLevel``.

    Examples:

    .. code-block:: javascript

        nextHacking = getStats().hacking+1;
        nextExp = formulas.basic.calculateExp(nextHacking);
        missingExp = nextExp - getCharacterInformation().hackingExp;
        tprint("Missing " + missingExp + " to reach next hacking level");

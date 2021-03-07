getBitNodeMultipliers() Netscript Function
==========================================

.. js:function:: getBitNodeMultipliers()

    Returns an object containing the current BitNode multipliers. This function requires Source-File 5 in order
    to run. The multipliers are returned in decimal forms (e.g. 1.5 instead of 150%). The multipliers represent
    the difference between the current BitNode and the original BitNode (BitNode-1). For example, if the
    *CrimeMoney* multiplier has a value of 0.1, then that means that committing crimes in the current BitNode
    will only give 10% of the money you would have received in BitNode-1.

    The structure of the returned object is subject to change as BitNode multipliers get added to the game.
    Refer to the `source code here <https://github.com/danielyxie/bitburner/blob/master/src/BitNode/BitNodeMultipliers.ts>`_
    to see the name of the BitNode multipliers.

    Example::

        mults = getBitNodeMultipliers();
        print(mults.ServerMaxMoney);
        print(mults.HackExpGain);

    :RAM cost: 4 GB

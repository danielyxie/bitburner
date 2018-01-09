Netscript Advanced Functions
============================

These Netscript functions become relevant later on in the game. They are put on a separate page because
they contain spoilers for the game.

getBitNodeMultipliers
^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getBitNodeMultipliers()

    Returns an object containing the current BitNode multipliers. This function requires Source-File 5 in order
    to run. The multipliers are returned in integer forms (e.g. 1.5 instead of 150%). The multipliers represent
    the difference between the current BitNode and the original BitNode (BitNode-1). For example, if the
    *CrimeMoney* multiplier has a value of 0.1, then that means that committing crimes in the current BitNode
    will only give 10% of the money you would have received in BitNode-1. The object has the following structure,
    (subject to change in the future)::

        {
            ServerMaxMoney: 1,
            ServerStartingMoney: 1,
            ServerGrowthRate: 1,
            ServerWeakenRate: 1,
            ServerStartingSecurity: 1,
            ManualHackMoney: 1,
            ScriptHackMoney: 1,
            CompanyWorkMoney: 1,
            CrimeMoney: 1,
            HacknetNodeMoney: 1,
            CompanyWorkExpGain: 1,
            ClassGymExpGain: 1,
            FactionWorkExpGain: 1,
            HackExpGain: 1,
            CrimeExpGain: 1,
            FactionWorkRepGain: 1,
            FactionPassiveRepGain: 1,
            AugmentationRepCost: 1,
            AugmentationMoneyCost: 1,
        }

    Example::

        mults = getBitNodeMultipliers();
        print(mults.ServerMaxMoney);
        print(mults.HackExpGain);

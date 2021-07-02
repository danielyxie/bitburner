constants() Netscript Function
==============================

.. js:function:: constants()

    :RAM cost: 0 GB
    :returns: A structure with various constants related to hacknet nodes.

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to
    use this function.

    Returns an object with the following properties::

        {
            MoneyGainPerLevel: Multiplied by the node's level to get the node's base income
            BaseCost:          A multiplier used when buying new nodes or upgrading levels
            LevelBaseCost:     A multiplier used when upgrading levels
            RamBaseCost:       A multiplier used when upgrading RAM
            CoreBaseCost:      A multiplier used when buying additional cores
            PurchaseNextMult:  The root of an exponent used when buying new nodes
            UpgradeLevelMult:  The root of an exponent used when upgrading levels
            UpgradeRamMult:    The root of an exponent used when upgrading RAM
            UpgradeCoreMult:   The root of an exponent used when buying additional cores
            MaxLevel:          Maximum level a node can have
            MaxRam:            Maximum RAM a node can have
            MaxCores:          Maximum number of cores a node can have
        }

    Examples:

    .. code-block:: javascript

        tprint("Maximum RAM a hacknet node can have: "+formulas.hacknetNodes.constants().MaxRam+" GB.");

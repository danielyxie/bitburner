constants() Netscript Function
=============================================

.. js:function:: constants()

    :RAM cost: 0 GB
    :returns: A structure with various constants related to hacknet servers.

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to
    use this function. In addition, if you are not in BitNode-9, then you must
    have Source-File 9-1 in order to use this function.

    Returns an object with the following properties::

        {
            HashesPerLevel:   Multiplied by the server's level to get the server's base income
            BaseCost:         A multiplier used when buying new nodes or upgrading levels
            RamBaseCost:      A multiplier used when upgrading RAM
            CoreBaseCost:     A multiplier used when buying additional cores
            CacheBaseCost:    A multiplier used when upgrading cache
            PurchaseMult:     The root of an exponent used when buying new servers
            UpgradeLevelMult: The root of an exponent used when upgrading levels
            UpgradeRamMult:   The root of an exponent used when upgrading RAM
            UpgradeCoreMult:  The root of an exponent used when buying additional cores
            UpgradeCacheMult: The root of an exponent used when upgrading cache
            MaxServers:       Maximum number of hacknet servers you can own
            MaxLevel:         Maximum level a server can have
            MaxRam:           Maximum RAM a server can have
            MaxCores:         Maximum number of cores a server can have
            MaxCache:         Maximum cache a server can have
        }

    Examples:

    .. code-block:: javascript

        tprint("Maximum RAM a hacknet server can have: "+formulas.hacknetServers.constants().MaxRam+" GB");

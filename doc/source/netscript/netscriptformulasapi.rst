.. _netscriptformulas:

Netscript Formulas Functions
============================

.. warning:: This page contains spoilers for the game.

The formulas API allow you to gain insight into the inner workings of the game.
These functions will allow you to make more informed decision.

The formulas API is unlocked in BitNode-5. If you are in BitNode-5, you will
automatically gain access to this API. Otherwise, you must have Source-File 5-1
in order to use this API in other BitNodes. Additionally, some functions need
another source file level 1 to use.

All of these function cost 0 GB of ram to use.


basic formulas
--------------

These functions are under the ``formulas.basic.`` name space and available as
soon as you enter BitNode-5 or acquire Source-File 5-1.

.. toctree::
    calculateSkill() <formulasapi/basic/calculateSkill>
    calculateExp() <formulasapi/basic/calculateExp>
    growTime() <formulasapi/basic/growTime>
    hackTime() <formulasapi/basic/hackTime>
    weakenTime() <formulasapi/basic/weakenTime>
    growPercent() <formulasapi/basic/growPercent>
    hackPercent() <formulasapi/basic/hackPercent>
    hackChance() <formulasapi/basic/hackChance>
    hackExp() <formulasapi/basic/hackExp>


hacknetNodes formulas
---------------------

These functions are under the ``formulas.hacknetNodes.`` namespace and available as
soon as you enter BitNode-5 or acquire Source-File 5-1.

.. toctree::
    hacknetNodeCost() <formulasapi/hacknetNodes/hacknetNodeCost>
    moneyGainRate() <formulasapi/hacknetNodes/moneyGainRate>
    levelUpgradeCost() <formulasapi/hacknetNodes/levelUpgradeCost>
    ramUpgradeCost() <formulasapi/hacknetNodes/ramUpgradeCost>
    coreUpgradeCost() <formulasapi/hacknetNodes/coreUpgradeCost>
    constants() <formulasapi/hacknetNodes/constants>

hacknetServers formulas
-----------------------

These functions are under the ``formulas.hacknetServers.`` namespace.
These functions require either being in BitNode-5 or having Source-File 5-1, and
also require either being in BitNode-9 or having Source-File 9-1 to be invoked.

.. toctree::
    hacknetServerCost() <formulasapi/hacknetServers/hacknetServerCost>
    hashGainRate() <formulasapi/hacknetServers/hashGainRate>
    levelUpgradeCost() <formulasapi/hacknetServers/levelUpgradeCost>
    ramUpgradeCost() <formulasapi/hacknetServers/ramUpgradeCost>
    coreUpgradeCost() <formulasapi/hacknetServers/coreUpgradeCost>
    cacheUpgradeCost() <formulasapi/hacknetServers/cacheUpgradeCost>
    hashUpgradeCost() <formulasapi/hacknetServers/hashUpgradeCost>
    constants() <formulasapi/hacknetServers/constants>

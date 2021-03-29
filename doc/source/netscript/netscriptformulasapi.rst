.. _netscriptformulas:

Netscript Formulas Functions
============================

.. warning:: This page contains spoilers for the game.

The formulas API allow you to gain insight into the inner workings of the game.
These functions will allow you to make more informed decision.

All of these function cost 0 GB of ram to use. All these function require
Source-File 5-1 but some additionally need another source file level 1 to use.


basic formulas
--------------

These functions are under the ``formulas.basic.`` name space and available as
soon as you acquire Source-File 5-1

.. toctree::
    calculateSkill() <formulasapi/basic/calculateSkill>
    calculateExp() <formulasapi/basic/calculateExp>


hacknetNodes formulas
---------------------

These functions are under the ``formulas.hacknetNodes.`` namespace and available as
soon as you acquire Source-File 5-1.

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
These functions require Source-File 5-1 and Source-File 9-1 to be invoked.

.. toctree::
    hacknetServerCost() <formulasapi/hacknetServers/hacknetServerCost>
    hashGainRate() <formulasapi/hacknetServers/hashGainRate>
    levelUpgradeCost() <formulasapi/hacknetServers/levelUpgradeCost>
    ramUpgradeCost() <formulasapi/hacknetServers/ramUpgradeCost>
    coreUpgradeCost() <formulasapi/hacknetServers/coreUpgradeCost>
    cacheUpgradeCost() <formulasapi/hacknetServers/cacheUpgradeCost>
    hashUpgradeCost() <formulasapi/hacknetServers/hashUpgradeCost>
    constants() <formulasapi/hacknetServers/constants>
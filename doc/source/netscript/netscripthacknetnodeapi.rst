.. _netscript_hacknetnodeapi:

Netscript Hacknet Node API
==========================

.. warning:: Not all functions in the Hacknet Node API are immediately available.
             For this reason, the documentation for this API may contains spoilers
             for the game.

Netscript provides the following API for accessing and upgrading your Hacknet Nodes
through scripts.

Note that none of these functions will write to the script's logs. If you want
to see what your script is doing you will have to print to the logs yourself.

**Hacknet Node API functions must be accessed through the hacknet namespace**

In Netscript 1.0::

    hacknet.purchaseNode();
    hacknet.getNodeStats(3).level;

In :ref:`netscriptjs`::

    ns.hacknet.purchaseNode();
    ns.hacknet.getNodeStats(3).level;

.. toctree::
    :caption: Hacknet Nodes API Functions:

    numNodes() <hacknetnodeapi/numNodes>
    maxNumNodes() <hacknetnodeapi/maxNumNodes>
    purchaseNode() <hacknetnodeapi/purchaseNode>
    getPurchaseNodeCost() <hacknetnodeapi/getPurchaseNodeCost>
    getNodeStats() <hacknetnodeapi/getNodeStats>
    upgradeLevel() <hacknetnodeapi/upgradeLevel>
    upgradeRam() <hacknetnodeapi/upgradeRam>
    upgradeCore() <hacknetnodeapi/upgradeCore>
    getLevelUpgradeCost() <hacknetnodeapi/getLevelUpgradeCost>
    getRamUpgradeCost() <hacknetnodeapi/getRamUpgradeCost>
    getCoreUpgradeCost() <hacknetnodeapi/getCoreUpgradeCost>

.. toctree::
    :caption: Hacknet Servers API Functions:

    upgradeCache() <hacknetnodeapi/upgradeCache>
    getCacheUpgradeCost() <hacknetnodeapi/getCacheUpgradeCost>
    numHashes() <hacknetnodeapi/numHashes>
    hashCapacity() <hacknetnodeapi/hashCapacity>
    hashCost() <hacknetnodeapi/hashCost>
    spendHashes() <hacknetnodeapi/spendHashes>
    getHashUpgradeLevel() <hacknetnodeapi/getHashUpgradeLevel>
    getTrainingMult() <hacknetnodeapi/getTrainingMult>
    getStudyMult() <hacknetnodeapi/getStudyMult>

.. _netscript_hacknetnodeapi_referencingahacknetnode:

Referencing a Hacknet Node
--------------------------
Most of the functions in the Hacknet Node API perform an operation on a single
Node. Therefore, a numeric index is used to identify and specify which Hacknet
Node a function should act on. This index number corresponds to the number
at the end of the name of the Hacknet Node. For example, the first Hacknet Node you
purchase will have the name "hacknet-node-0" and is referenced using index 0.
The fifth Hacknet Node you purchase will have the name "hacknet-node-4" and is
referenced using index 4.

RAM Cost
--------
Accessing the `hacknet` namespace incurs a one time cost of 4 GB of RAM.
In other words, using multiple Hacknet Node API functions in a script will not cost
more than 4 GB of RAM.

Utilities
---------
The following functions are not officially part of the Hacknet Node API, but they
can be useful when writing Hacknet Node-related scripts. Since they are not part
of the API, they do not need to be accessed using the *hacknet* namespace.

* :js:func:`getHacknetMultipliers`

Example(s)
----------

The following is an example of one way a script can be used to automate the
purchasing and upgrading of Hacknet Nodes.

This script attempts to purchase Hacknet Nodes until the player has a total of 8. Then
it gradually upgrades those Node's to a minimum of level 140, 64 GB RAM, and 8 cores

.. code:: javascript

    function myMoney() {
        return getServerMoneyAvailable("home");
    }

    disableLog("getServerMoneyAvailable");
    disableLog("sleep");

    var cnt = 8;

    while(hacknet.numNodes() < cnt) {
        res = hacknet.purchaseNode();
        print("Purchased hacknet Node with index " + res);
    };

    for (var i = 0; i < cnt; i++) {
        while (hacknet.getNodeStats(i).level <= 80) {
            var cost = hacknet.getLevelUpgradeCost(i, 10);
            while (myMoney() < cost) {
                print("Need $" + cost + " . Have $" + myMoney());
                sleep(3000);
            }
            res = hacknet.upgradeLevel(i, 10);
        };
    };

    print("All nodes upgraded to level 80");

    for (var i = 0; i < cnt; i++) {
        while (hacknet.getNodeStats(i).ram < 16) {
            var cost = hacknet.getRamUpgradeCost(i, 2);
            while (myMoney() < cost) {
                print("Need $" + cost + " . Have $" + myMoney());
                sleep(3000);
            }
            res = hacknet.upgradeRam(i, 2);
        };
    };

    print("All nodes upgraded to 16GB RAM");

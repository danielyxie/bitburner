.. _netscripthacknetnodeapi:

Netscript Hacknet Node API
==========================

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

numNodes
--------
.. js:function:: numNodes()

    Returns the number of Hacknet Nodes you own.

purchaseNode
------------
.. js:function:: purchaseNode()

    Purchases a new Hacknet Node. Returns a number with the index of the Hacknet Node.
    This index is equivalent to the number at the end of the Hacknet Node's name
    (e.g The Hacknet Node named 'hacknet-node-4' will have an index of 4).

    If the player cannot afford to purchase a new Hacknet Node then the function
    will return -1.

getPurchaseNodeCost
-------------------
.. js:function:: getPurchaseNodeCost()

    Returns the cost of purchasing a new Hacknet Node

getNodeStats
------------
.. js:function:: getNodeStats(i)

    :param number i: Index/Identifier of Hacknet Node

    Returns an object containing a variety of stats about the specified Hacknet Node::

        {
            name:               Node's name ("hacknet-node-5"),
            level:              Node's level,
            ram:                Node's RAM,
            cores:              Node's number of cores,
            production:         Node's money earned per second,
            timeOnline:         Number of seconds since Node has been purchased,
            totalProduction:    Total number of money Node has produced
        }

upgradeLevel
------------
.. js:function:: upgradeLevel(i, n)

    :param number i: Index/Identifier of Hacknet Node
    :param number n: Number of levels to purchase. Must be positive. Rounded to nearest integer

    Tries to upgrade the level of the specified Hacknet Node by *n*.

    Returns true if the Hacknet Node's level is successfully upgraded by *n* or
    if it is upgraded by some positive amount and the Node reaches its max level.

    Returns false otherwise.

upgradeRam
----------
.. js:function:: upgradeRam(i, n)

    :param number i: Index/Identifier of Hacknet Node
    :param number n: Number of times to upgrade RAM. Must be positive. Rounded to nearest integer

    Tries to upgrade the specified Hacknet Node's RAM *n* times. Note that each upgrade
    doubles the Node's RAM. So this is equivalent to multiplying the Node's RAM by
    2 :sup:`n`.

    Returns true if the Hacknet Node's RAM is successfully upgraded *n* times or if
    it is upgraded some positive number of times and the Node reaches it max RAM.

    Returns false otherwise.

upgradeCore
-----------
.. js:function:: upgradeCore(i, n)

    :param number i: Index/Identifier of Hacknet Node
    :param number n: Number of cores to purchase. Must be positive. Rounded to nearest integer

    Tries to purchase *n* cores for the specified Hacknet Node.

    Returns true if it successfully purchases *n* cores for the Hacknet Node or if
    it purchases some positive amount and the Node reaches its max number of cores.

    Returns false otherwise.

getLevelUpgradeCost
-------------------
.. js:function:: getLevelUpgradeCost(i, n)

    :param number i: Index/Identifier of Hacknet Node
    :param number n: Number of levels to upgrade. Must be positive. Rounded to nearest integer

    Returns the cost of upgrading the specified Hacknet Node by *n* levels.

    If an invalid value for *n* is provided, then this function returns 0. If the
    specified Hacknet Node is already at max level, then Infinity is returned.

getRamUpgradeCost
-----------------
.. js:function:: getRamUpgradeCost(i, n)

    :param number i: Index/Identifier of Hacknet Node
    :param number n: Number of times to upgrade RAM. Must be positive. Rounded to nearest integer

    Returns the cost of upgrading the RAM of the specified Hacknet Node *n* times.

    If an invalid value for *n* is provided, then this function returns 0. If the
    specified Hacknet Node is already at max RAM, then Infinity is returned.

getCoreUpgradeCost
------------------
.. js:function:: getCoreUpgradeCost(i, n)

    :param number i: Index/Identifier of Hacknet Node
    :param number n: Number of times to upgrade cores. Must be positive. Rounded to nearest integer

    Returns the cost of upgrading the number of cores of the specified Hacknet Node by *n*.

    If an invalid value for *n* is provided, then this function returns 0. If the
    specified Hacknet Node is already at the max number of cores, then Infinity is returned.

Utilities
---------
The following functions are not officially part of the Hacknet Node API, but they
can be useful when writing Hacknet Node-related scripts. Since they are not part
of the API, they do not need to be accessed using the *hacknet* namespace.

.. js:function:: getHacknetMultipliers()

    Returns an object containing the Player's hacknet related multipliers. These multipliers are
    returned in integer forms, not percentages (e.g. 1.5 instead of 150%). The object has the following structure::

        {
            production: Player's hacknet production multiplier,
            purchaseCost: Player's hacknet purchase cost multiplier,
            ramCost: Player's hacknet ram cost multiplier,
            coreCost: Player's hacknet core cost multiplier,
            levelCost: Player's hacknet level cost multiplier
        }

    Example of how this can be used::

        mults = getHacknetMultipliers();
        print(mults.production);
        print(mults.purchaseCost);


Example(s)
^^^^^^^^^^

The following is an example of one way a script can be used to automate the
purchasing and upgrading of Hacknet Nodes.

This script attempts to purchase Hacknet Nodes until the player has a total of 8. Then
it gradually upgrades those Node's to a minimum of level 140, 64 GB RAM, and 8 cores::

    function myMoney() {
        return getServerMoneyAvailable("home");
    }
    disableLog("getServerMoneyAvailable");
    disableLog("sleep");

    cnt = 8;

    while(hacknet.numNodes() < cnt) {
        res = hacknet.purchaseNode();
        print("Purchased hacknet Node with index " + res);
    };

    for (i = 0; i < cnt; i++) {
        while (hacknet.getNodeStats(i).level <= 80) {
            var cost = hacknet.getLevelUpgradeCost(i, 10);
            while (myMoney() < cost) {
                print("Need $" + cost + " . Have $" + myMoney());
                sleep(3000);
            }
            res = hacknet.upgradeLevel(i, 10);
        };
    };

    print("All nodes upgrade to level 80");

    for (i = 0; i < cnt; i++) {
        while (hacknet.getNodeStats(i).ram < 16) {
            var cost = hacknet.getRamUpgradeCost(i, 2);
            while (myMoney() < cost) {
                print("Need $" + cost + " . Have $" + myMoney());
                sleep(3000);
            }
            res = hacknet.upgradeRam(i, 2);
        };
    };

    print("All nodes upgrade to 16GB RAM");

    for (i = 0; i < cnt; i++) {
        while (hacknet.getNodeStats(i).level <= 140) {
            var cost = hacknet.getLevelUpgradeCost(i, 5);
            while (myMoney() < cost) {
                print("Need $" + cost + " . Have $" + myMoney());
                sleep(3000);
            }
            res = hacknet.upgradeLevel(i, 5);
        };
    };

    print("All nodes upgrade to level 140");

    for (i = 0; i < cnt; i++) {
        while (hacknet.getNodeStats(i).ram < 64) {
            var cost = hacknet.getRamUpgradeCost(i, 2);
            while (myMoney() < cost) {
                print("Need $" + cost + " . Have $" + myMoney());
                sleep(3000);
            }
            res = hacknet.upgradeRam(i, 2);
        };
    };

    print("All nodes upgrade to 64GB RAM (MAX)");

    for (i = 0; i < cnt; i++) {
        while (hacknetnodes.getNodeStatsi(i).cores < 8) {
            var cost = hacknet.getCoreUpgradeCost(7);
            while (myMoney() < cost) {
                print("Need $" + cost + " . Have $" + myMoney());
                sleep(3000);
            }
            res = hacknet.upgradeCore(i, 7);
        };
    };

    print("All nodes upgrade to 8 cores");

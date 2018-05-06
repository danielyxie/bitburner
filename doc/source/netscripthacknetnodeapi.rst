Netscript Hacknet Node API
==========================

Netscript provides the following API for accessing and upgrading your Hacknet Nodes
through scripts.

Note that none of these functions will write to the script's logs. If you want
to see what your script is doing you will have to print to the logs yourself.

hacknetnodes
^^^^^^^^^^^^

    *hacknetnodes* is a special variable. It is an array that maps to the player's
    Hacknet Nodes. The Hacknet Nodes are accessed through indexed. These indexes
    correspond to the number at the end of the name of the Hacknet Node. For example,
    the first Hacknet Node you purchase will have the name "hacknet-node-0" and can be
    accessed using *hacknetnodes[0]*. The fourth Hacknet Node you purchase will have the name
    "hacknet-node-3" and can be accessed using *hacknetnodes[3]*.

Hacknet Node Member Variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The following is a list of member variables for a Hacknet Node object. These variables are read-only, which means you cannot assign
a value to these.

Note that these must be called on an element inside the *hacknetnodes* array, not the array itself.

.. js:attribute:: hacknetnodes[i].level

    Returns the level of the corresponding Hacknet Node

.. js:attribute:: hacknetnodes[i].ram

    Returns the amount of RAM on the corresponding Hacknet Node

.. js:attribute:: hacknetnodes[i].cores

    Returns the number of cores on the corresponding Hacknet Node

.. js:attribute:: hacknetnodes[i].totalMoneyGenerated

    Returns the total amount of money that the corresponding Hacknet Node has earned

.. js:attribute:: hacknetnodes[i].onlineTimeSeconds

    Returns the total amount of time (in seconds) that the corresponding Hacknet Node has existed

.. js:attribute:: hacknetnodes[i].moneyGainRatePerSecond

    Returns the amount of income that the corresponding Hacknet Node earns

Hacknet Node Methods
^^^^^^^^^^^^^^^^^^^^

The following is a list of supported functions/methods for a Hacknet Node object.

Note that these must be called on an element inside the *hacknetnodes* array, not the
array itself.

.. js:method:: hacknetnodes[i].upgradeLevel(n)

    :param number n: Number of levels to upgrade. Must be positive. Rounded to nearest integer

    Tries to upgrade the level of the corresponding Hacknet Node *n* times. Returns true if the
    Hacknet Node's level is successfully upgraded *n* times or up to the max level (200), and false
    otherwise.

.. js:method:: hacknetnodes[i].upgradeRam()

    Tries to upgrade the amount of RAM on the corresponding Hacknet Node. Returns true if the RAM is
    successfully upgraded and false otherwise.

.. js:method:: hacknetnodes[i].upgradeCore()

    Tries to purchase an additional core for the corresponding Hacknet Node. Returns true if the
    additional core is successfully purchased, and false otherwise.

.. js:method:: hacknetnodes[i].getLevelUpgradeCost(n)

    :param number n: Number of levels to upgrade. Must be positive. Rounded to nearest integer

    Returns the cost of upgrading the specified Hacknet Node by *n* levels

.. js:method:: hacknetnodes[i].getRamUpgradeCost()

    Returns the cost of upgrading the RAM of the specified Hacknet Node. Upgrading a Node's RAM doubles it.

.. js:method:: hacknetnodes[i].getCoreUpgradeCost()

    Returns the cost of upgrading the number of cores of the specified Hacknet Node. Upgrading a Node's
    number of cores adds one additional core.

Utils
^^^^^

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

The following is an example of one way a script can be used to automate the purchasing and upgrading of Hacknet Nodes.
This script purchases new Hacknet Nodes until the player has four. Then, it iteratively upgrades each of those four Hacknet
Nodes to a level of at least 75, RAM to at least 8GB, and number of cores to at least 2::

    //Purchase 4 Hacknet Nodes
    while(hacknetnodes.length < 4) {
        purchaseHacknetNode();
    }

    //Upgrade all 4 Hacknet Nodes to at least level 75
    for (i = 0; i < 4; i = i++) {
        while (hacknetnodes[i].level <= 75) {
            hacknetnodes[i].upgradeLevel(5);
            sleep(10000);
        }
    }

    //Upgrade RAM on all Hacknet Nodes to 8GB
    for (i = 0; i < 4; i = i++) {
        while (hacknetnodes[i].ram < 8) {
            hacknetnodes[i].upgradeRam();
            sleep(10000);
        }
    }

    //Upgrade cores on all Hacknet Nodes to 2
    for (i = 0; i < 4; i = i++) {
        while (hacknetnodes[i].cores < 2) {
            hacknetnodes[i].upgradeCore();
            sleep(10000);
        }
    }

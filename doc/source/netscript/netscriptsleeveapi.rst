.. _netscript_sleeveapi:

Netscript Sleeve API
=========================
Netscript provides the following API for interacting with the game's
:ref:`Duplicate Sleeve <gameplay_duplicatesleeves>` mechanic.

The Sleeve API is **not** immediately available to the player and must be unlocked
later in the game.

.. warning:: This page contains spoilers for the game

The Sleeve API is unlocked in BitNode-10. If you are in BitNode-10, you will
automatically gain access to this API. Otherwise, you must have Source-File 10 in
order to use this API in other BitNodes

**Sleeve API functions must be accessed through the 'sleeve' namespace**

In :ref:`netscript1`::

    sleeve.synchronize(0);
    sleeve.commitCrime(0, "shoplift");

In :ref:`netscriptjs`::

    ns.sleeve.synchronize(0);
    ns.sleeve.commitCrime(0, "shoplift");

.. toctree::
    :caption: API Functions:

    getNumSleeves() <sleeveapi/getNumSleeves>
    getSleeveStats() <sleeveapi/getSleeveStats>
    getInformation() <sleeveapi/getInformation>
    getTask() <sleeveapi/getTask>
    setToShockRecovery() <sleeveapi/setToShockRecovery>
    setToSynchronize() <sleeveapi/setToSynchronize>
    setToCommitCrime() <sleeveapi/setToCommitCrime>
    setToFactionWork() <sleeveapi/setToFactionWork>
    setToCompanyWork() <sleeveapi/setToCompanyWork>
    setToUniversityCourse() <sleeveapi/setToUniversityCourse>
    setToGymWorkout() <sleeveapi/setToGymWorkout>
    travel() <sleeveapi/travel>
    getSleeveAugmentations() <sleeveapi/getSleeveAugmentations>
    getSleevePurchasableAugs() <sleeveapi/getSleevePurchasableAugs>
    purchaseSleeveAug() <sleeveapi/purchaseSleeveAug>

.. _netscript_sleeveapi_referencingaduplicatesleeve:

Referencing a Duplicate Sleeve
------------------------------
Most of the functions in the Sleeve API perform an operation on a single Duplicate
Sleeve. In order to specify which Sleeve the operation should be performed on,
a numeric index is used as an identifier. The index should follow array-notation, such
that the first Duplicate Sleeve has an index of 0, the second Duplicate Sleeve has
an index of 1, and so on.

The order of the Duplicate Sleeves matches the order on the UI page.

Examples
--------

**Basic example usage**::

    for (var i = 0; i < sleeve.getNumSleeves(); i++) {
        sleeve.setToShockRecovery(i);
    }

    sleep(10 * 60 * 60); // wait 10h

    for (var i = 0; i < sleeve.getNumSleeves(); i++) {
        sleeve.setToSynchronize(i);
    }

    sleep(10*60*60); // wait 10h

    for (var i = 0; i < sleeve.getNumSleeves(); i++) {
        sleeve.setToCommitCrime(i, 'shoplift');
    }

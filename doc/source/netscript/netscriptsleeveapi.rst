.. _netscript_sleeveapi:

Netscript Sleeve API
=========================
Netscript provides the following API for interacting with the game's Sleeve mechanic.

The Sleeve API is **not** immediately available to the player and must be unlocked
later in the game.

**WARNING: This page contains spoilers for the game**

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
    :caption: Functions:

    commitCrime() <sleeveapi/commitCrime>
    getNumSleeves() <sleeveapi/getNumSleeves>
    getTask() <sleeveapi/getTask>
    synchronize() <sleeveapi/synchronize>
    travel() <sleeveapi/travel>
    workForFaction() <sleeveapi/workForFaction>
    getInformation() <sleeveapi/getInformation>
    getStats() <sleeveapi/getStats>
    shockRecovery() <sleeveapi/shockRecovery>
    takeUniversityCourse() <sleeveapi/takeUniversityCourse>
    workForCompany() <sleeveapi/workForCompany>
    workoutAtGym() <sleeveapi/workoutAtGym>


Examples
--------

**Basic example usage**::

    for(let i = 0; i < sleeve.getNumSleeves(); i++) {
        sleeve.shockRecovery(i);
    }

    await sleep(10*60*60); // wait 10h

    for(let i = 0; i < sleeve.getNumSleeves(); i++) {
        sleeve.synchronize(i);
    }

    await sleep(10*60*60); // wait 10h

    for(let i = 0; i < sleeve.getNumSleeves(); i++) {
        sleeve.commitCrime(i, 'shoplift');
    }


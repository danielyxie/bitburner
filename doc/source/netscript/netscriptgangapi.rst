Netscript Gang API
==================

Netscript provides the following API for interacting with the game's Gang mechanic.

The Gang API is **not** immediately available to the player and must be unlocked
later in the game

**WARNING: This page contains spoilers for the game**

The Gang API is unlocked in BitNode-2. Currently, BitNode-2 is the only location
where the Gang mechanic is accessible. This may change in the future

**Gang API functions must be accessed through the 'gang' namespace**

In :ref:`netscript1`::

    gang.getMemberNames();
    gang.recruitMember("Fry");

In :ref:`netscriptjs`::

    ns.gang.getMemberNames();
    ns.gang.recruitMember("Fry");

.. toctree::
    :caption: API Functions:

    getMemberNames() <gangapi/getMemberNames>
    getGangInformation() <gangapi/getGangInformation>
    getOtherGangInformation() <gangapi/getOtherGangInformation>
    getMemberInformation() <gangapi/getMemberInformation>
    canRecruitMember() <gangapi/canRecruitMember>
    recruitMember() <gangapi/recruitMember>
    getTaskNames() <gangapi/getTaskNames>
    setMemberTask() <gangapi/setMemberTask>
    getEquipmentNames() <gangapi/getEquipmentNames>
    getEquipmentCost() <gangapi/getEquipmentCost>
    getEquipmentType() <gangapi/getEquipmentType>
    purchaseEquipment() <gangapi/purchaseEquipment>
    ascendMember() <gangapi/ascendMember>
    setTerritoryWarfare() <gangapi/setTerritoryWarfare>
    getChanceToWinClash() <gangapi/getChanceToWinClash>
    getBonusTime() <gangapi/getBonusTime>

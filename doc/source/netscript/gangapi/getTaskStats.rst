getTaskStats() Netscript Function
======================================

.. js:function:: getTaskStats(taskName)

    :RAM cost: 1 GB

    :param string name: Name of the task.

    Get the stats of a gang member stats. This is typically used to evaluate
    which action should be executed next.

    {
        name: Terrorism,
        desc: "Assign this gang member to commit acts of terrorism

        Greatly increases respect - Greatly increases wanted level - Scales heavily with territory",
        isHacking: false,
        isCombat: true,
        baseRespect: 0.01,
        baseWanted: 6,
        baseMoney: 0,
        hackWeight: 20,
        strWeight: 20,
        defWeight: 20,
        dexWeight: 20,
        agiWeight: 0,
        chaWeight: 20,
        difficulty: 36,
        territory: {
            money: 1,
            respect: 2,
            wanted: 2
        }
    }

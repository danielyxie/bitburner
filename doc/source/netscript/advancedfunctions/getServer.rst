getServer() Netscript Function
==========================================

.. js:function:: getServer()

    :RAM cost: 4 GB

    If you are not in BitNode-5, then you must have Source-File 5-1 in order to run this function.

    This function is meant to be used in conjunction with the :doc:`formulas API<../netscriptformulasapi>`.

    Returns an object with the Server's stats. The object has the following properties::

        {
            cpuCores
            ftpPortOpen
            hasAdminRights
            hostname
            httpPortOpen
            ip
            isConnectedTo
            maxRam
            organizationName
            ramUsed
            smtpPortOpen
            sqlPortOpen
            sshPortOpen
            baseDifficulty
            hackDifficulty
            manuallyHacked
            minDifficulty
            moneyAvailable
            moneyMax
            numOpenPortsRequired
            openPortCount
            purchasedByPlayer
            requiredHackingSkill
            serverGrowth
        }

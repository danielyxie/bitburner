workForFaction() Netscript Function
===================================

.. js:function:: workForFaction(factionName, workType)
    :RAM cost: 3 GB

    :param string factionName: Name of faction to work for. CASE-SENSITIVE
    :param string workType:
        Type of work to perform for the faction:

        * hacking/hacking contracts/hackingcontracts
        * field/fieldwork/field work
        * security/securitywork/security work

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function will automatically set you to start working for the specified faction.
    Obviously, you must be a member of the faction or else this function will fail. If you are already in
    the middle of some "working" action (such as working for a company, training at a gym, or creating a program),
    then running this function will automatically cancel that action and give you your earnings.

    This function will return true if you successfully start working for the specified faction, and false otherwise.

    Note that when you are working for a faction, you will not actually receive your earnings (reputation, experience)
    until you FINISH the action. This can be an issue if, for example, you only want to work until you get 100,000 faction
    reputation. One small hack to get around this is to continuously restart the action to receive your earnings::

        while (getFactionRep(FACTION NAME) < VALUE) {
            workForFaction(FACNAME, WORKTYPE);
            sleep(60000);
        }

    This way, your faction reputation will be updated every minute.

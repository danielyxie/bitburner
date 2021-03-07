workForCompany() Netscript Function
===================================

.. js:function:: workForCompany(companyName=lastCompany)
    :RAM cost: 3 GB

    :param string companyName: Name of company to work for. Must be an exact match.
                               Optional. If not specified, this argument defaults to
                               the last job that you worked

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function will automatically set you to start working at the company at which you are employed.
    If you are already in the middle of some "working" action (such as working for a faction, training at
    a gym, or creating a program), then running this function will automatically cancel that action and give you your earnings.

    This function will return true if the player starts working, and false otherwise.

    Note that when you are working for a company, you will not actually receive your earnings
    (reputation, money, experience) until you FINISH the action. This can be an issue if, for example,
    you only want to work until you get 100,000 company reputation. One small hack to get around this is to
    continuously restart the action to receive your earnings::

        while (getCompanyRep(COMPANY HERE) < VALUE) {
            workForCompany();
            sleep(60000);
        }

    This way, your company reputation will be updated every minute.

applyToCompany() Netscript Function
===================================

.. js:function:: applyToCompany(companyName, field)

    :param string companyName: Name of company to apply to. CASE-SENSITIVE.
    :param string field:
        Field to which you want to apply. Not case-sensitive

        * software
        * software consultant
        * it
        * security engineer
        * network engineer
        * business
        * business consultant
        * security
        * agent
        * employee
        * part-time employee
        * waiter
        * part-time waiter

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function will automatically try to apply to the specified company for a position in the specified
    field. This function can also be used to apply for promotions by specifying the company and field you
    are already employed at.

    This function will return true if you successfully get a job/promotion, and false otherwise. Note that
    if you are trying to use this function to apply for a promotion and you don't get one, it will return false.

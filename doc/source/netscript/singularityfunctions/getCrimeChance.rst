getCrimeChance() Netscript Function
===================================

.. js:function:: getCrimeChance(crime)
    :RAM cost: 5 GB

    :param string crime:
        Name of crime. Not case-sensitive. This argument is fairlyn lenient in terms of what inputs it accepts.
        Check the documentation for the *commitCrime()* function for a list of example inputs.

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function returns your chance of success at commiting the specified crime. The chance is returned as a decimal (i.e. 60% would be returned as 0.6).

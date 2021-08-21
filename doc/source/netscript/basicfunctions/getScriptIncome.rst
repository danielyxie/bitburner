getScriptIncome() Netscript Function
====================================

.. js:function:: getScriptIncome([scriptname[, hostname/ip[, [args...]]])

    :RAM cost: 0.1 GB
    :param string scriptname: Filename of script
    :param string hostname/ip: Server on which script is running
    :param args...: Arguments that the script is running with
    :returns: Amount of income the specified script generates while online.

    If called with no arguments this function will return an array of two
    values. The first value is the total income ($ / second) of all of your
    active scripts (scripts that are currently running on any server). The
    second value is the total income ($ / second) that you've earned from
    scripts since you last installed Augmentations.

    .. note:: A script is uniquely identified by both its name and its
        arguments.

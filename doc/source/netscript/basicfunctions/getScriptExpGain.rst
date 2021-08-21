getScriptExpGain() Netscript Function
=====================================

.. js:function:: getScriptExpGain([scriptname[, hostname[, args...]]])

    :RAM cost: 0.1 GB
    :param string scriptname: Filename of script.
    :param string hostname: Server on which script is running.
    :param args...: Arguments that the script is running with.
    :returns: The amount of hacking experience the specified script generates
        while online.

    This function can also return the total experience gain rate of all of your
    active scripts by running the function with no arguments.

    .. note:: A script is uniquely identified by both its name and its
        arguments.

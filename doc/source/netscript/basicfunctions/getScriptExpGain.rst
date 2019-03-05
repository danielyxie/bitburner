getScriptExpGain() Netscript Function
=====================================

.. js:function:: getScriptExpGain([scriptname], [hostname/ip], [args...])

    :param string scriptname: Filename of script
    :param string hostname/ip: Server on which script is running
    :param args...: Arguments that the script is running with
    :RAM cost: 0.1 GB

    Returns the amount of hacking experience the specified script generates while online (when the game is open, does not apply for offline experience gains).
    Remember that a script is uniquely identified by both its name and its arguments.

    This function can also return the total experience gain rate of all of your active scripts by running the function with no arguments.

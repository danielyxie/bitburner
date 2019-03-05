getScriptLogs() Netscript Function
==================================

.. js:function:: getScriptLogs([fn], [hostname/ip=current ip], [args...])

    :param string fn: Optional. Filename of script to get logs from.
    :param string ip: Optional. IP or hostname of the server that the script is on
    :param args...: Arguments to identify which scripts to get logs for
    :RAM cost: 0 GB

    Returns a script's logs. The logs are returned as an array, where each
    line is an element in the array. The most recently logged line is at the
    end of the array.

    Note that there is a maximum number of lines that a script stores in its logs.
    This is configurable in the game's options.

    If the function is called with no arguments, it will return the current script's logs.

    Otherwise, the `fn`, `hostname/ip,` and `args...` arguments can be used to get the logs
    from another script. Remember that scripts are uniquely identified by both
    their names and arguments.

    Examples::

        // Get logs from foo.script on the current server that was run with no args
        getScriptLogs("foo.script");

        // Get logs from foo.script on the foodnstuff server that was run with no args
        getScriptLogs("foo.script", "foodnstuff");

        // Get logs from foo.script on the foodnstuff server that was run with the arguments [1, "test"]
        getScriptLogs("foo.script", "foodnstuff", 1, "test");

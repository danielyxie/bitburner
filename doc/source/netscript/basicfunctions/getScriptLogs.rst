getScriptLogs() Netscript Function
==================================

.. js:function:: getScriptLogs([filename[, hostname=current hostname[, args...]]])

    :RAM cost: 0 GB
    :param string filename: Optional. Filename of script to get logs from.
    :param string hostname: Optional. Hostname of the server running the script.
    :param args...: Arguments to identify which scripts to get logs for
    :returns: Array of string, each line being a logged line. Chronological.

.. note:: There is a maximum number of lines that a script stores in its logs.
    This is configurable in the game's options.

    If the function is called with no arguments, it will return the current
    script's logs.

    Otherwise, the ``filename``, ``hostname``, and ``args...`` arguments can be
    used to get the logs from another script. Remember that scripts are uniquely
    identified by both their names and arguments.

    Example:

    .. code-block:: javascript

        // Get logs from foo.script on the current server that was run with no args
        getScriptLogs("foo.script");

        // Get logs from foo.script on the foodnstuff server that was run with no args
        getScriptLogs("foo.script", "foodnstuff");

        // Get logs from foo.script on the foodnstuff server that was run with the arguments [1, "test"]
        getScriptLogs("foo.script", "foodnstuff", 1, "test");

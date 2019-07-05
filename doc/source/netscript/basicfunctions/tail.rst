tail() Netscript Function
==================================

.. js:function:: tail([fn], [hostname/ip=current ip], [...args])

    :param string fn: Optional. Filename of script to get logs from.
    :param string ip: Optional. IP or hostname of the server that the script is on
    :param args...: Arguments to identify which scripts to get logs for
    :RAM cost: 0 GB

    Opens a script's logs. This is functionally the same as the
    :ref:`tail_terminal_command` Terminal command.

    If the function is called with no arguments, it will open the current script's logs.

    Otherwise, the `fn`, `hostname/ip,` and `args...` arguments can be used to get the logs
    from another script. Remember that scripts are uniquely identified by both
    their names and arguments.

    Examples::

        // Open logs from foo.script on the current server that was run with no args
        tail("foo.script");

        // Open logs from foo.script on the foodnstuff server that was run with no args
        tail("foo.script", "foodnstuff");

        // Open logs from foo.script on the foodnstuff server that was run with the arguments [1, "test"]
        tail("foo.script", "foodnstuff", 1, "test");

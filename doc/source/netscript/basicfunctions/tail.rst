tail() Netscript Function
==================================

.. js:function:: tail([fn[, hostname=current hostname[, ...args]])

    :RAM cost: 0 GB
    :param string fn: Optional. Filename of script to get logs from.
    :param string hostname: Optional. Hostname of the server that the script is on.
    :param args...: Arguments to identify which scripts to get logs for.

    Opens a script's logs. This is functionally the same as the
    :ref:`tail_terminal_command` Terminal command.

    If the function is called with no arguments, it will open the current script's logs.

    Otherwise, the ``fn``, ``hostname``, and ``args...`` arguments can be
    used to get the logs from another script. Remember that scripts are uniquely
    identified by both their names and arguments.

    Example:

    .. code-block:: javascript

        // Open logs from foo.script on the current server that was run with no args
        tail("foo.script");

        // Open logs from foo.script on the foodnstuff server that was run with no args
        tail("foo.script", "foodnstuff");

        // Open logs from foo.script on the foodnstuff server that was run with the arguments [1, "test"]
        tail("foo.script", "foodnstuff", 1, "test");

.. js:function:: tail(scriptPid)

    :RAM cost: 0 GB
    :param number scriptPid: PID of the script to tail.

    Opens a script's logs by pid

    Example:

    .. code-block:: javascript

        // Open logs from process with id 42
        tail(42);

        // Open logs from process with id 42 on the foodnstuff server
        tail(42, "foodnstuff");

.. js:function:: tail()

    :RAM cost: 0 GB

    Opens the current script logs.

    Example:

    .. code-block:: javascript

        // Open the current script logs.
        tail();

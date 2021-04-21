isRunning() Netscript Function
==============================

.. js:function:: isRunning(filename[, hostname=current hostname[, args...]])

    :RAM cost: 0.1 GB
    :param string filename: Filename of script to check. case-sensitive.
    :param string hostname: Hostname of target server. Defaults to current server
    :param args...: Arguments to specify/identify which scripts to search for
    :returns: ``true`` if that script with those args is running on that server.

    .. note::

        Remember that a script is uniquely identified by both its name and its arguments.

    **Examples:**

    In this first example below, the function call will return true if there is
    a script named ``foo.script`` with no arguments running on the
    ``foodnstuff`` server, and false otherwise:

    .. code-block:: javascript

            isRunning("foo.script", "foodnstuff");

    In this second example below, the function call will return true if there is
    a script named ``foo.script`` with no arguments running on the current 
    server, and false otherwise:

    .. code-block:: javascript

            isRunning("foo.script", getHostname());

    In this next example below, the function call will return true if there is a
    script named ``foo.script`` running with the arguments 1, 5, and "test" (in
    that order) on the ``joesguns`` server, and false otherwise:

    .. code-block:: javascript

            isRunning("foo.script", "joesguns", 1, 5, "test");


.. js:function:: isRunning(scriptPid[, hostname=current hostname])

    :RAM cost: 0.1 GB
    :param number scriptPid: PID of the script to check.

    Same as the above version but with pid.

    Example:

    .. code-block:: javascript

            isRunning(39);

            isRunning(39, getHostname());

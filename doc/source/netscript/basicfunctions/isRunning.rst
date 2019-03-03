isRunning() Netscript Function
==============================

.. js:function:: isRunning(filename, hostname/ip, [args...])

    :param string filename: Filename of script to check. This is case-sensitive.
    :param string hostname/ip: Hostname or IP of target server
    :param args...: Arguments to specify/identify which scripts to search for
    :RAM cost: 0.1 GB

    Returns a boolean indicating whether the specified script is running on the target server. Remember that a script is
    uniquely identified by both its name and its arguments.

    **Examples:**

    In this first example below, the function call will return true if there is a script named *foo.script* with no arguments
    running on the *foodnstuff* server, and false otherwise::

        isRunning("foo.script", "foodnstuff");

    In this second example below, the function call will return true if there is a script named *foo.script* with no arguments
    running on the current server, and false otherwise::

        isRunning("foo.script", getHostname());

    In this next example below, the function call will return true if there is a script named *foo.script* running with the arguments
    1, 5, and "test" (in that order) on the *joesguns* server, and false otherwise::

        isRunning("foo.script", "joesguns", 1, 5, "test");

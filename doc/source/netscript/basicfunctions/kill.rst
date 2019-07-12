kill() Netscript Function
=========================

.. js:function:: kill(script, hostname/ip, [args...])

    :param string script: Filename of the script to kill
    :param string hostname/ip: IP or hostname of the server on which to kill the script
    :param args...: Arguments to identify which script to kill
    :RAM cost: 0.5 GB

    Kills the script on the target server specified by the script's name and arguments. Remember that scripts
    are uniquely identified by both their name and arguments. For example, if *foo.script* is run with the argument 1, then this
    is not the same as *foo.script* run with the argument 2, even though they have the same code.

    If this function successfully kills the specified script, then it will return true. Otherwise, it will return false.

    Examples:

    The following example will try to kill a script named *foo.script* on the *foodnstuff* server that was ran with no arguments::

        kill("foo.script", "foodnstuff");

    The following will try to kill a script named *foo.script* on the current server that was ran with no arguments::

        kill("foo.script", getHostname());

    The following will try to kill a script named *foo.script* on the current server that was ran with the arguments 1 and "foodnstuff"::

        kill("foo.script", getHostname(), 1, "foodnstuff");

.. js:function:: kill(scriptPid)

    :param number scriptPid: PID of the script to kill
    :RAM cost: 0.5 GB

    Kills the script with the specified PID. Killing a script by its PID will typically
    have better performance, especially if you have many scripts running.

    If this function successfully kills the specified script, then it will return true.
    Otherwise, it will return false.

    *Examples:*

    The following example will try to kill the script with the PID 10::

        if (kill(10)) {
            print("Killed script with PID 10!");
        }

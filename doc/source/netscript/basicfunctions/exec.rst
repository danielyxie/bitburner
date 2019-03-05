exec() Netscript Function
=========================

.. js:function:: exec(script, hostname/ip, [numThreads=1], [args...])

    :param string script: Filename of script to execute
    :param string hostname/ip: IP or hostname of the 'target server' on which to execute the script
    :param number numThreads: Optional thread count for new script. Set to 1 by default. Will be rounded to nearest integer
    :param args...:
        Additional arguments to pass into the new script that is being run. Note that if any arguments are being
        passed into the new script, then the third argument *numThreads* must be filled in with a value.
    :RAM cost: 1.3 GB

    Run a script as a separate process on a specified server. This is similar to the *run* function except
    that it can be used to run a script on any server, instead of just the current server.

    Returns true if the script is successfully started, and false otherwise.

    Running this function with a *numThreads* argument of 0 will return false without running the script.
    However, running this function with a negative *numThreads* argument will cause a runtime error.

    The simplest way to use the *exec* command is to call it with just the script name and the target server.
    The following example will try to run *generic-hack.script* on the *foodnstuff* server::

        exec("generic-hack.script", "foodnstuff");

    The following example will try to run the script *generic-hack.script* on the *joesguns* server with 10 threads::

        exec("generic-hack.script", "joesguns", 10);

    This last example will try to run the script *foo.script* on the *foodnstuff* server with 5 threads. It will also pass
    the number 1 and the string "test" in as arguments to the script::

        exec("foo.script", "foodnstuff", 5, 1, "test");

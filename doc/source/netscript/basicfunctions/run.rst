run() Netscript Function
========================

.. js:function:: run(script[, numThreads=1[, args...]])

    :RAM cost: 1 GB
    :param string script: Filename of script to run
    :param number numThreads: Optional thread count for new script. Set to 1 by
        default. Will be rounded to nearest integer.
    :param args...:
        Additional arguments to pass into the new script that is being run. Note
        that if any arguments are being passed into the new script, then the
        second argument ``numThreads`` must be filled in with a value.
    :returns: The process id of the new process or 0 on failure.

    Run a script as a separate process. This function can only be used to run
    scripts located on the current server (the server running the script that
    calls this function).

    .. warning:: Running this function with a ``numThreads`` argument of 0 or
                 less will cause a runtime error.

    The simplest way to use the :doc:`run<run>` command is to call it with just
    the script name. The following example will run ``foo.script``
    single-threaded with no arguments:

    .. code-block:: javascript

        run("foo.script");

    The following example will run 'foo.script' but with 5 threads instead of
    single-threaded:

    .. code-block:: javascript

        run("foo.script", 5);

    This next example will run ``foo.script`` single-threaded, and will pass the
    string ``foodnstuff`` into the script as an argument:

    .. code-block:: javascript

        run("foo.script", 1, 'foodnstuff');

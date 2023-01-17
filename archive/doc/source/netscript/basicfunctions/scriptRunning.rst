scriptRunning() Netscript Function
==================================

.. js:function:: scriptRunning(scriptname, hostname)

    :RAM cost: 1 GB
    :param string scriptname: Filename of script to check. case-sensitive.
    :param string hostname: Hostname of target server.
    :returns: ``true`` if any script with that file name is running on that 
        server.

    This is different than the :doc:`isRunning<isRunning>` function because it
    does not try to identify a specific instance of a running script by its
    arguments.

    Examples:

    The example below will return true if there is any script named
    ``foo.script`` running on the ``foodnstuff`` server, and false otherwise:

    .. code-block:: javascript

        scriptRunning("foo.script", "foodnstuff");

    The example below will return true if there is any script named
    ``foo.script`` running on the current server, and false otherwise:

    .. code-block:: javascript

        scriptRunning("foo.script", getHostname());

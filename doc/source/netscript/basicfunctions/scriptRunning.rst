scriptRunning() Netscript Function
==================================

.. js:function:: scriptRunning(scriptname, hostname/ip)

    :param string scriptname: Filename of script to check. This is case-sensitive.
    :param string hostname/ip: Hostname or IP of target server
    :RAM cost: 1 GB

    Returns a boolean indicating whether any instance of the specified script is running on the target server, regardless of
    its arguments.

    This is different than the *isRunning()* function because it does not try to identify a specific instance of a running script
    by its arguments.

    **Examples:**

    The example below will return true if there is any script named *foo.script* running on the *foodnstuff* server, and false otherwise::

        scriptRunning("foo.script", "foodnstuff");

    The example below will return true if there is any script named "foo.script" running on the current server, and false otherwise::

        scriptRunning("foo.script", getHostname());

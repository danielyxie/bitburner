scriptKill() Netscript Function
===============================

.. js:function:: scriptKill(scriptname, hostname)

    :RAM cost: 1 GB
    :param string scriptname: Filename of script to kill. case-sensitive.
    :param string hostname: Hostname of target server.
    :returns: ``true`` if any scripts were killed.

    Kills all scripts with the specified filename on the target server specified
    by ``hostname``, regardless of arguments.

    Example:

    .. code-block:: javascript

        scriptKill("demo.script", "home"); // returns: true

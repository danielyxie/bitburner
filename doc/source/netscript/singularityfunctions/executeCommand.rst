executeCommand() Netscript Function
========================================

.. js:function:: executeCommand(command)

    :RAM cost: 4 GB
    :param string commands: The full string of the command.

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function.

    This function writes the command to the terminal and executes it. This
    can be used to perform manual hacks. Only one command can be sent at a time.

    Examples:

    .. code-block:: javascript

        await ns.executeCommand('connect CSEC');
        await ns.executeCommand('hack');
        await ns.executeCommand('home');
        // a manual hack will be performed and CSEC will invite you.
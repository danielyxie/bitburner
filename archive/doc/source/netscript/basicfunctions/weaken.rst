weaken() Netscript Function
===========================

.. js:function:: weaken(hostname[, opts={}])

    :RAM cost: 0.15 GB
    :param string hostname: Hostname of the target server to weaken.
    :param object opts: Optional parameters for configuring function behavior. Properties:

        * threads (*number*) - Number of threads to use for this function.
          Must be less than or equal to the number of threads the script is running with.
    :returns: The amount by which the target server's security level was
        decreased. This is equivalent to 0.05 multiplied by the number of script
        threads.

    Use your hacking skills to attack a server's security, lowering the server's
    security level. The runtime for this command depends on your hacking level
    and the target server's security level. This function lowers the security
    level of the target server by 0.05.

    Like :doc:`hack<hack>` and :doc:`grow<grow>`, :doc:`weaken<weaken>` can be
    called on any server, regardless of where the script is running. This
    command requires root access to the target server, but there is no required
    hacking level to run the command.

    Example:

    .. code-block:: javascript

        weaken("foodnstuff");
        weaken("foodnstuff", { threads: 5 }); // Only use 5 threads to weaken

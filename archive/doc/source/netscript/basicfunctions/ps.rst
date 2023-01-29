ps() Netscript Function
=======================

.. js:function:: ps([hostname=current hostname])

    :RAM cost: 0.2 GB
    :param string hostname: Hostname address of the target server.
        If not specified, it will be the current server's IP by default.
    :returns: array of object

    Returns an array with general information about all scripts running on the
    specified target server. The information for each server is given in an
    object with the following structure::

        {
            filename: Script name,
            threads:  Number of threads script is running with,
            args:     Script's arguments,
            pid:      Script's pid
        }

    Example:

    .. code-block:: javascript

        processes = ps("home");
        for (let i = 0; i < processes.length; ++i) {
            tprint(processes[i].filename + ' ' + processes[i].threads);
            tprint(processes[i].args);
            tprint(processes[i].pid);
        }

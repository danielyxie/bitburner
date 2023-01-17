getScriptRam() Netscript Function
=================================

.. js:function:: getScriptRam(filename[, hostname])

    :RAM cost: 0.1 GB
    :param string filename: Filename of script.
    :param string hostname: Hostname of target server the script is located on.
        Default to the server this script is running on.
    :returns: Amount of RAM required to run the script, 0 if it does not exist.

    Example:

    .. code-block:: javascript

        getScriptRam("grow.script"); // returns: 1.75

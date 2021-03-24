manualHack() Netscript Function
===============================

.. js:function:: manualHack()

    :RAM cost: 2 GB
    :returns: The amount of money stolen if the hack is successful, and zero otherwise

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function.

    This function will perform a manual hack on the server you are currently connected to.
    This is typically required to join factions.

    Examples:

    .. code-block:: javascript

        connect("CSEC");
        manualHack();

    .. warning::
        For NS2 users:

        This function is async.
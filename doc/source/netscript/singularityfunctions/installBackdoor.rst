installBackdoor() Netscript Function
====================================

.. js:function:: installBackdoor()

    :RAM cost: 2 GB

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function.

    This function will install a backdoor on the server you are currently connected to.

    Examples:

    .. code-block:: javascript

        connect("foodnstuff");
        installBackdoor();

    .. warning::
        For NS2 users:

        This function is async.
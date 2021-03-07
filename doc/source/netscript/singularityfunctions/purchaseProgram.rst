purchaseProgram() Netscript Function
====================================

.. js:function:: purchaseProgram(programName)

    :param string programName: Name of program to purchase. Must include '.exe' extension. Not case-sensitive.

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function.

    This function allows you to automatically purchase programs. You MUST have a TOR router in order to use this function.
    The cost of purchasing programs using this function is the same as if you were purchasing them through the Dark Web using the
    Terminal *buy* command.

    Example::

        purchaseProgram("brutessh.exe");

    This function will return true if the specified program is purchased, and false otherwise.

    :RAM cost: 2 GB

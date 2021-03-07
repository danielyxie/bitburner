stopAction() Netscript Function
===============================

.. js:function:: stopAction()

    :RAM cost: 1 GB

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to run this function.
    This function is used to end whatever 'action' the player is currently performing. The player
    will receive whatever money/experience/etc. he has earned from that action.

    The actions that can be stopped with this function are:

    * Studying at a university
    * Working for a company/faction
    * Creating a program
    * Committing a Crime

    This function will return true if the player's action was ended. It will return false if the player was not
    performing an action when this function was called.

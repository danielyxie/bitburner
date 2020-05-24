installAugmentations() Netscript Function
=========================================

.. js:function:: installAugmentations(cbScript)
    :RAM cost: 5 GB

    :param string cbScript:
        Optional callback script. This is a script that will automatically be run after Augmentations are installed (after the reset).
        This script will be run with no arguments and 1 thread. It must be located on your home computer.

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function will automatically install your Augmentations, resetting the game as usual.

    This function will return false if it was not able to install Augmentations.

    If this function successfully installs Augmentations, then it has no return value because
    all scripts are immediately terminated.

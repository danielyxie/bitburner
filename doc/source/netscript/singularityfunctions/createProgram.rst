createProgram() Netscript Function
==================================

.. js:function:: createProgram(programName)
    :RAM cost: 5 GB

    :param string programName: Name of program to create. Not case-sensitive

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function will automatically set you to start working on creating the specified program. If you are
    already in the middle of some "working" action (such as working for a company, training at a gym, or taking a course),
    then running this function will automatically cancel that action and give you your earnings.

    Example:

        createProgram("relaysmtp.exe");

        Note that creating a program using this function has the same hacking level requirements as it normally would. These level requirements are:

        * BruteSSH.exe: 50
        * FTPCrack.exe: 100
        * relaySMTP.exe: 250
        * HTTPWorm.exe: 500
        * SQLInject.exe: 750
        * DeepscanV1.exe: 75
        * DeepscanV2.exe: 400
        * ServerProfiler.exe: 75
        * AutoLink.exe: 25

        This function returns true if you successfully start working on the specified program, and false otherwise.

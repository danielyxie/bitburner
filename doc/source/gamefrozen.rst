Game Frozen or Stuck?
=====================

Infinite Loop in NetscriptJS
----------------------------

If your game is frozen or stuck in any way, then the most likely culprit is an
infinitely running loop in :ref:`netscriptjs`. To get past the freezing, run the game with
`?noScripts` in the URL:

`https://danielyxie.github.io/bitburner/?noScripts <https://danielyxie.github.io/bitburner/?noScripts>`_

Then, to fix your script, make sure you have a sleep or any other timed function like `hack()` or
`grow()` in any infinite loops::

    while(true) {
        // This is an infinite loop that does something
        ...
        await ns.sleep(1000); // Add a 1s sleep to prevent freezing
    }

Bug
---

Otherwise, the game is probably frozen/stuck due to a bug. To report a bug, follow
the guidelines `here <https://github.com/danielyxie/bitburner/blob/master/CONTRIBUTING.md#reporting-bugs>`_.

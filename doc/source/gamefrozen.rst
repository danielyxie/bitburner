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

Also make sure that each while loop gets to `awaited` function or `break`, for example the next snippet has a sleep 
function, but it nor any possible conditional breaks are never reached and therefore will crash the game::

    while(true) {
        let currentMoney = ns.getServerMoneyAvailable("n00dles");
        let maxMoney = ns.getServerMaxMoney("n00dles");
        if (currentMoney < maxMoney/2){
            await ns.grow("n00dles");
        }
        if (currentMoney === maxMoney){
            break;
        }
    }

If `n00dles` current money is, for example, 75% of the maximum money, the script will not reach neither `grow` nor `break` and crashes the game.
Adding a sleep like in the first example, or changing the code so that `awaited` function or `break` is always reached, would prevent the crash.

Common infinite loop when translating the server purchasing script in starting guide to :ref:`netscriptjs` is to have a 
while loop, that's condition's change is conditional::

    var ram = 8;
    var i = 0;

    while (i < ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            var hostname = ns.purchaseServer("pserv-" + i, ram);
            ns.scp("early-hack-template.script", hostname);
            ns.exec("early-hack-template.script", hostname, 3);
            ++i;
        }
    }

if player does not currently have enough money to purchase a server, the `if`'s condition will be false and `++i` will not be reached.
Since the script doesn't have `sleep` and value `i` will not change without the `if` being true, this will crash the game. Adding a `sleep`
that is always reached would prevent the crash.

Blackscreen
-----------

If the game window becomes a black screen without the game itself crashing, this is caused by 
the game running too many concurrent scripts (the game runs on a browser and each tab can only 
use so much ram until it crashes). Depending on which scripts are running and your hardware,
this number can vary between 50000 to 100000 instances (in version 2.0.2. In prior versions this number 
was about 1/5th of that). To prevent this from happening make sure to :ref:`multithread<gameplay_scripts_multithreadingscripts>`
 the scripts as much as possible.


Bug
---

Otherwise, the game is probably frozen/stuck due to a bug. To report a bug, follow
the guidelines `here <https://github.com/bitburner-official/bitburner-src/blob/master/doc/CONTRIBUTING.md#reporting-bugs>`_.

.. _gameplay_hacking:

Hacking
=======

In the year 2077, currency has become digital and decentralized.
People and corporations store their money on servers. By hacking
these servers, you can steal their money and gain experience.

Gaining Root Access
^^^^^^^^^^^^^^^^^^^
The first step to hacking a server is to gain root access to that server.
This can be done using the NUKE virus (NUKE.exe). You start the
game with a copy of the NUKE virus on your home computer. The
NUKE virus attacks the target server's open ports using buffer
overflow exploits. When successful, you are granted root
administrative access to the machine.

In order for the NUKE virus to succeed, the target server
needs to have enough open ports. Some servers have no
security and will not need any ports opened. Some will have very high
security and will need many ports opened. In order to open ports on
another server, you will need to run programs that attack the server
to open specific ports. These programs can be coded once your hacking
skill gets high enough, or they can be purchased if you can find a seller.

**There are two ways to execute port-opening programs and the NUKE virus:**

1. Connect to the target server through the :ref:`terminal` and use the
   :ref:`run_terminal_command` Terminal command::

    $ run [programName]
2. Use a :ref:`Netscript Function <netscriptfunctions>`:

* :js:func:`nuke`
* :js:func:`brutessh`
* :js:func:`ftpcrack`
* :js:func:`relaysmtp`
* :js:func:`httpworm`
* :js:func:`sqlinject`

**There are two ways to determine how many ports need to be opened
on a server in order to successfully NUKE it:**

1. Connect to that server through the :ref:`terminal` and use the
   :ref:`analyze_terminal_command` command
2. Use the :js:func:`getServerNumPortsRequired` Netscript function

Once you have enough ports opened on a server and have ran the NUKE virus
to gain root access, you will be able to hack it.

.. _gameplay_hacking_generalhackingmechanics:

General Hacking Mechanics
^^^^^^^^^^^^^^^^^^^^^^^^^
When you execute the hack command, either manually through the terminal
or automatically through a script, you attempt to hack the server.
This action takes time. The more advanced a server's security is,
the more time it will take. Your hacking skill level also affects
the hacking time, with a higher hacking skill leading to shorter
hacking times. Also, running the hack command manually through terminal
is faster than hacking from a script.

Your attempt to hack a server will not always succeed. The chance you
have to successfully hack a server is also determined by the server's
security and your hacking skill level. Even if your hacking attempt
is unsuccessful, you will still gain experience points.

When you successfully hack a server. You steal a certain percentage
of that server's total money. This percentage is, once again, determined by the
server's security and your hacking skill level. The amount of money
on a server is not limitless. So, if you constantly hack a server
and deplete its money, then you will encounter diminishing returns
in your hacking (since you are only hacking a certain percentage).
You can increase the amount of money on a server using a script and
the :js:func:`grow` function in Netscript.

.. _gameplay_hacking_serversecurity:

Server Security
^^^^^^^^^^^^^^^
Each server has a security level, typically between 1 and 100.
A higher number means the server has stronger security. It is
possible for a server to have a security of level 100 or higher, in
which case hacking that server will become impossible (0% chance for
hack to succeed).

As mentioned above, a server's security level is an important factor
to consider when hacking. You can check a server's security level
using the :ref:`analyze_terminal_command` Terminal command. You can
also check a server's security in
a script, using the :js:func:`getServerSecurityLevel` Netscript
Function. See the Netscript documentation for more details.

Whenever a server is hacked manually or through a script, its security
level increases by a small amount. Calling the :js:func:`grow` function in a
script will also increase security level of the target server. These
actions will make it harder for you to hack the server, and decrease
the amount of money you can steal. You can lower a server's security
level in a script using the :js:func:`weaken` function in Netscript. See
the Netscript documentation for more details

A server has a minimum security level that is equal to one third of its
starting security, rounded to the nearest integer. To be more precise::

    server.minSecurityLevel = Math.max(1, Math.round(server.startingSecurityLevel / 3))

This means that a server's security level will not fall below this
value if you are trying to weaken() it.

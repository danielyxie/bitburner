.. _gameplay_servers:

Servers
=======
In this game, a server refers to a computer that can be connected to,
accessed, and manipulated through the Terminal. All servers in the
game are connected to each other to form a large, global network.
To learn about how to navigate this network and connect to other
servers, see the :ref:`Terminal` page.

Server RAM
^^^^^^^^^^
Perhaps the most important property of a server to make note of is its RAM,
which refers to how much memory is available on that machine. RAM is
important because it is required to run Scripts. More RAM allows
the user to run more powerful and complicated scripts.

The `free`, `scan-analyze`, and `analyze` Terminal commands
can be used to check how much RAM a server has.

Identifying Servers
^^^^^^^^^^^^^^^^^^^
A server is identified by two properties: its IP address and its hostname.
An IP address is a 32-bit number represented in dot-decimal notation.
For example, "56.1.5.0" and "86.5.1.0" might be two IP addresses
you see in the game. A hostname is a label assigned to a server.
A hostname will usually give you a general idea of what the server
is. For example, the company Nova Medical might have a server with
the hostname "nova-med".

Hostnames and IP addresses are unique. This means that if one
server has the IP address "1.1.1.1" and the hostname
"some-server", then no other server in the game can have that
 IP address or that hostname.

There are many :ref:`Netscript Functions <netscriptfunctions>`
and :ref:`terminal` commands in the game
that will require you to target a specific server. This is done using
either the IP address or the hostname of the server.

Player-owned Servers
^^^^^^^^^^^^^^^^^^^^
The player starts with a single server: his/her home computer.
This server will have the hostname "home." The player's home
computer is special for a variety of reasons:

1. The home computer's RAM can be upgraded. This can be done by visiting
certain locations in the World.

2. The home computer persists through Augmentation Installations. This means
that you will not lose any RAM upgrades or Scripts on your
home computer when you install Augmentations (you will
however, lose programs and messages on your home computer).

The player can also purchase additional servers. This can be
done by visiting certain locations in the World, or it can be
done automatically through a script using the :js:func:`purchaseServer`
Netscript Function. The advantage of purchased servers is that,
in terms of RAM, they are cheaper than upgrading your home
computer. The disadvantage is that your purchased servers
are lost when you install Augmentations.

Hackable Servers
^^^^^^^^^^^^^^^^
Most servers that are not owned by the player can be hacked for money
and exp. See the :ref:`gameplay_hacking` page for more details.

Different servers have different levels of security, but also offer
different rewards when being hacked.

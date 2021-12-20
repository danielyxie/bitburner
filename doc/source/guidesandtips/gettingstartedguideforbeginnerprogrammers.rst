Getting Started Guide for Beginner Programmers
==============================================

.. note:: Note that the scripts and strategies given in this guide aren't necessarily
          optimal. They're just meant to introduce you to the game and help you get
          started.

This is an introductory guide to getting started with Bitburner. It is not meant to be a
comprehensive guide for the entire game, only the early stages. If you are confused
or overwhelmed by the game, especially the programming and scripting aspects, this
guide is perfect for you!

Note that this guide is tailored towards those with minimal programming experience.

Introduction
------------
Bitburner is a cyberpunk-themed incremental RPG. The player progresses by raising
their :ref:`gameplay_stats`, earning money, and :ref:`climbing the corporate ladder <gameplay_companies>`.
Eventually, after reaching certain criteria, the player will begin receiving invitations
from :ref:`gameplay_factions`. Joining these factions and working for them will unlock
:ref:`gameplay_augmentations`. Purchasing and installing Augmentations provide persistent
upgrades and are necessary for progressing in the game.

The game has a minimal story/quest-line that can be followed to reach the end of the game.
Since this guide is only about getting started with Bitburner, it will not cover the
entire "quest-line".

First Steps
-----------
I'm going to assume you followed the introductory tutorial when you first began the game.
In this introductory tutorial you created a script called :code:`n00dles.script` and ran it
on the :code:`n00dles` server. Right now, we'll kill this script. There are two ways
to do this:

1. You can go to the Terminal and enter::

    $ kill n00dles.script

2. You can go to the :code:`Active Scripts` page (|Keyboard shortcut| Alt + s) and
   press the "Kill Script" button for :code:`n00dles.script`.

If you skipped the introductory tutorial, then ignore the part above. Instead, go to the
:code:`Hacknet Nodes` page (|Keyboard shortcut| Alt + h) and purchase a
Hacknet Node to start generating some passive income.

Creating our First Script
-------------------------
Now, we'll create a generic hacking script that can be used early on in the game (or throughout the
entire game, if you want).

Before we write the script, here are some things you'll want to familiarize yourself with:

* :ref:`gameplay_hacking_generalhackingmechanics`
* :ref:`gameplay_hacking_serversecurity`
* :js:func:`hack`
* :js:func:`grow`
* :js:func:`weaken`
* :js:func:`brutessh`
* :js:func:`nuke`

To briefly summarize the information from the links above: Each server has a
security level that affects how difficult it is to hack. Each server also has a
certain amount of money, as well as a maximum amount of money it can hold. Hacking a
server steals a percentage of that server's money. The :js:func:`hack` Netscript function
is used to hack server. The :js:func:`grow` Netscript function is used to increase
the amount of money available on a server. The :js:func:`weaken` Netscript function is
used to decrease a server's security level.

Now let's move on to actually creating the script.
Go to your home computer and then create a script called :code:`early-hack-template.script` by
going to Terminal and entering the following two commands::

    $ home
    $ nano early-hack-template.script

This will take you to the script editor, which you can use to code and create
:ref:`gameplay_scripts`. It will be helpful to consult the :ref:`netscript` documentation.
Specifically, you'll want to take a look at :ref:`netscriptfunctions`.

Enter the following code in the script editor:

.. code:: javascript

    // Defines the "target server", which is the server
    // that we're going to hack. In this case, it's "n00dles"
    var target = "n00dles";

    // Defines how much money a server should have before we hack it
    // In this case, it is set to 75% of the server's max money
    var moneyThresh = getServerMaxMoney(target) * 0.75;

    // Defines the maximum security level the target server can
    // have. If the target's security level is higher than this,
    // we'll weaken it before doing anything else
    var securityThresh = getServerMinSecurityLevel(target) + 5;

    // If we have the BruteSSH.exe program, use it to open the SSH Port
    // on the target server
    if (fileExists("BruteSSH.exe", "home")) {
        brutessh(target);
    }

    // Get root access to target server
    nuke(target);

    // Infinite loop that continously hacks/grows/weakens the target server
    while(true) {
        if (getServerSecurityLevel(target) > securityThresh) {
            // If the server's security level is above our threshold, weaken it
            weaken(target);
        } else if (getServerMoneyAvailable(target) < moneyThresh) {
            // If the server's money is less than our threshold, grow it
            grow(target);
        } else {
            // Otherwise, hack it
            hack(target);
        }
    }

The script above contains comments that document what it does, but let's go through it
step-by-step anyways.

.. code:: javascript

    var target = "n00dles";

This first command defines a string which contains our target server. That's the server
that we're going to hack. For now, it's set to `n00dles` because that's the only
server with a required hacking level of 1. If you want to hack a different server,
simply change this
variable to be the hostname of another server.

.. code:: javascript

    var moneyThresh = getServerMaxMoney(target) * 0.75;

This second command defines a numerical value representing the minimum
amount of money that must be available on the target server in order for our script
to hack it. If the money available on the target server is less than this value,
then our script will :js:func:`grow` the server rather than hacking it.
It is set to 75% of the maximum amount of money that can be available on the server.
The :js:func:`getServerMaxMoney` Netscript function is used to find this value

.. code:: javascript

    var securityThresh = getServerMinSecurityLevel(target) + 5;

This third command defines a numerical value representing the maximum security level
the target server can have. If the target server's security level is higher than
this value, then our script will :js:func:`weaken` the script before doing anything else.

.. code:: javascript

    if (fileExists("BruteSSH.exe", "home")) {
        brutessh(target);
    }

    nuke(target);

This section of code is used to gain root access on the target server. This is
necessary for hacking. See :ref:`here for more details <gameplay_hacking>`.

.. code:: javascript

    while (true) {
        if (getServerSecurityLevel(target) > securityThresh) {
            // If the server's security level is above our threshold, weaken it
            weaken(target);
        } else if (getServerMoneyAvailable(target) < moneyThresh) {
            // Otherwise, if the server's money is less than our threshold, grow it
            grow(target);
        } else {
            // Otherwise, hack it
            hack(target);
        }
    }

This is the main section that drives our script. It dictates the script's logic
and carries out the hacking operations. The `while (true)` creates an infinite loop
that will continuously run the hacking logic until the the script is killed.

Running our Scripts
-------------------
Now we want to start running our hacking script so that it can start earning us
money and experience. Our home computer only has 8GB of RAM and we'll be using it for
something else later. So instead, we'll take advantage of the RAM on other machines.

Go to |Terminal| and enter the following command::

    $ scan-analyze 2

This will show detailed information about some servers on the network. The
**network is randomized so it will be different for every person**.
Here's what mine showed at the time I made this::

    [home ~]> scan-analyze 2
    ~~~~~~~~~~ Beginning scan-analyze ~~~~~~~~~~

    n00dles
    --Root Access: YES, Required hacking skill: 1
    --Number of open ports required to NUKE: 0
    --RAM: 4.00GB
    
    ----zer0
    ------Root Access: NO, Required hacking skill: 75
    ------Number of open ports required to NUKE: 1
    ------RAM: 32.00GB
    
    foodnstuff
    --Root Access: NO, Required hacking skill: 1
    --Number of open ports required to NUKE: 0
    --RAM: 16.00GB
    
    sigma-cosmetics
    --Root Access: NO, Required hacking skill: 5
    --Number of open ports required to NUKE: 0
    --RAM: 16.00GB
    
    joesguns
    --Root Access: NO, Required hacking skill: 10
    --Number of open ports required to NUKE: 0
    --RAM: 16.00GB
    
    ----max-hardware
    ------Root Access: NO, Required hacking skill: 80
    ------Number of open ports required to NUKE: 1
    ------RAM: 32.00GB
    
    ----CSEC
    ------Root Access: NO, Required hacking skill: 54
    ------Number of open ports required to NUKE: 1
    ------RAM: 8.00GB
    
    hong-fang-tea
    --Root Access: NO, Required hacking skill: 30
    --Number of open ports required to NUKE: 0
    --RAM: 16.00GB
    
    ----nectar-net
    ------Root Access: NO, Required hacking skill: 20
    ------Number of open ports required to NUKE: 0
    ------RAM: 16.00GB
    
    harakiri-sushi
    --Root Access: NO, Required hacking skill: 40
    --Number of open ports required to NUKE: 0
    --RAM: 16.00GB
    
    iron-gym
    --Root Access: NO, Required hacking skill: 100
    --Number of open ports required to NUKE: 1
    --RAM: 32.00GB

Take note of the following servers:

* |n00dles|
* |sigma-cosmetics|
* |joesguns|
* |nectar-net|
* |hong-fang-tea|
* |harakiri-sushi|

All of these servers have 16GB of RAM. Furthermore, all of these servers do not require
any open ports in order to NUKE. In other words, we can gain root access to all of these
servers and then run scripts on them.

First, let's determine how many threads of our hacking script we can run.
:ref:`Read more about multithreading scripts here <gameplay_scripts_multithreadingscripts>`
The script we wrote
uses 2.6GB of RAM. You can check this using the following |Terminal| command::

    $ mem early-hack-template.script

This means we can run 6 threads on a 16GB server. Now, to run our scripts on all of these
servers, we have to do the following:

1. Use the :ref:`scp_terminal_command` |Terminal| command to copy our script to each server.
2. Use the :ref:`connect_terminal_command` |Terminal| command to connect to a server.
3. Use the :ref:`run_terminal_command` |Terminal| command to run the `NUKE.exe` program and
   gain root access.
4. Use the :ref:`run_terminal_command` |Terminal| command again to run our script.
5. Repeat steps 2-4 for each server.

Here's the sequence of |Terminal| commands I used in order to achieve this::

    $ home
    $ scp early-hack-template.script n00dles
    $ scp early-hack-template.script sigma-cosmetics
    $ scp early-hack-template.script joesguns
    $ scp early-hack-template.script nectar-net
    $ scp early-hack-template.script hong-fang-tea
    $ scp early-hack-template.script harakiri-sushi
    $ connect n00dles
    $ run NUKE.exe
    $ run early-hack-template.script -t 1
    $ home
    $ connect sigma-cosmetics
    $ run NUKE.exe
    $ run early-hack-template.script -t 6
    $ home
    $ connect joesguns
    $ run NUKE.exe
    $ run early-hack-template.script -t 6
    $ home
    $ connect hong-fang-tea
    $ run NUKE.exe
    $ run early-hack-template.script -t 6
    $ home
    $ connect harakiri-sushi
    $ run NUKE.exe
    $ run early-hack-template.script -t 6
    $ home
    $ connect hong-fang-tea
    $ connect nectar-net
    $ run NUKE.exe
    $ run early-hack-template.script -t 6

.. note::

    Pressing the :code:`Tab` key in the middle of a Terminal command will attempt to
    auto-complete the command. For example, if you type in :code:`scp ea` and then
    hit :code:`Tab`, the rest of the script's name should automatically be filled in.
    This works for most commands in the game!

The :ref:`home_terminal_command` |Terminal| command is used to connect to the home
computer. When running our scripts with the :code:`run early-hack-template.script -t 6`
command, the :code:`-t 6` specifies that the script should be run with 6 threads.

Note that the |nectar-net| server isn't in the home computer's immediate network.
This means you can't directly connect to it from home. You will have to search for it
inside the network. The results of the `scan-analyze 2` command we ran before
will show where it is. In my case, I could connect to it by going from
`hong-fang-tea -> nectar-net`. However, this will probably be different for you.

After running all of these |Terminal| commands, our scripts are now up and running.
These will earn money and hacking experience over time. These gains will be
really slow right now, but they will increase once our hacking skill rises and
we start running more scripts.

Increasing Hacking Level
------------------------
There are many servers besides |n00dles| that can be hacked, but they have
higher required hacking levels. Therefore, we should raise our hacking level. Not only
will this let us hack more servers, but it will also increase the effectiveness of our hacking
against |n00dles|.

The easiest way to train your hacking level is to visit Rothman University. You can do this by
clicking the `City` tab on the left-hand navigation menu, or you can use the
:ref:`keyboard shortcut <shortcuts>` Alt + w. Rothman University should be one of the buttons
near the top. Click the button to go to the location.

Once you go to Rothman University, you should see a screen with several options. These
options describe different courses you can take. You should click the first button, which
says: "Study Computer Science (free)".

After you click the button, you will start studying and earning hacking experience. While you
are doing this, you cannot interact with any other part of the game until you click the button
that says "Stop taking course".

Right now, we want a hacking level of 10. You need approximately 174 hacking experience to reach
level 10. You can check how much hacking experience you have by clicking the `Stats` tab
on the left-hand navigation menu, or by using |Keyboard shortcut| Alt + c.
Since studying at Rothman University earns you 1 experience per second, this will take
174 seconds, or approximately 3 minutes. Feel free to do something in the meantime!

Editing our Hacking Script
--------------------------
Now that we have a hacking level of 10, we can hack the :code:`joesguns` server. This server
will be slightly more profitable than :code:`n00dles`. Therefore, we want to change our hacking
script to target :code:`joesguns` instead of :code:`n00dles`.

Go to |Terminal| and edit the hacking script by entering::

    $ home
    $ nano early-hack-template.script

At the top of the script, change the `target` variable to be `joesguns`:

.. code:: javascript

    var target = "joesguns";

Note that this will **NOT** affect any instances of the script that are already running.
This will only affect instances of the script that are ran from this point forward.

Creating a New Script to Purchase New Servers
---------------------------------------------
Next, we're going to create a script that automatically purchases additional servers. These
servers will be used to run many scripts. Running this script will initially be very
expensive since purchasing a server costs money, but it will pay off in the long run.

In order to create this script, you should familiarize yourself with the following
Netscript functions:

* :js:func:`purchaseServer`
* :js:func:`getPurchasedServerCost`
* :js:func:`getPurchasedServerLimit`
* :js:func:`getServerMoneyAvailable`
* :js:func:`scp`
* :js:func:`exec`

Create the script by going to |Terminal| and typing::

    $ home
    $ nano purchase-server-8gb.script

Paste the following code into the script editor:

.. code:: javascript

    // How much RAM each purchased server will have. In this case, it'll
    // be 8GB.
    var ram = 8;

    // Iterator we'll use for our loop
    var i = 0;

    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    while (i < getPurchasedServerLimit()) {
        // Check if we have enough money to purchase a server
        if (getServerMoneyAvailable("home") > getPurchasedServerCost(ram)) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Copy our hacking script onto the newly-purchased server
            //  3. Run our hacking script on the newly-purchased server with 3 threads
            //  4. Increment our iterator to indicate that we've bought a new server
            var hostname = purchaseServer("pserv-" + i, ram);
            scp("early-hack-template.script", hostname);
            exec("early-hack-template.script", hostname, 3);
            ++i;
        }
    }

This code uses a while loop to purchase the maximum amount of servers using the
:js:func:`purchaseServer` Netscript function. Each of these servers will have
8GB of RAM, as defined in the :code:`ram` variable. Note that the script uses the command
:code:`getServerMoneyAvailable("home")` to get the amount of money you currently have.
This is then used to check if you can afford to purchase a server.

Whenever the script purchases a new server, it uses the :js:func:`scp` function to copy
our script onto that new server, and then it uses the :js:func:`exec` function to
execute it on that server.

To run this script, go to |Terminal| and type::

    $ run purchase-server-8gb.script

This purchase will continuously run until it has purchased the maximum number of servers.
When this happens, it'll mean that you have a bunch of new servers that are all running
hacking scripts against the :code:`joesguns` server!

.. note::

    The reason we're using so many scripts to hack :code:`joesguns` instead of targeting other
    servers is because it's more effective. This early in the game, we don't have enough RAM
    to efficiently hack multiple targets, and trying to do so would be slow as we'd be spread
    too thin. You should definitely do this later on, though!

Note that purchasing a server is fairly expensive, and purchasing the maximum amount of
servers even more so. At the time of writing this guide, the script above requires
$11 million in order to finish purchasing all of the 8GB servers.
Therefore, we need to find additional ways to make money to speed
up the process! These are covered in the next section.

Additional Sources of Income
----------------------------
There are other ways to gain money in this game besides scripts & hacking.

Hacknet Nodes
^^^^^^^^^^^^^
If you completed the introductory tutorial, you were already introduced to this method: Hacknet Nodes.
Once you have enough money, you can start upgrading your Hacknet Nodes in order to increase
your passive income stream. This is completely optional. Since each Hacknet Node upgrade
takes a certain amount of time to "pay itself off", it may not necessarily be in your best
interest to use these.

Nonetheless, Hacknet Nodes are a good source of income early in the game, although
their effectiveness tapers off later on. If you do wind up purchasing and upgrading Hacknet Nodes,
I would suggest only upgrading their levels for now. I wouldn't bother with RAM and Core
upgrades until later on.

Crime
^^^^^
The best source of income right now is from :ref:`committing crimes <gameplay_crimes>`.
This is because it not only gives you a large amount of money, but it also raises your
hacking level. To commit crimes, click on the :code:`City` tab on the left-hand
navigation menu or use the |Keyboard shortcut| Alt + w.
Then, click on the link that says :code:`The Slums`.

In the Slums, you can attempt to commit a variety of crimes, each of which gives certain
types of experience and money if successful. See :ref:`gameplay_crimes` for more details.

.. note::

    You are not always successful when you attempt to commit a crime. Nothing bad happens
    if you fail a crime, but you won't earn any money and the experience gained will be
    reduced. Raising your stats improves your chance of successfully committing a crime.

Right now, the best option is the :code:`Rob Store` crime. This takes 60 seconds to attempt
and gives $400k if successful. I suggest this crime because you don't have to click or check
in too often since it takes a whole minute to attempt. Furthermore, it gives hacking experience,
which is very important right now.

Alternatively, you can also use the :code:`Shoplift` crime. This takes 2 seconds to attempt
and gives $15k if successful. This crime is slightly easier and is more profitable
than :code:`Rob Store`, but it requires constant clicking and it doesn't give
hacking experience.

Work for a Company
^^^^^^^^^^^^^^^^^^
If you don't want to constantly check in on the game to commit crimes, there's another option
that's much more passive: working for a :ref:`company <gameplay_companies>`.
This will not be nearly as profitable  as crimes, but it's completely passive.

Go to the :code:`City` tab on the left-hand navigation menu and then go to
:code:`Joe's Guns`. At :code:`Joe's Guns`, there will be an option that says
:code:`Apply to be an Employee`. Click this to get the job. Then, a new option
will appear that simply says :code:`Work`. Click this to start working.
Working at :code:`Joe's Guns` earns $110 per second and also grants some experience
for every stat except hacking.

Working for a company is completely passive. However, you will not be able to do anything
else in the game while you work. You can cancel working at any time. You'll notice that
cancelling your work early causes you to lose out on some reputation gains, but
you shouldn't worry about this. Company reputation isn't important right now.

Once your hacking hits level 75, you can visit :code:`Carmichael Security` in the city
and get a software job there. This job offers higher pay and also earns you
hacking experience.

There are many more companies in the |City tab| that offer more pay and also more gameplay
features. Feel free to explore!

After you Purchase your New Servers
-----------------------------------
After you've made a total of $11 million, your automatic server-purchasing script should
finish running. This will free up some RAM on your home computer. We don't want this RAM
to go to waste, so we'll make use of it. Go to |Terminal| and enter the following commands::

    $ home
    $ run early-hack-template.script -t 3

Reaching a Hacking Level of 50
------------------------------
Once you reach a hacking level of 50, two new important parts of the game open up.

Creating your first program: BruteSSH.exe
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
On the left-hand navigation menu you will notice a :code:`Create Programs` tab with a
red notification icon. This indicates that there are programs available to be created.
Click on that tab (or use |Keyboard shortcut| Alt + p) and you'll see a
list of all the programs you can currently create. Hovering over a program will give a
brief description of its function. Simply click on a program to start creating it.

Right now, the program we want to create is :code:`BruteSSH.exe`. This program is used
to open up SSH ports on servers. This will allow you to hack more servers,
as many servers in the game require a certain number of opened ports in order for
:code:`NUKE.exe` to gain root access.

When you are creating a program, you cannot interact with any other part of the game.
Feel free to cancel your work on creating a program at any time, as your progress will
be saved and can be picked back up later. :code:`BruteSSH.exe` takes about
10 minutes to complete.

Optional: Create AutoLink.exe
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
On the :code:`Create Programs` page, you will notice another program you can create
called :code:`AutoLink.exe`. If you don't mind waiting another 10-15 minutes, you should
go ahead and create this program. It makes it much less tedious to connect to other servers,
but it's not necessary for progressing.

Joining your first faction: CyberSec
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Shortly after you reached level 50 hacking, you should have received a message that
said this::

    Message received from unknown sender:

    We've been watching you. Your skills are very impressive. But you're wasting
    your talents. If you join us, you can put your skills to good use and change
    the world for the better. If you join us, we can unlock your full potential.
    But first, you must pass our test. Find and hack our server using the Terminal.

    -CyberSec

    This message was saved as csec-test.msg onto your home computer.

If you didn't, or if you accidentally closed it, that's okay! Messages get saved onto
your home computer. Enter the following |Terminal| commands to view the message::

    $ home
    $ cat csec-test.msg

This message is part of the game's main "quest-line". It is a message from the
|CyberSec faction| that is asking you to pass their test.
Passing their test is simple, you just have to find their server and hack it through
the |Terminal|. Their server is called :code:`CSEC`.
To do this, we'll use the :ref:`scan_analyze_terminal_command`
Terminal command, just like we did before::

    $ home
    $ scan-analyze 2

This will show you the network for all servers that are up to 2 "nodes" away from
your home computer. Remember that the network is randomly generated so it'll look
different for everyone. Here's the relevant part of my :code:`scan-analyze` results::

    >iron-gym
    --Root Access: NO, Required hacking skill: 100
    --Number of open ports required to NUKE: 1
    --RAM: 32

    ---->zer0
    ------Root Access: NO, Required hacking skill: 75
    ------Number of open ports required to NUKE: 1
    ------RAM: 32

    ---->CSEC
    ------Root Access: NO, Required hacking skill: 54
    ------Number of open ports required to NUKE: 1
    ------RAM: 8

This tells me that I can reach :code:`CSEC` by going through :code:`iron-gym`::

    $ connect iron-gym
    $ connect CSEC

.. note::

    If you created the :code:`AutoLink.exe` program earlier, then there is an easier
    method of connecting to :code:`CSEC`. You'll notice that in the :code:`scan-analyze`
    results, all of the server hostnames are white and underlined. You can simply
    click one of the server hostnames in order to connect to it. So, simply click
    :code:`CSEC`!

.. note::

    Make sure you notice the required hacking skill for the :code:`CSEC` server.
    This is a random value between 51 and 60. Although you receive the message
    from CSEC once you hit 50 hacking, you cannot actually pass their test
    until your hacking is high enough to install a backdoor on their server.

After you are connected to the :code:`CSEC` server, you can backdoor it. Note that this
server requires one open port in order to gain root access. We can open the SSH port
using the :code:`BruteSSH.exe` program we created earlier. In |Terminal|::

    $ run BruteSSH.exe
    $ run NUKE.exe
    $ backdoor

After you successfully install the backdoor, you should receive a faction
invitation from |CyberSec| shortly afterwards. Accept it. If you accidentally
reject the invitation, that's okay. Just go to the :code:`Factions` tab
(|Keyboard shortcut| Alt + f) and you should see an option that lets you
accept the invitation.

Congrats! You just joined your first faction. Don't worry about doing anything
with this faction yet, we can come back to it later.

Using Additional Servers to Hack Joesguns
-----------------------------------------
Once you have the |BruteSSH| program, you will be able to gain root access
to several additional servers. These servers have more RAM that you can use to
run scripts. We'll use the RAM on these servers to run more scripts that target
:code:`joesguns`.

Copying our Scripts
^^^^^^^^^^^^^^^^^^^
The server's we'll be using to run our scripts are:

* :code:`neo-net`
* :code:`zer0`
* :code:`max-hardware`
* :code:`iron-gym`

All of these servers have 32GB of RAM. You can use the |Terminal| command
:code:`scan-analyze 3` to see for yourself. To copy our hacking scripts onto these servers,
go to |Terminal| and run::

    $ home
    $ scp early-hack-template.script neo-net
    $ scp early-hack-template.script zer0
    $ scp early-hack-template.script max-hardware
    $ scp early-hack-template.script iron-gym

Since each of these servers has 32GB of RAM, we can run our hacking script with 12 threads
on each server. By now, you should know how to connect to servers. So find and connect to
each of the servers above using the :code:`scan-analyze 3` |Terminal| command. Then, use
following |Terminal| command to run our hacking
script with 12 threads::

    $ run early-hack-template.script -t 12

Remember that if you have the |AutoLink| program, you can simply click on the hostname of a server
after running :ref:`scan_analyze_terminal_command` to connect to it.

Profiting from Scripts & Gaining Reputation with CyberSec
---------------------------------------------------------
Now it's time to play the waiting game. It will take some time for your scripts to start
earning money. Remember that most of your scripts are targeting |joesguns|. It will take a
bit for them to :js:func:`grow` and :js:func:`weaken` the server to the appropriate values
before they start hacking it. Once they do, however, the scripts will be very profitable.

.. note::

    For reference, in about two hours after starting my first script, my scripts had a
    production rate of $20k per second and had earned a total of $70 million.
    (You can see these stats on the :code:`Active Scripts` tab).

    After another 15 minutes, the production rate had increased to $25k per second
    and the scripts had made an additional $55 million.

    Your results will vary based on how fast you earned money from crime/working/hacknet nodes,
    but this will hopefully give you a good indication of how much the scripts can earn.

In the meantime, we are going to be gaining reputation with the |CyberSec faction|.
Go to the |Factions tab| on the left-hand
navigation menu, and from there select |CyberSec|. In the middle of
the page there should be a button for :code:`Hacking Contracts`.
Click it to start earning reputation for the |CyberSec| faction (as well
as some hacking experience). The higher your hacking level, the more reputation you
will gain. Note that while you are working for a faction, you cannot interact with
the rest of the game in any way. You can cancel your faction work at any time
with no penalty.

Purchasing Upgrades and Augmentations
-------------------------------------
As I mentioned before, within 1-2 hours I had earned over $200 million. Now, it's time
to spend all of this money on some persistent upgrades to help progress!

Upgrading RAM on Home computer
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The most important thing to upgrade right now is the RAM on your home computer. This
will allow you to run more scripts.

To upgrade your RAM, go to the |City tab| and visit the company |Alpha Enterprises|.
There will be an option that says :code:`Purchase additional RAM for Home Computer`.
Click it and follow the dialog box to upgrade your RAM.

I recommend getting your home computer's RAM to *at least* 128GB. Getting it even
higher would be better.

Purchasing your First Augmentations
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Once you get ~1000 reputation with the |CyberSec faction|, you can purchase
your first :ref:`Augmentation <gameplay_augmentations>` from them.

To do this, go to the |Factions tab| on the left-hand navigation menu
(|Keyboard shortcut| Alt + f) and select |CyberSec|. There is an button
near the bottom that says :code:`Purchase Augmentations`. This will bring up a
page that displays all of the Augmentations available from |CyberSec|. Some of them
may be locked right now. To unlock these, you will need to earn more
reputation with |CyberSec|.

Augmentations give persistent upgrades in the form of multipliers. These aren't very
powerful early in the game because the multipliers are small. However, the effects
of Augmentations stack multiplicatively **with each other**, so as you continue to install
many Augmentations their effects will increase significantly.

Because of this, I would recommend investing more in RAM upgrades for your home computer rather
than Augmentations early on. Having enough RAM to run many scripts will allow you to make
much more money, and then you can come back later on and get all these Augmentations.

Right now, I suggest purchasing at the very least the :code:`Neurotrainer I` Augmentation from
|CyberSec|. If you have the money to spare, I would also suggest getting :code:`BitWire` and
several levels of the :code:`NeuroFlux Governor` Augmentations. Note that each time
you purchase an Augmentation,
:ref:`the price of purchasing another increases by 90% <gameplay_augmentations_purchasingmultiple>`,
so make sure you buy the most expensive Augmentation first. Don't worry, once you choose to
install Augmentations, their prices will reset back to their original values.

Next Steps
----------
That's the end of the walkthrough portion of this guide! You should continue to explore
what the game has to offer. There's quite a few features that aren't covered or mentioned
in this guide, and even more that get unlocked as you continue to play!

Also, check out the :ref:`netscript` documentation to see what it has to offer. Writing
scripts to perform and automate various tasks is where most of the fun in the game comes
from (in my opinion)!

The following are a few things you may want to consider doing in the near future.

Installing Augmentations (and Resetting)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
If you've purchased any :ref:`gameplay_augmentations`, you'll need to install them before you
actually gain their effects. Installing Augmentations is the game's "soft-reset" or "prestige"
mechanic. You can :ref:`read more details about it here <gameplay_augmentations_installing>`.

To install your Augmentations, click the |Augmentations tab| on the left-hand navigation
menu (|Keyboard shortcut| Alt + a). You will see a list of all of the Augmentations
you have purchased. Below that, you will see a button that says :code:`Install Augmentations`.
Be warned, after clicking this there is no way to undo it (unless you load an earlier save).

Automating the Script Startup Process
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Whenever you install Augmentations, all of your scripts are killed and you'll have to
re-run them. Doing this every time you install Augmentations would be very tedious and annoying,
so you should write a script to automate the process. Here's a simple example for a
startup script. Feel free to adjust it to your liking.

.. code:: javascript

    // Array of all servers that don't need any ports opened
    // to gain root access. These have 16 GB of RAM
    var servers0Port = ["n00dles",
                        "sigma-cosmetics",
                        "joesguns",
                        "nectar-net",
                        "hong-fang-tea",
                        "harakiri-sushi"];

    // Array of all servers that only need 1 port opened
    // to gain root access. These have 32 GB of RAM
    var servers1Port = ["neo-net",
                        "zer0",
                        "max-hardware",
                        "iron-gym"];

    // Copy our scripts onto each server that requires 0 ports
    // to gain root access. Then use nuke() to gain admin access and
    // run the scripts.
    for (var i = 0; i < servers0Port.length; ++i) {
        var serv = servers0Port[i];

        scp("early-hack-template.script", serv);
        nuke(serv);
        exec("early-hack-template.script", serv, 6);
    }

    // Wait until we acquire the "BruteSSH.exe" program
    while (!fileExists("BruteSSH.exe")) {
        sleep(60000);
    }

    // Copy our scripts onto each server that requires 1 port
    // to gain root access. Then use brutessh() and nuke()
    // to gain admin access and run the scripts.
    for (var i = 0; i < servers1Port.length; ++i) {
        var serv = servers1Port[i];

        scp("early-hack-template.script", serv);
        brutessh(serv);
        nuke(serv);
        exec("early-hack-template.script", serv, 12);
    }

Random Tips
-----------
* Early on in the game, it's better to spend your money on upgrading RAM and purchasing
  new servers rather than spending it on Augmentations
* The more money available on a server, the more effective the :js:func:`hack` and
  :js:func:`grow` Netscript functions will be. This is because both of these functions
  use percentages rather than flat values. :js:func:`hack` steals a percentage of a server's
  total available money, and :js:func:`grow` increases a server's money by X%.
* There is a limit to how much money can exist on a server. This value is different for each
  server. The :js:func:`getServerMaxMoney` function will tell you this maximum value.
* At this stage in the game, your combat stats (strength, defense, etc.) are not nearly
  as useful as your hacking stat. Do not invest too much time or money into gaining combat
  stat exp.



.. Substitution definitions
.. |Alpha Enterprises|      replace:: :code:`Alpha Enterprises`
.. |Augmentations tab|      replace:: :code:`Augmentations` tab
.. |AutoLink|               replace:: :code:`AutoLink.exe`
.. |BruteSSH|               replace:: :code:`BruteSSH.exe`
.. |City tab|               replace:: :code:`City` tab
.. |CyberSec|               replace:: :code:`CyberSec`
.. |CyberSec faction|       replace:: :code:`CyberSec` :ref:`faction <gameplay_factions>`
.. |Factions tab|           replace:: :code:`Factions` tab
.. |Keyboard shortcut|      replace:: :ref:`Keyboard shortcut <shortcuts>`
.. |NUKE|                   replace:: :code:`NUKE.exe`
.. |Terminal|               replace:: :code:`Terminal`
.. |n00dles|             replace:: :code:`n00dles`
.. |harakiri-sushi|         replace:: :code:`harakiri-sushi`
.. |hong-fang-tea|          replace:: :code:`hong-fang-tea`
.. |joesguns|               replace:: :code:`joesguns`
.. |nectar-net|             replace:: :code:`nectar-net`
.. |sigma-cosmetics|        replace:: :code:`sigma-cosmetics`

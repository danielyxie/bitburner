.. _shortcuts:

Keyboard Shortcuts
==================
This page documents the various keyboard shortcuts that can be used in the game.

Game Navigation
---------------
These are used to switch between the different menus/tabs in the game.
These shortcuts are almost always available. Exceptions include:

* Working at a company or for a faction
* Creating a program
* Taking a university class
* Training at a gym
* Active Mission (aka Hacking Mission)

========== ===========================================================================
Shortcut   Action
========== ===========================================================================
Alt + t    Switch to :ref:`terminal`
Alt + c    Switch to 'Stats' page
Alt + e    Switch to Script Editor. Will open up the last-edited file or a new file
Alt + s    Switch to 'Active Scripts' page
Alt + h    Switch to 'Hacknet Nodes' page
Alt + w    Switch to 'City' page
Alt + j    Go to the company where you are employed ('Job' page on navigation menu)
Alt + r    Go to Travel Agency in current City ('Travel' page on navigation menu)
Alt + p    Switch to 'Create Program' page
Alt + f    Switch to 'Factions' page
Alt + a    Switch to 'Augmentations' page
Alt + u    Switch to 'Tutorial' page
Alt + o    Switch to 'Options' page
========== ===========================================================================

Script Editor
-------------
These shortcuts are available only in the Script Editor

============= ===========================================================================
Shortcut      Action
============= ===========================================================================
Ctrl + b      Save script and return to :ref:`terminal`
Ctrl + space  Function autocompletion
============= ===========================================================================

In the Script Editor you can configure your key binding mode to three preset options:

* `Ace <https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts>`_
* Vim
* Emacs

Terminal Shortcuts
------------------
These shortcuts are available only in the :ref:`terminal`

============= ===========================================================================
Shortcut      Action
============= ===========================================================================
Up/Down arrow Cycle through previous commands
Ctrl + c      Cancel a hack/analyze action
Ctrl + l      Clear screen
Tab           Autocomplete command
============= ===========================================================================

Terminal Bash Shortcuts
-----------------------
These shortcuts were implemented to better emulate a bash shell. They must be enabled
in your :ref:`terminal`'s *.fconf* file. This can be done be entering the Terminal command::

    nano .fconf

and then setting the *ENABLE_BASH_HOTKEYS* option to 1.

**Note that these Bash shortcuts override any other shortcuts defined in the game (unless otherwise noted),
as well as your browser's shortcuts**

**Also note that more Bash-like shortcuts will be implemented in the future**

============= ===========================================================================
Shortcut      Action
============= ===========================================================================
Ctrl + c      Clears current Terminal input (does NOT override default Ctrl + c command)
Ctrl + p      Same as Up Arrow
Ctrl + m      Same as Down Arrow
Ctrl + a      Move cursor to beginning of line (same as 'Home' key)
Ctrl + e      Move cursor to end of line (same as 'End' key)
Ctrl + b      Move cursor to previous character
Alt + b       Move cursor to previous word
Ctrl + f      Move cursor to next character
Alt + f       Move cursor to next word
Ctrl + h/d    Delete previous character ('Backspace')
============= ===========================================================================

Misc Shortcuts
--------------
============= ===========================================================================
Shortcut      Action
============= ===========================================================================
Esc           Close a script's log window
============= ===========================================================================

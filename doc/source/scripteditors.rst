.. _scripteditors:

Script Editors
==============
Third-party libraries are used to implement the game's Script Editor(s). There are
currently two options for the Script Editor:

* `Ace <https://ace.c9.io/>`_
* `CodeMirror <https://codemirror.net/>`_

You can select which of the two editors you want to use on the Script Editor page
('Create Script' on the main menu). 

Ace was the game's original Script Editor, while CodeMirror was added later in
v0.43.0. The two editors share many of the same features, so there is not a significant
difference between the two. Currently, CodeMirror is slightly more modern,
more customizable, and has a few quality-of-life improvements compared to Ace.

Universal Key Bindings
----------------------
These keyboard shortcuts are available in both the Ace and CodeMirror editors, regardless
of what key binding option you are using:

============= ===========================================================================
Shortcut      Action
============= ===========================================================================
Ctrl + b      Save script and return to :ref:`terminal`
Ctrl + space  Show Autocomplete Hints
============= ===========================================================================

.. _scripteditor_linter:

Linter
------
Both script editors contain a linter, which is a tool that analyzes your
code and flags anything it thinks might be an error. You can see
warnings and errors from the linter on the left-hand side of the script editor. There
will be an icon on whatever lines the linter thinks might be problematic. Hovering
over the icon will display information on what the issue is.

Note that **just because the linter shows an error/warning, this does NOT automatically mean that**
**your script is broken and will fail to run.** This is especially true if you are using
:ref:`netscriptjs`. The linter used by the script editors isn't necessarily perfect or
up-to-date. Furthermore, the linter does not affect anything when you actually run scripts.

Ace
---
The following documents what the different settings/options do for the Ace editor,
as well as the different key binding settings. Note that the
information for the key bindings may not be completely comprehensive. You'll
have to dig into the editor source code if you want to learn more.

Settings
~~~~~~~~

===================== ===========================================================================================================
Setting               Effect
===================== ===========================================================================================================
Theme                 Switch between different color schemes
Key Binding           Switch between different key binding options. This changes what keyboard shortcuts are available
Highlight Active Line When enabled, the line on which the cursor currently resides will be highlighted.
Show Invisibles       When enabled, you will be able to view hidden whitespace characters such as spaces, tabs, and newlines.
Use Soft Tab          When enabled, tabs will be replaced with spaces
Max Error Count       Specifies the (approximate) number of lines that will be linted
===================== ===========================================================================================================

Ace Key Bindings
~~~~~~~~~~~~~~~~
For Ace, the "Ace" Key Binding setting uses the default configuration. A list of these
`can be found here <https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts>`_.

Vim Key Bindings
~~~~~~~~~~~~~~~~
For Ace, the "Vim" Key Binding setting configures the editor to use
`Vim <https://en.wikipedia.org/wiki/Vim_(text_editor)>`_ key mappings. Note that while this tries
to emulate Vim features as faithfully as possible, it is not a complete Vim implementation.

Since I'm not familiar with Vim, I'll leave
`Ace's Vim Mode implementation here <https://github.com/ajaxorg/ace/blob/96088d0fc292daf0706b2d029cc03c3799be5974/lib/ace/keyboard/vim.js#L860>`_,
which I believe shows most of the implemented features.

Note that the following Vim Ex commands will properly save the script and/or quit the editor in game:

======= ==============================================
Command Effect
======= ==============================================
:w      Save the script and return to :ref:`terminal`
:q      Return to :ref:`terminal` **WITHOUT** saving
:x      Save the script and return to :ref:`terminal`
:wq     Save the script and return to :ref:`terminal`
======= ==============================================

Emacs Key Bindings
~~~~~~~~~~~~~~~~~~
For Ace, the "Emacs" Key Binding setting configures the editor to use
`Emacs <https://en.wikipedia.org/wiki/Emacs>`_ key mappings. Note that while this tries
to emulate the Emacs key mappings as faithfully as possible, it won't necessarily be a
complete implementation.

Since I'm not familiar with Emacs, I'll leave
`Ace's Emacs Mode implementation here <https://github.com/ajaxorg/ace/blob/96088d0fc292daf0706b2d029cc03c3799be5974/lib/ace/keyboard/emacs.js#L343>`_,
which I believe shows most of the implemented features.

CodeMirror
----------
The following documents what the different settings/options do for the CodeMirror editor,
as well as the shortcuts for the different key binding settings. Note that the
information for the key bindings may not be completely comprehensive. You'll
have to dig into the editor source code if you want to learn everything.

Settings
~~~~~~~~
========================== ===========================================================================================================
Setting                    Effect
========================== ===========================================================================================================
Theme                      Switch between different color schemes
Key Binding                Switch between different key binding options. This changes what keyboard shortcuts are available
Highlight Active Line      When enabled, the line on which the cursor currently resides will be highlighted.
Show Invisibles            When enabled, you will be able to view hidden whitespace characters such as spaces, tabs, and newlines.
Use Soft Tab               When enabled, tabs will be replaced with spaces
Auto-Close Brackets/Quotes When enabled, any opening brackets or quotes that are typed will be closed
Enable Linting             Enable/Disable the :ref:`scripteditor_linter`
Continue Comments          When enabled, pressing 'Enter' inside a comment block will continue the comment on the next line
========================== ===========================================================================================================

Default Key Bindings
~~~~~~~~~~~~~~~~~~~~
.. todo:: Fill out

Sublime Key Bindings
~~~~~~~~~~~~~~~~~~~~
.. todo:: Fill out

Vim Key Bindings
~~~~~~~~~~~~~~~~
.. todo:: Fill out

Emacs Key Bindings
~~~~~~~~~~~~~~~~~~
.. todo:: Fill out

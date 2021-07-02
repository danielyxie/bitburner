exit() Netscript Function
=========================

.. js:function:: exit()

    :RAM cost: 0 GB

    Terminates the current script immediately.

    .. warning:: In :ref:`netscriptjs`, execution may continue past a call to
        this function; while some game-related functions (e.g. those with an
        ``ns.`` prefix) will not function after this function has been called,
        there might still be unintended behavior if you assume ``exit`` will
        immediately halt execution, like it does in :ref:`netscript1`. To be
        safe, you should probably ``return`` from the main function instead
        of/in addition to calling ``ns.exit()`` when halting a NetscriptJS
        script.

atExit() Netscript Function
============================

.. js:function:: atExit(f)

    :RAM cost: 0 GB
    :param function f: function to call when the script dies.

    Runs when the script dies.

    Example:

    .. code-block:: javascript

        function onDeath() {
            console.log('I died!!!')
        }
        atExit(onDeath);

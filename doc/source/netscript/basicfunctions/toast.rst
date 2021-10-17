toast() Netscript Function
============================

.. js:function:: toast(message[, variant])

    :RAM cost: 0 GB
    :param string message: message to display
    :param success|info|warning|error variant: color of the toast

    Spawns a toast (those bottom right notifications).

    Example:

    .. code-block:: javascript

        toast("Reached $1b");
        toast("Failed to hack home", "error");

charge() Netscript Function
=======================================

.. js:function:: charge(worldX, worldY)

    :RAM cost: 0.4 GB
    :param int worldX: World X of the fragment to charge.
    :param int worldY: World Y of the fragment to charge.

    Charge a fragment, increasing it's power but also it's heat. The
    effectiveness of the charge depends on the amount of ram the running script
    consumes as well as the fragments current heat. This operation takes time to
    complete.

    Example:

    .. code-block:: javascript
        charge(0, 4); // Finishes 5 seconds later.
.. warning::

    Netscript JS users: This function is `async`
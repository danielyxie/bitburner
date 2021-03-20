deleteAt() Netscript Function
=======================================

.. js:function:: deleteAt(worldX, worldY)

    :RAM cost: 0.15 GB
    :param int worldX: World X coordinate of the fragment to delete.
    :param int worldY: World Y coordinate of the fragment to delete.
    :returns: `true` if the fragment was deleted. `false` otherwise.

    Delete the fragment located at `[worldX, worldY]`.

    Example:

    .. code-block:: javascript

        deleteAt(0, 4); // returns true


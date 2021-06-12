canPlace() Netscript Function
=======================================

.. js:function:: canPlace(worldX, worldY, fragmentId)

    :RAM cost: 0.5 GB
    :param int worldX: World X against which to align the top left of the fragment.
    :param int worldY: World Y against which to align the top left of the fragment.
    :param int fragmentId: ID of the fragment to place.
    :returns: `true` if the fragment can be placed at that position. `false` otherwise.

    Example:

    .. code-block:: javascript

        canPlace(0, 4, 17); // returns true

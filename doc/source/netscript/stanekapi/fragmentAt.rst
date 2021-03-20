fragmentAt() Netscript Function
=======================================

.. js:function:: fragmentAt(worldX, worldY)

    :RAM cost: 2 GB
    :param int worldX: World X coordinate of the fragment.
    :param int worldY: World Y coordinate of the fragment.
    :returns: The fragment located at `[worldX, worldY]` in Stanek's Gift, or null.

    .. code-block:: typescript

        {
            // In world coordinates
            x: number;
            y: number;

            heat: number;
            charge: number;
            id: number;
            shape: boolean[][];
            type: string;
            magnitude: number;
            limit: number;
        }

    Example:

    .. code-block:: javascript

        var fragment = fragmentAt(0, 4);
        print(fragment); // {'heat': 50, 'charge': 98}


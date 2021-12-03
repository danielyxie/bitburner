placedFragments() Netscript Function
=======================================

.. js:function:: placedFragments()

    :RAM cost: 5 GB
    :returns: The list of all fragment that are embedded in Stanek's Gift.

    .. code-block:: typescript
        [
            {
                // In world coordinates
                x: number;
                y: number;
                charge: number;
                id: number;
                shape: boolean[][];
                type: string;
                power: number;
                limit: number;
            }
        ]
    Example:

    .. code-block:: javascript
        var myFragments = placedFragments();

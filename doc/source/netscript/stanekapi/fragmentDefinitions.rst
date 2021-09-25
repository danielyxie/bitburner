fragmentDefinitions() Netscript Function
=======================================

.. js:function:: fragmentDefinitions()

    :RAM cost: 0 GB
    :returns: The list of all fragment that can be embedded in Stanek's Gift.

    .. code-block:: typescript
        [
            {
                id: number;
                shape: boolean[][];
                type: string;
                magnitude: number;
                limit: number;
            }
        ]
    Example:

    .. code-block:: javascript
        var fragments = fragmentDefinitions();
        print(fragment); // prints all possible fragments

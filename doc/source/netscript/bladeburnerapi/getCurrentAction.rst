getCurrentAction() Netscript Function
=====================================

.. js:function:: getCurrentAction()

    :RAM cost: 1 GB
    :returns: An object that represents the player's current Bladeburner action.

    Result::

        {
            type: Type of Action
            name: Name of Action
        }

    If the player is not performing an action, the function will return an object
    with the 'type' property set to "Idle".

    Example:

    .. code-block:: javascript

        action = bladeburner.getCurrentAction();
        print(action.type); // "Contracts"
        print(action.name); // "Tracking"

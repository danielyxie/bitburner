getCurrentAction() Netscript Function
=====================================

.. js:function:: getCurrentAction()

    :RAM cost: 1 GB

    Returns an object that represents the player's current Bladeburner action::

        {
            type: Type of Action
            name: Name of Action
        }

    If the player is not performing an action, the function will return an object
    with the 'type' property set to "Idle".

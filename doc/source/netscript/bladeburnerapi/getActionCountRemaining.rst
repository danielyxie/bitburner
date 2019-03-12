getActionCountRemaining() Netscript Function
============================================

.. js:function:: getActionCountRemaining(type, name)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match

    Returns the remaining count of the specified action.

    Note that this is meant to be used for Contracts and Operations.
    This function will return 'Infinity' for actions such as Training and Field Analysis.
    This function will return 1 for BlackOps not yet completed regardless of wether the player has the required rank to attempt the mission or not.

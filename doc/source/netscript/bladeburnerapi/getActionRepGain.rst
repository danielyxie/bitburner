getActionRepGain() Netscript Function
=====================================

.. js:function:: getActionRepGain(type, name[, level=current level])

    :RAM cost: 4 GB
    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :param number level: Optional action level at which to calculate the gain.
    :returns: Average Bladeburner reputation gain for successfully completing
        the specified action. Note that this value is an 'average' and the real
        reputation gain may vary slightly from this value.

    Example:

    .. code-block:: javascript

        bladeburner.getActionRepGain("Contracts", "Tracking"); // returns: 341
getEquipmentCost() Netscript Function
=====================================

.. js:function:: getEquipmentCost(equipName)

    :RAM cost: 2 GB

    :param string equipName: Name of equipment

    Get the amount of money it takes to purchase a piece of Equipment or an Augmentation.
    If an invalid Equipment/Augmentation is specified, this function will return Infinity.

    :returns: Cost to purchase the specified Equipment/Augmentation (number). Infinity
             for invalid arguments

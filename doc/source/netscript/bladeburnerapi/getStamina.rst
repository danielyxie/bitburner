getStamina() Netscript Function
===============================

.. js:function:: getStamina()

    :RAM cost: 4 GB
    :returns: Array with two elements [Current stamina, Max stamina]

    Example:

    .. code-block:: javascript

            res = bladeburner.getStamina();
            percentage = res[0] / res[1];

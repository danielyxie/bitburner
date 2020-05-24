getStamina() Netscript Function
===============================

.. js:function:: getStamina()
    :RAM cost: 4 GB

    Returns an array with two elements:

        [Current stamina, Max stamina]

    Example usage::

        function getStaminaPercentage() {
            let res = bladeburner.getStamina();
            return res[0] / res[1];
        }

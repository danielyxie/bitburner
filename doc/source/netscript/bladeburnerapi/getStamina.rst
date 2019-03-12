getStamina() Netscript Function
===============================

.. js:function:: getStamina()

    Returns an array with two elements:

        [Current stamina, Max stamina]

    Example usage::

        function getStamina() {
            let res = bladeburner.getStamina();
            return res[0] / res[1];
        }

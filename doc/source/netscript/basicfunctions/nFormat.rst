nFormat() Netscript Function
============================

.. js:function:: nFormat(n, format)

    :param number n: Number to format
    :param string format: Formatter
    :RAM cost: 0 GB

    Converts a number into a string with the specified formatter. This uses the
    `numeraljs <http://numeraljs.com/>`_ library, so the formatters must be compatible
    with that.

    This is the same function that the game itself uses to display numbers.

    Examples::

        nFormat(1.23e9, "$0.000a"); // Returns "$1.230b"
        nFormat(12345.678, "0,0");  // Returns "12,346"
        nFormat(0.84, "0.0%");      // Returns "84.0%

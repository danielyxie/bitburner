nFormat() Netscript Function
============================

.. js:function:: nFormat(n, format)

    :RAM cost: 0 GB
    :param number n: number to format
    :param string format: The format to use.

    Converts a number into a string with the specified format. This uses the
    `numeraljs <http://numeraljs.com/>`_ library, so the formatters must be
    compatible with that.

    The game uses the ``$0.000a`` format to display money.

    Example:

    .. code-block:: javascript

        nFormat(1.23e9, "$0.000a"); // returns: "$1.230b"
        nFormat(12345.678, "0,0");  // returns: "12,346"
        nFormat(0.84, "0.0%");      // returns: "84.0%"

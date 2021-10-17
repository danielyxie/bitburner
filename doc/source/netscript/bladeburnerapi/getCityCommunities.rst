getCityCommunities() Netscript Function
================================================

.. js:function:: getCityCommunities(cityName)

    :RAM cost: 4 GB
    :param string cityName: Name of city. Case-sensitive
    :returns: Confirmed number of Synthoid communities in the specified city,
        or -1 if an invalid city was specified.

    Example:

    .. code-block:: javascript

        bladeburner.getCityCommunities("Sector-12"); // returns: 76
hackAnalyzeThreads() Netscript Function
=======================================

.. js:function:: hackAnalyzeThreads(hostname, hackAmount)

    :RAM cost: 1 GB
    :param string hostname: Hostname of server to analyze.
    :param number hackAmount: Amount of money you want to hack from the server.
    :returns: The number of threads needed to :doc:`hack<hack>` the server for
        ``hackAmount`` money.

    This function returns the number of script threads you need when running
    the :doc:`hack<hack>` command to steal the specified amount of money from
    the target server.

    If ``hackAmount`` is less than zero or greater than the amount of money
    available on the server, then this function returns -1.

    For example, let's say the 'foodnstuff' server has $10m and you run:

    .. code-block:: javascript

        hackAnalyzeThreads("foodnstuff", 1e6);

    If this function returns 50, this means that if your next :doc:`hack<hack>` call
    is run on a script with 50 threads, it will steal $1m from the `foodnstuff` server.

    .. warning:: The value returned by this function isn't necessarily a whole number.
    .. warning:: It is possible for this function to return :code:`Infinity` or :code:`NaN` in
                 certain uncommon scenarios. This is because in JavaScript:

                 * :code:`0 / 0 = NaN`
                 * :code:`N / 0 = Infinity` for 0 < N < Infinity.

                 For example, if a server has no money available and you want to hack some positive
                 amount from it, then the function would return :code:`Infinity` because
                 this would be impossible.

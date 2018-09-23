.. _netscriptcodingcontractapi:

Netscript Coding Contract API
=============================
Netscript provides the following API for interacting with
:ref:`codingcontracts`.

**The Coding Contract API must be accessed through the 'codingcontract' namespace**

In :ref:`netscript1`::

    codingcontract.getDescription("foo.cct", "home");
    codingcontract.attempt(1, "foo.cct", "foodnstuff");

In :ref:`netscriptjs`::

    ns.codingcontract.getDescription("foo.cct", "home");
    ns.codingcontract.attempt(1, "foo.cct", "foodnstuff");

attempt
-------

.. js:function:: attempt(answer, fn[, hostname/ip=current ip])

    :param answer: Solution for the contract
    :param string fn: Filename of the contract
    :param string hostname/ip: Hostname or IP of the server containing the contract.
                               Optional. Defaults to current server if not provided

    Attempts to solve the Coding Contract with the provided solution.

    :returns: Boolean indicating whether the solution was correct

getDescription
--------------

.. js:function:: getDescription(fn[, hostname/ip=current ip])

    :param string fn: Filename of the contract
    :param string hostname/ip: Hostname or IP of the server containing the contract.
                               Optional. Defaults to current server if not provided

    Get the full text description for the problem posed by the Coding Contract

    :returns: A string with the contract's text description

getData
-------

.. js:function:: getData(fn[, hostname/ip=current ip])

    :param string fn: Filename of the contract
    :param string hostname/ip: Hostname or IP of the server containing the contract.
                               Optional. Defaults to current server if not provided

    Get the data associated with the specific Coding Contract. Note that this is
    not the same as the contract's description. This is just the data that
    the contract wants you to act on in order to solve

    :returns: The specified contract's data

getNumTriesRemaining
--------------------

.. js:function:: getNumTriesRemaining(fn[, hostname/ip=current ip])

    :param string fn: Filename of the contract
    :param string hostname/ip: Hostname or IP of the server containing the contract.
                               Optional. Defaults to current server if not provided

    Get the number of tries remaining on the contract before it
    self-destructs.

    :returns: Number indicating how many attempts are remaining

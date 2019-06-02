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

.. toctree::

    attempt() <codingcontractapi/attempt>
    getContractType() <codingcontractapi/getContractType>
    getDescription() <codingcontractapi/getDescription>
    getData() <codingcontractapi/getData>
    getNumTriesRemaining() <codingcontractapi/getNumTriesRemaining>

.. _netscript1:

Netscript 1.0
=============
Netscript 1.0 is implemented using modified version of Neil Fraser's
`JS-Interpreter <https://github.com/NeilFraser/JS-Interpreter>`_.

This interpreter was created for ES5, which means that the code written
for Netscript 1.0 must be compliant for that version. However, some additional
ES6+ features are implemented through polyfills.

Netscript 1.0 scripts end with the ".script" extension.

Which ES6+ features are supported?
----------------------------------

Netscript 1.0 is a ES5 interpreter, but the following features from versions ES6 and
above are supported as well.

If there is an additional ES6+ feature you would like to see implemented with a polyfill,
feel free to `open an issue <https://github.com/danielyxie/bitburner/issues>`_ (and provide
the polyfill if possible).

* import - See :ref:`netscriptimporting`
* `Array <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array>`_
    * `find() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find>`_
    * `findIndex() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex>`_
    * `includes() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes>`_
* `String <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>`_
    * `endsWith() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith>`_
    * `includes() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes>`_
    * `startsWith() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith>`_

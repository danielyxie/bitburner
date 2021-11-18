.. _netscript1:

Netscript 1.0
=============
Netscript 1.0 is implemented using a modified version of Neil Fraser's
`JS-Interpreter <https://github.com/NeilFraser/JS-Interpreter>`_.

This is an ES5 JavaScript interpreter. This means that (almost) any JavaScript feature
that is available in ES5 is also available in Netscript 1.0. However, this also means
that the interpreter does not natively support any JavaScript features introduced in versions
ES6 or after.

If you are confused by the ES5/ES6/etc. terminology, consider reading this:
`WTF is ES6, ES8, ES2017, ECMAScript... <https://codeburst.io/javascript-wtf-is-es6-es8-es-2017-ecmascript-dca859e4821c>`_

Netscript 1.0 scripts end with the ".script" extension in their filenames.

Which ES6+ features are supported?
----------------------------------

Netscript 1.0 is a ES5 interpreter, but the following features from versions ES6 and
above are supported as well.

* import - See :ref:`netscriptimporting`
* `Array <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array>`_
* `Array find() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find>`_
* `Array findIndex() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex>`_
* `Array includes() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes>`_
* `String <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>`_
* `String endsWith() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith>`_
* `String includes() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes>`_
* `String startsWith() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith>`_

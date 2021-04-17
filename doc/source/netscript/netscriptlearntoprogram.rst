.. _netscriptlearntoprogram:

Learn to Program in Netscript
=============================
Netscript is simply a subset of
`JavaScript <https://developer.mozilla.org/en-US/docs/Web/JavaScript>`_,
with some additional functions added in to allow interaction with the game.

For Beginner Programmers
------------------------
If you have little to no programming experience, that's okay! You don't need to be
a great programmer in order to enjoy or play this game. In fact, this game could
help you learn some basic programming concepts.

Here are some good tutorials for learning programming/JavaScript as a beginner:

* `Learn-JS <http://www.learn-js.org/en/Welcome>`_
* `Speaking JavaScript <http://speakingjs.com/es5/index.html>`_
   This is a bit on the longer side. You can skip all of the historical
   background stuff. Recommended chapters: 1, 7-18

For Experienced Programmers
---------------------------
The following section lists several good tutorials/resources for those who have experience
programming but who have not worked extensively with JavaScript before.

Before that, however, it's important to clarify some terminology about the different
versions of JavaScript. These are summarized in this article:

`WTF is ES6, ES8, ES2017, ECMAScript... <https://codeburst.io/javascript-wtf-is-es6-es8-es-2017-ecmascript-dca859e4821c>`_

An important takeaway from this article is that ES6, also known as ES2015, introduced
many major features that are commonly seen in modern JavaScript programming. However, this
means that ES5 engines and interpreters will fail if they encounters these ES6 features. You'll see why this
is important further down.

* `MDN Introduction to JS <https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript>`_
* `Eloquent JavaScript (ES6+) <http://eloquentjavascript.net/>`_
   Recommended Chapters: Introduction, 1-6
* `Modern Javascript Tutorial (ES6+) <https://javascript.info/>`_
   Recommended Chapters: 2, 4-6

Netscript 1.0 vs Netscript 2.0
------------------------------
There are two versions of Netscript:

* :doc:`netscript1`
* :doc:`netscriptjs`

Visit the pages above to get more details about each version. If you are new
to programming or unfamiliar with JavaScript, I would recommend starting out
with :doc:`netscript1`. Experienced web developers can use :doc:`netscriptjs`
to take advantage of faster speeds and additional features.

Here is a short summary of the differences between Netscript 1.0 and Netscript 2.0:

**Netscript 1.0**

* ES5
* Some ES6 features implemented with polyfills
* Slow compared to NetscriptJS (interpreter runs at the "Netscript Exec Time" speed configured in options)
* Compatible with all browsers

**Netscript JS (Netscript 2.0)**

* Supports (almost) all features of modern JavaScript
* Extremely fast - code is executed as an Async Function
* Compatible with most modern browsers.
* Each script becomes a module and therefore all instances of that script can easily
  share data between each other (essentially global/static variables)

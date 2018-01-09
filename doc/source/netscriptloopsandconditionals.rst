Netscript Loops and Conditionals
================================


Loops and Conditionals
----------------------

Netscript loops and conditionals are the same as Javascript. However, the one caveat is that when declaring variables such as the
iterator for traversing a loop, you should not use the 'var' or 'let' keyword. For reference, you can see the Javascript
documentation for loops/conditionals here:

`While loops <https://www.w3schools.com/js/js_loop_while.asp>`_

`For loops <https://www.w3schools.com/js/js_loop_for.asp>`_

`Conditionals (If/Else statements) <https://www.w3schools.com/js/js_if_else.asp>`_

Here are some simple code examples that show the use of loops and conditionals in Netscript.

The following is a while loop that runs the hack() Netscript function ten times::

    i = 0;
    while (i < 10) {
        hack('foodnstuff');
        i = i + 1;
    }

The following is a for loop that runs the hack() Netscript function ten times::

    for (i = 0; i < 10; ++i) {
        hack("foodnstuff");
    }

The following is a conditional that uses the getServerMoneyAvailable() Netscript function to check how much money
exists on the 'foodnstuff' server. If there is more than $200,000 on the server, then the server will be hacked.
Otherwise, the money available on the server will be grown using the grow() Netscript function::

    if (getServerMoneyAvailable('foodnstuff') > 200000) {
        hack("foodnstuff");
    } else {
        grow("foodnstuff");
    }

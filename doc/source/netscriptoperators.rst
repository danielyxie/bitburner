Netscript Operators
===================

Operators
---------

Binary Operators
^^^^^^^^^^^^^^^^

Binary operators require two operands and produce a result based on their values. In general, binary
operators do not change the value of the operands.

=========== =========================== ==============================================================
Operator    Name                        Example/Comments
=========== =========================== ==============================================================
=           Assignment                  i = 5 would assign the value 5 to the variable i
\+          Addition                    5 + 12 would return 17
\-          Subtraction                 20 - 8 would return 12
\*          Multiplication              4 * 5 would return 20
\/          Division                    50 / 10 would return 5
%           Modulo                      50 % 9 would return 5
&&          Logical AND                 true && false would return false
||          Logical OR                  true || false would return true
<           Less than                   4 < 5 would return true
>           Greater than                4 > 5 would return false
<=          Less than or equal to       5 <= 5 would return true
>=          Greater than or equal to    5 >= 4 would return true
==          Equality                    1 == 1 would return true
!=          Inequality                  4 != 5 would return true
===         Strict equality             1 === "1" would return false
!==         Strict inequality           1 !== "1" would return true
=========== =========================== ==============================================================

Unary Operators
^^^^^^^^^^^^^^^

Unary operators require only a single operand and produce a result based on their values. Some unary operators will
change the value of their operands. For example::

    i = 0;
    ++i;

Running the pre-increment unary operator (++) in the code above changes the value of the variable i.


=============== =========================== ==============================================================================================
Operator        Name                        Example/comments
=============== =========================== ==============================================================================================
!               Logical NOT operator        !true would return false, and !false would return true. Does not change operand's value
\-              Negation                    Negates a number. Only works for numerics. Does not change operand's value
++              Pre-increment               ++i or i++. WARNING: This only pre-increments, even if you put i++. Changes operand's value
--              Pre-decrement               --i or i--. WARNING: This only pre-decrements, even if you put i--. Changes operand's value
=============== =========================== ==============================================================================================

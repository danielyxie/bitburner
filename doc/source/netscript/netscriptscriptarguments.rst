.. _netscript_script_arguments:

Netscript Script Arguments
==========================

Arguments passed into a script can be accessed in Netscript using a
special array called *args*. The arguments can be
accessed using a normal array using the [] operator
(args[0], args[1], etc...).

For example, let's say we want to make a generic script
'generic-run.script' and we plan to pass two arguments into that script.
The first argument will be the name of another script, and the second
argument will be a number. This generic script will run the
script specified in the first argument with the amount of threads
specified in the second element. The code would look like::

    run(args[0], args[1]);

It is also possible to get the number of arguments that was passed
into a script using::

    args.length

**WARNING: Do not try to modify the args array. This will break the game.**


example for accessing arguments in ns2 from terminal execution:
terminal command:
run name_of_script.js -t 10 --tail argument1 argument2

ns2 script:

const args_obj = arguments[0]
const argument1 = (args_obj.server.args[0])
const argument2 = (args_obj.server.args[1])

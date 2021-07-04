flags() Netscript Function
============================

.. js:function:: flags(data)

    :RAM cost: 0 GB
    :param data array of pairs of strings: Flags definition.
    :returns: Object containing all the flags that were parsed or default.

    This function allows for a more flexible way of parsing script arguments
    than to just pass a fixed list in a fixed order. Options can be given
    names, and passed in any order, while having defined default values.

    The flag definition is an array of pairs of values: the first value is the
    name of the flag, and the 2nd value is the default value for that flag.

    The return object is a map containing flag names to the value. It also 
    contains the special field '_', which contains all arguments that were not
    flags.

    Example:

    .. code-block:: javascript

        // example.script
        var data = flags([
            ['delay', 0], // a default number means this flag is a number
            ['server', 'foodnstuff'], //  a default string means this flag is a string
            ['exclude', []], // a default array means this flag is a default array of string
            ['help', false], // a default boolean means this flag is a boolean
        ]);
        tprint(data);
        /*
        [home ~/]> run example.script
        {"_":[],"delay":0,"server":"foodnstuff","exclude":[],"help":false}
        [home ~/]> run example.script --delay 3000
        {"_":[],"server":"foodnstuff","exclude":[],"help":false,"delay":3000}
        [home ~/]> run example.script --delay 3000 --server harakiri-sushi
        {"_":[],"exclude":[],"help":false,"delay":3000,"server":"harakiri-sushi"}
        [home ~/]> run example.script --delay 3000 --server harakiri-sushi hello world
        {"_":["hello","world"],"exclude":[],"help":false,"delay":3000,"server":"harakiri-sushi"}
        [home ~/]> run example.script --delay 3000 --server harakiri-sushi hello world --exclude a --exclude b
        {"_":["hello","world"],"help":false,"delay":3000,"server":"harakiri-sushi","exclude":["a","b"]}
        [home ~/]> run example.script --help
        {"_":[],"delay":0,"server":"foodnstuff","exclude":[],"help":true}
        */

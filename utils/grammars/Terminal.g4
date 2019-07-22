grammar Terminal;

commandSequence
    :   command ENDOFCOMMAND?
    |   command ENDOFCOMMAND commandSequence
    ;

command 
    : commandName commandArgList? // sycbskreuy "afbu'a" 'test' -e h3h3 --uheueheu ./hshshh12!ncu.exe;
    ;

commandName
    : WORD
    ;

commandArgList
    : commandArg
    | commandArgList commandArg
    ;

commandArg
    : value
    | keyvalue
    ;

value
    : DQSTRING      // "string"
    | SQSTRING      // 'string'
    | LONGFLAG      // --flag
    | SHORTFLAG     // -f
    | NUMBER        // [0-9]+('.'[0-9]+)
    | WORD          // dd2783diag3g,.\'dnejsi ...
    ;

keyvalue
    : key ASSIGN value
    ;

key
    : WORD
    ;


ENDOFCOMMAND: (';'|'\r'? '\n')+;

// from https://stackoverflow.com/questions/2821043/allowed-characters-in-linux-environment-variable-names


ASSIGN : '=';

SHORTFLAG : '-' (CHAR|DIGIT);

LONGFLAG : '--' WORD;


fragment
CHAR : [a-zA-Z];

fragment
DIGIT: [0-9];

fragment
SPECIAL: ~([ \t\r\n0-9a-zA-Z]| '=');

ESCAPECHAR : '\\';
ESCAPEDSQCHAR : ESCAPECHAR '\'';
ESCAPEDDQCHAR : ESCAPECHAR '"';

SQCHAR : '\'';
DQCHAR : '"';

DQSTRING : DQCHAR .*? DQCHAR;
SQSTRING : SQCHAR .*? SQCHAR;

NUMBER: [0-9]+(|'.'[0-9]+);

WORD : (CHAR|DIGIT|SPECIAL)+;

WHITESPACE : [ \t\r\n] -> channel(HIDDEN);
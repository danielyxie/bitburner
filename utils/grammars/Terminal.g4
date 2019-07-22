grammar Terminal;

commandSequence
    :   command 
    |   commandSequence command
    |   EOF
    ;

command 
    : name=commandName args=commandArgList? ENDOFCOMMAND// sycbskreuy "afbu'a" 'test' -e h3h3 --uheueheu ./hshshh12!ncu.exe;
    ;

commandName
    : WORD      
    ;

commandArgList
    : commandArg 
    | commandArgList commandArg 
    ;

commandArg
    : value     #arg// val
    | keyvalue  #kwarg // a=b
    ;

value
    : DQSTRING    #DQString  // "string"
    | SQSTRING    #SQString  // 'string'
    | LONGFLAG    #LongFlag  // --flag
    | SHORTFLAG   #ShortFlag  // -f
    | NUMBER      #Number  // [0-9]+('.'[0-9]+)
    | WORD        #Word  // dd2783diag3g,.\'dnejsi ...
    ;

keyvalue
    : k=key ASSIGN v=value  //a=b
    ;

key
    : WORD        
    ;


ENDOFCOMMAND: (';'|'\r'? '\n')+|EOF;

// from https://stackoverflow.com/questions/2821043/allowed-characters-in-linux-environment-variable-names


ASSIGN : '=';

SHORTFLAG : '-' (CHAR|DIGIT);

LONGFLAG : '--' WORD;


fragment
CHAR : [a-zA-Z];

fragment
DIGIT: [0-9];

fragment
SPECIAL: ~([ \t\r\n0-9a-zA-Z]|'\''|'"'|'='|';');

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
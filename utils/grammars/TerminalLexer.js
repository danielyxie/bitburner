// Generated from Terminal.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');



var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002\u0010w\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004",
    "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t",
    "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010",
    "\t\u0010\u0004\u0011\t\u0011\u0004\u0012\t\u0012\u0003\u0002\u0003\u0002",
    "\u0005\u0002(\n\u0002\u0003\u0002\u0006\u0002+\n\u0002\r\u0002\u000e",
    "\u0002,\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0005\u00044\n\u0004\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\b",
    "\u0003\b\u0003\t\u0003\t\u0003\n\u0003\n\u0003\n\u0003\u000b\u0003\u000b",
    "\u0003\u000b\u0003\f\u0003\f\u0003\r\u0003\r\u0003\u000e\u0003\u000e",
    "\u0007\u000eO\n\u000e\f\u000e\u000e\u000eR\u000b\u000e\u0003\u000e\u0003",
    "\u000e\u0003\u000f\u0003\u000f\u0007\u000fX\n\u000f\f\u000f\u000e\u000f",
    "[\u000b\u000f\u0003\u000f\u0003\u000f\u0003\u0010\u0006\u0010`\n\u0010",
    "\r\u0010\u000e\u0010a\u0003\u0010\u0003\u0010\u0003\u0010\u0006\u0010",
    "g\n\u0010\r\u0010\u000e\u0010h\u0005\u0010k\n\u0010\u0003\u0011\u0003",
    "\u0011\u0003\u0011\u0006\u0011p\n\u0011\r\u0011\u000e\u0011q\u0003\u0012",
    "\u0003\u0012\u0003\u0012\u0003\u0012\u0004PY\u0002\u0013\u0003\u0003",
    "\u0005\u0004\u0007\u0005\t\u0006\u000b\u0002\r\u0002\u000f\u0002\u0011",
    "\u0007\u0013\b\u0015\t\u0017\n\u0019\u000b\u001b\f\u001d\r\u001f\u000e",
    "!\u000f#\u0010\u0003\u0002\u0006\u0004\u0002C\\c|\u0003\u00022;\t\u0002",
    "\u000b\f\u000f\u000f\"\"2;??C\\c|\u0005\u0002\u000b\f\u000f\u000f\"",
    "\"\u0002\u007f\u0002\u0003\u0003\u0002\u0002\u0002\u0002\u0005\u0003",
    "\u0002\u0002\u0002\u0002\u0007\u0003\u0002\u0002\u0002\u0002\t\u0003",
    "\u0002\u0002\u0002\u0002\u0011\u0003\u0002\u0002\u0002\u0002\u0013\u0003",
    "\u0002\u0002\u0002\u0002\u0015\u0003\u0002\u0002\u0002\u0002\u0017\u0003",
    "\u0002\u0002\u0002\u0002\u0019\u0003\u0002\u0002\u0002\u0002\u001b\u0003",
    "\u0002\u0002\u0002\u0002\u001d\u0003\u0002\u0002\u0002\u0002\u001f\u0003",
    "\u0002\u0002\u0002\u0002!\u0003\u0002\u0002\u0002\u0002#\u0003\u0002",
    "\u0002\u0002\u0003*\u0003\u0002\u0002\u0002\u0005.\u0003\u0002\u0002",
    "\u0002\u00070\u0003\u0002\u0002\u0002\t5\u0003\u0002\u0002\u0002\u000b",
    ":\u0003\u0002\u0002\u0002\r<\u0003\u0002\u0002\u0002\u000f>\u0003\u0002",
    "\u0002\u0002\u0011@\u0003\u0002\u0002\u0002\u0013B\u0003\u0002\u0002",
    "\u0002\u0015E\u0003\u0002\u0002\u0002\u0017H\u0003\u0002\u0002\u0002",
    "\u0019J\u0003\u0002\u0002\u0002\u001bL\u0003\u0002\u0002\u0002\u001d",
    "U\u0003\u0002\u0002\u0002\u001f_\u0003\u0002\u0002\u0002!o\u0003\u0002",
    "\u0002\u0002#s\u0003\u0002\u0002\u0002%+\u0007=\u0002\u0002&(\u0007",
    "\u000f\u0002\u0002\'&\u0003\u0002\u0002\u0002\'(\u0003\u0002\u0002\u0002",
    "()\u0003\u0002\u0002\u0002)+\u0007\f\u0002\u0002*%\u0003\u0002\u0002",
    "\u0002*\'\u0003\u0002\u0002\u0002+,\u0003\u0002\u0002\u0002,*\u0003",
    "\u0002\u0002\u0002,-\u0003\u0002\u0002\u0002-\u0004\u0003\u0002\u0002",
    "\u0002./\u0007?\u0002\u0002/\u0006\u0003\u0002\u0002\u000203\u0007/",
    "\u0002\u000214\u0005\u000b\u0006\u000224\u0005\r\u0007\u000231\u0003",
    "\u0002\u0002\u000232\u0003\u0002\u0002\u00024\b\u0003\u0002\u0002\u0002",
    "56\u0007/\u0002\u000267\u0007/\u0002\u000278\u0003\u0002\u0002\u0002",
    "89\u0005!\u0011\u00029\n\u0003\u0002\u0002\u0002:;\t\u0002\u0002\u0002",
    ";\f\u0003\u0002\u0002\u0002<=\t\u0003\u0002\u0002=\u000e\u0003\u0002",
    "\u0002\u0002>?\n\u0004\u0002\u0002?\u0010\u0003\u0002\u0002\u0002@A",
    "\u0007^\u0002\u0002A\u0012\u0003\u0002\u0002\u0002BC\u0005\u0011\t\u0002",
    "CD\u0007)\u0002\u0002D\u0014\u0003\u0002\u0002\u0002EF\u0005\u0011\t",
    "\u0002FG\u0007$\u0002\u0002G\u0016\u0003\u0002\u0002\u0002HI\u0007)",
    "\u0002\u0002I\u0018\u0003\u0002\u0002\u0002JK\u0007$\u0002\u0002K\u001a",
    "\u0003\u0002\u0002\u0002LP\u0005\u0019\r\u0002MO\u000b\u0002\u0002\u0002",
    "NM\u0003\u0002\u0002\u0002OR\u0003\u0002\u0002\u0002PQ\u0003\u0002\u0002",
    "\u0002PN\u0003\u0002\u0002\u0002QS\u0003\u0002\u0002\u0002RP\u0003\u0002",
    "\u0002\u0002ST\u0005\u0019\r\u0002T\u001c\u0003\u0002\u0002\u0002UY",
    "\u0005\u0017\f\u0002VX\u000b\u0002\u0002\u0002WV\u0003\u0002\u0002\u0002",
    "X[\u0003\u0002\u0002\u0002YZ\u0003\u0002\u0002\u0002YW\u0003\u0002\u0002",
    "\u0002Z\\\u0003\u0002\u0002\u0002[Y\u0003\u0002\u0002\u0002\\]\u0005",
    "\u0017\f\u0002]\u001e\u0003\u0002\u0002\u0002^`\t\u0003\u0002\u0002",
    "_^\u0003\u0002\u0002\u0002`a\u0003\u0002\u0002\u0002a_\u0003\u0002\u0002",
    "\u0002ab\u0003\u0002\u0002\u0002bj\u0003\u0002\u0002\u0002ck\u0003\u0002",
    "\u0002\u0002df\u00070\u0002\u0002eg\t\u0003\u0002\u0002fe\u0003\u0002",
    "\u0002\u0002gh\u0003\u0002\u0002\u0002hf\u0003\u0002\u0002\u0002hi\u0003",
    "\u0002\u0002\u0002ik\u0003\u0002\u0002\u0002jc\u0003\u0002\u0002\u0002",
    "jd\u0003\u0002\u0002\u0002k \u0003\u0002\u0002\u0002lp\u0005\u000b\u0006",
    "\u0002mp\u0005\r\u0007\u0002np\u0005\u000f\b\u0002ol\u0003\u0002\u0002",
    "\u0002om\u0003\u0002\u0002\u0002on\u0003\u0002\u0002\u0002pq\u0003\u0002",
    "\u0002\u0002qo\u0003\u0002\u0002\u0002qr\u0003\u0002\u0002\u0002r\"",
    "\u0003\u0002\u0002\u0002st\t\u0005\u0002\u0002tu\u0003\u0002\u0002\u0002",
    "uv\b\u0012\u0002\u0002v$\u0003\u0002\u0002\u0002\u000e\u0002\'*,3PY",
    "ahjoq\u0003\u0002\u0003\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function TerminalLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

TerminalLexer.prototype = Object.create(antlr4.Lexer.prototype);
TerminalLexer.prototype.constructor = TerminalLexer;

Object.defineProperty(TerminalLexer.prototype, "atn", {
        get : function() {
                return atn;
        }
});

TerminalLexer.EOF = antlr4.Token.EOF;
TerminalLexer.ENDOFCOMMAND = 1;
TerminalLexer.ASSIGN = 2;
TerminalLexer.SHORTFLAG = 3;
TerminalLexer.LONGFLAG = 4;
TerminalLexer.ESCAPECHAR = 5;
TerminalLexer.ESCAPEDSQCHAR = 6;
TerminalLexer.ESCAPEDDQCHAR = 7;
TerminalLexer.SQCHAR = 8;
TerminalLexer.DQCHAR = 9;
TerminalLexer.DQSTRING = 10;
TerminalLexer.SQSTRING = 11;
TerminalLexer.NUMBER = 12;
TerminalLexer.WORD = 13;
TerminalLexer.WHITESPACE = 14;

TerminalLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

TerminalLexer.prototype.modeNames = [ "DEFAULT_MODE" ];

TerminalLexer.prototype.literalNames = [ null, null, "'='", null, null, 
                                         "'\\'", null, null, "'''", "'\"'" ];

TerminalLexer.prototype.symbolicNames = [ null, "ENDOFCOMMAND", "ASSIGN", 
                                          "SHORTFLAG", "LONGFLAG", "ESCAPECHAR", 
                                          "ESCAPEDSQCHAR", "ESCAPEDDQCHAR", 
                                          "SQCHAR", "DQCHAR", "DQSTRING", 
                                          "SQSTRING", "NUMBER", "WORD", 
                                          "WHITESPACE" ];

TerminalLexer.prototype.ruleNames = [ "ENDOFCOMMAND", "ASSIGN", "SHORTFLAG", 
                                      "LONGFLAG", "CHAR", "DIGIT", "SPECIAL", 
                                      "ESCAPECHAR", "ESCAPEDSQCHAR", "ESCAPEDDQCHAR", 
                                      "SQCHAR", "DQCHAR", "DQSTRING", "SQSTRING", 
                                      "NUMBER", "WORD", "WHITESPACE" ];

TerminalLexer.prototype.grammarFileName = "Terminal.g4";



exports.TerminalLexer = TerminalLexer;


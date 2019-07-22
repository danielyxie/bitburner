// Generated from utils/grammars/Terminal.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');



var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002\u0010z\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004",
    "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t",
    "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010",
    "\t\u0010\u0004\u0011\t\u0011\u0004\u0012\t\u0012\u0003\u0002\u0003\u0002",
    "\u0005\u0002(\n\u0002\u0003\u0002\u0006\u0002+\n\u0002\r\u0002\u000e",
    "\u0002,\u0003\u0002\u0005\u00020\n\u0002\u0003\u0003\u0003\u0003\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0005\u00047\n\u0004\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003",
    "\u0007\u0003\u0007\u0003\b\u0003\b\u0003\t\u0003\t\u0003\n\u0003\n\u0003",
    "\n\u0003\u000b\u0003\u000b\u0003\u000b\u0003\f\u0003\f\u0003\r\u0003",
    "\r\u0003\u000e\u0003\u000e\u0007\u000eR\n\u000e\f\u000e\u000e\u000e",
    "U\u000b\u000e\u0003\u000e\u0003\u000e\u0003\u000f\u0003\u000f\u0007",
    "\u000f[\n\u000f\f\u000f\u000e\u000f^\u000b\u000f\u0003\u000f\u0003\u000f",
    "\u0003\u0010\u0006\u0010c\n\u0010\r\u0010\u000e\u0010d\u0003\u0010\u0003",
    "\u0010\u0003\u0010\u0006\u0010j\n\u0010\r\u0010\u000e\u0010k\u0005\u0010",
    "n\n\u0010\u0003\u0011\u0003\u0011\u0003\u0011\u0006\u0011s\n\u0011\r",
    "\u0011\u000e\u0011t\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012",
    "\u0004S\\\u0002\u0013\u0003\u0003\u0005\u0004\u0007\u0005\t\u0006\u000b",
    "\u0002\r\u0002\u000f\u0002\u0011\u0007\u0013\b\u0015\t\u0017\n\u0019",
    "\u000b\u001b\f\u001d\r\u001f\u000e!\u000f#\u0010\u0003\u0002\u0006\u0004",
    "\u0002C\\c|\u0003\u00022;\f\u0002\u000b\f\u000f\u000f\"\"$$))2;==??",
    "C\\c|\u0005\u0002\u000b\f\u000f\u000f\"\"\u0002\u0083\u0002\u0003\u0003",
    "\u0002\u0002\u0002\u0002\u0005\u0003\u0002\u0002\u0002\u0002\u0007\u0003",
    "\u0002\u0002\u0002\u0002\t\u0003\u0002\u0002\u0002\u0002\u0011\u0003",
    "\u0002\u0002\u0002\u0002\u0013\u0003\u0002\u0002\u0002\u0002\u0015\u0003",
    "\u0002\u0002\u0002\u0002\u0017\u0003\u0002\u0002\u0002\u0002\u0019\u0003",
    "\u0002\u0002\u0002\u0002\u001b\u0003\u0002\u0002\u0002\u0002\u001d\u0003",
    "\u0002\u0002\u0002\u0002\u001f\u0003\u0002\u0002\u0002\u0002!\u0003",
    "\u0002\u0002\u0002\u0002#\u0003\u0002\u0002\u0002\u0003/\u0003\u0002",
    "\u0002\u0002\u00051\u0003\u0002\u0002\u0002\u00073\u0003\u0002\u0002",
    "\u0002\t8\u0003\u0002\u0002\u0002\u000b=\u0003\u0002\u0002\u0002\r?",
    "\u0003\u0002\u0002\u0002\u000fA\u0003\u0002\u0002\u0002\u0011C\u0003",
    "\u0002\u0002\u0002\u0013E\u0003\u0002\u0002\u0002\u0015H\u0003\u0002",
    "\u0002\u0002\u0017K\u0003\u0002\u0002\u0002\u0019M\u0003\u0002\u0002",
    "\u0002\u001bO\u0003\u0002\u0002\u0002\u001dX\u0003\u0002\u0002\u0002",
    "\u001fb\u0003\u0002\u0002\u0002!r\u0003\u0002\u0002\u0002#v\u0003\u0002",
    "\u0002\u0002%+\u0007=\u0002\u0002&(\u0007\u000f\u0002\u0002\'&\u0003",
    "\u0002\u0002\u0002\'(\u0003\u0002\u0002\u0002()\u0003\u0002\u0002\u0002",
    ")+\u0007\f\u0002\u0002*%\u0003\u0002\u0002\u0002*\'\u0003\u0002\u0002",
    "\u0002+,\u0003\u0002\u0002\u0002,*\u0003\u0002\u0002\u0002,-\u0003\u0002",
    "\u0002\u0002-0\u0003\u0002\u0002\u0002.0\u0007\u0002\u0002\u0003/*\u0003",
    "\u0002\u0002\u0002/.\u0003\u0002\u0002\u00020\u0004\u0003\u0002\u0002",
    "\u000212\u0007?\u0002\u00022\u0006\u0003\u0002\u0002\u000236\u0007/",
    "\u0002\u000247\u0005\u000b\u0006\u000257\u0005\r\u0007\u000264\u0003",
    "\u0002\u0002\u000265\u0003\u0002\u0002\u00027\b\u0003\u0002\u0002\u0002",
    "89\u0007/\u0002\u00029:\u0007/\u0002\u0002:;\u0003\u0002\u0002\u0002",
    ";<\u0005!\u0011\u0002<\n\u0003\u0002\u0002\u0002=>\t\u0002\u0002\u0002",
    ">\f\u0003\u0002\u0002\u0002?@\t\u0003\u0002\u0002@\u000e\u0003\u0002",
    "\u0002\u0002AB\n\u0004\u0002\u0002B\u0010\u0003\u0002\u0002\u0002CD",
    "\u0007^\u0002\u0002D\u0012\u0003\u0002\u0002\u0002EF\u0005\u0011\t\u0002",
    "FG\u0007)\u0002\u0002G\u0014\u0003\u0002\u0002\u0002HI\u0005\u0011\t",
    "\u0002IJ\u0007$\u0002\u0002J\u0016\u0003\u0002\u0002\u0002KL\u0007)",
    "\u0002\u0002L\u0018\u0003\u0002\u0002\u0002MN\u0007$\u0002\u0002N\u001a",
    "\u0003\u0002\u0002\u0002OS\u0005\u0019\r\u0002PR\u000b\u0002\u0002\u0002",
    "QP\u0003\u0002\u0002\u0002RU\u0003\u0002\u0002\u0002ST\u0003\u0002\u0002",
    "\u0002SQ\u0003\u0002\u0002\u0002TV\u0003\u0002\u0002\u0002US\u0003\u0002",
    "\u0002\u0002VW\u0005\u0019\r\u0002W\u001c\u0003\u0002\u0002\u0002X\\",
    "\u0005\u0017\f\u0002Y[\u000b\u0002\u0002\u0002ZY\u0003\u0002\u0002\u0002",
    "[^\u0003\u0002\u0002\u0002\\]\u0003\u0002\u0002\u0002\\Z\u0003\u0002",
    "\u0002\u0002]_\u0003\u0002\u0002\u0002^\\\u0003\u0002\u0002\u0002_`",
    "\u0005\u0017\f\u0002`\u001e\u0003\u0002\u0002\u0002ac\t\u0003\u0002",
    "\u0002ba\u0003\u0002\u0002\u0002cd\u0003\u0002\u0002\u0002db\u0003\u0002",
    "\u0002\u0002de\u0003\u0002\u0002\u0002em\u0003\u0002\u0002\u0002fn\u0003",
    "\u0002\u0002\u0002gi\u00070\u0002\u0002hj\t\u0003\u0002\u0002ih\u0003",
    "\u0002\u0002\u0002jk\u0003\u0002\u0002\u0002ki\u0003\u0002\u0002\u0002",
    "kl\u0003\u0002\u0002\u0002ln\u0003\u0002\u0002\u0002mf\u0003\u0002\u0002",
    "\u0002mg\u0003\u0002\u0002\u0002n \u0003\u0002\u0002\u0002os\u0005\u000b",
    "\u0006\u0002ps\u0005\r\u0007\u0002qs\u0005\u000f\b\u0002ro\u0003\u0002",
    "\u0002\u0002rp\u0003\u0002\u0002\u0002rq\u0003\u0002\u0002\u0002st\u0003",
    "\u0002\u0002\u0002tr\u0003\u0002\u0002\u0002tu\u0003\u0002\u0002\u0002",
    "u\"\u0003\u0002\u0002\u0002vw\t\u0005\u0002\u0002wx\u0003\u0002\u0002",
    "\u0002xy\b\u0012\u0002\u0002y$\u0003\u0002\u0002\u0002\u000f\u0002\'",
    "*,/6S\\dkmrt\u0003\u0002\u0003\u0002"].join("");


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


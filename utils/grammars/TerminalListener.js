// Generated from utils/grammars/Terminal.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by TerminalParser.
function TerminalListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

TerminalListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
TerminalListener.prototype.constructor = TerminalListener;

// Enter a parse tree produced by TerminalParser#commandSequence.
TerminalListener.prototype.enterCommandSequence = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#commandSequence.
TerminalListener.prototype.exitCommandSequence = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#command.
TerminalListener.prototype.enterCommand = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#command.
TerminalListener.prototype.exitCommand = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#commandName.
TerminalListener.prototype.enterCommandName = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#commandName.
TerminalListener.prototype.exitCommandName = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#commandArgList.
TerminalListener.prototype.enterCommandArgList = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#commandArgList.
TerminalListener.prototype.exitCommandArgList = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#arg.
TerminalListener.prototype.enterArg = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#arg.
TerminalListener.prototype.exitArg = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#kwarg.
TerminalListener.prototype.enterKwarg = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#kwarg.
TerminalListener.prototype.exitKwarg = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#DQString.
TerminalListener.prototype.enterDQString = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#DQString.
TerminalListener.prototype.exitDQString = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#SQString.
TerminalListener.prototype.enterSQString = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#SQString.
TerminalListener.prototype.exitSQString = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#LongFlag.
TerminalListener.prototype.enterLongFlag = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#LongFlag.
TerminalListener.prototype.exitLongFlag = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#ShortFlag.
TerminalListener.prototype.enterShortFlag = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#ShortFlag.
TerminalListener.prototype.exitShortFlag = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#Number.
TerminalListener.prototype.enterNumber = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#Number.
TerminalListener.prototype.exitNumber = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#Word.
TerminalListener.prototype.enterWord = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#Word.
TerminalListener.prototype.exitWord = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#keyvalue.
TerminalListener.prototype.enterKeyvalue = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#keyvalue.
TerminalListener.prototype.exitKeyvalue = function(ctx) {
};


// Enter a parse tree produced by TerminalParser#key.
TerminalListener.prototype.enterKey = function(ctx) {
};

// Exit a parse tree produced by TerminalParser#key.
TerminalListener.prototype.exitKey = function(ctx) {
};



exports.TerminalListener = TerminalListener;
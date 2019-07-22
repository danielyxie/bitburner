// Generated from utils/grammars/Terminal.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');
var TerminalListener = require('./TerminalListener').TerminalListener;
var grammarFileName = "Terminal.g4";


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\u0010C\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0003\u0002\u0003\u0002\u0003\u0002\u0005\u0002\u0016",
    "\n\u0002\u0003\u0002\u0003\u0002\u0007\u0002\u001a\n\u0002\f\u0002\u000e",
    "\u0002\u001d\u000b\u0002\u0003\u0003\u0003\u0003\u0005\u0003!\n\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0007\u0005,\n\u0005\f\u0005\u000e",
    "\u0005/\u000b\u0005\u0003\u0006\u0003\u0006\u0005\u00063\n\u0006\u0003",
    "\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0005",
    "\u0007;\n\u0007\u0003\b\u0003\b\u0003\b\u0003\b\u0003\t\u0003\t\u0003",
    "\t\u0002\u0004\u0002\b\n\u0002\u0004\u0006\b\n\f\u000e\u0010\u0002\u0002",
    "\u0002D\u0002\u0015\u0003\u0002\u0002\u0002\u0004\u001e\u0003\u0002",
    "\u0002\u0002\u0006$\u0003\u0002\u0002\u0002\b&\u0003\u0002\u0002\u0002",
    "\n2\u0003\u0002\u0002\u0002\f:\u0003\u0002\u0002\u0002\u000e<\u0003",
    "\u0002\u0002\u0002\u0010@\u0003\u0002\u0002\u0002\u0012\u0013\b\u0002",
    "\u0001\u0002\u0013\u0016\u0005\u0004\u0003\u0002\u0014\u0016\u0007\u0002",
    "\u0002\u0003\u0015\u0012\u0003\u0002\u0002\u0002\u0015\u0014\u0003\u0002",
    "\u0002\u0002\u0016\u001b\u0003\u0002\u0002\u0002\u0017\u0018\f\u0004",
    "\u0002\u0002\u0018\u001a\u0005\u0004\u0003\u0002\u0019\u0017\u0003\u0002",
    "\u0002\u0002\u001a\u001d\u0003\u0002\u0002\u0002\u001b\u0019\u0003\u0002",
    "\u0002\u0002\u001b\u001c\u0003\u0002\u0002\u0002\u001c\u0003\u0003\u0002",
    "\u0002\u0002\u001d\u001b\u0003\u0002\u0002\u0002\u001e \u0005\u0006",
    "\u0004\u0002\u001f!\u0005\b\u0005\u0002 \u001f\u0003\u0002\u0002\u0002",
    " !\u0003\u0002\u0002\u0002!\"\u0003\u0002\u0002\u0002\"#\u0007\u0003",
    "\u0002\u0002#\u0005\u0003\u0002\u0002\u0002$%\u0007\u000f\u0002\u0002",
    "%\u0007\u0003\u0002\u0002\u0002&\'\b\u0005\u0001\u0002\'(\u0005\n\u0006",
    "\u0002(-\u0003\u0002\u0002\u0002)*\f\u0003\u0002\u0002*,\u0005\n\u0006",
    "\u0002+)\u0003\u0002\u0002\u0002,/\u0003\u0002\u0002\u0002-+\u0003\u0002",
    "\u0002\u0002-.\u0003\u0002\u0002\u0002.\t\u0003\u0002\u0002\u0002/-",
    "\u0003\u0002\u0002\u000203\u0005\f\u0007\u000213\u0005\u000e\b\u0002",
    "20\u0003\u0002\u0002\u000221\u0003\u0002\u0002\u00023\u000b\u0003\u0002",
    "\u0002\u00024;\u0007\f\u0002\u00025;\u0007\r\u0002\u00026;\u0007\u0006",
    "\u0002\u00027;\u0007\u0005\u0002\u00028;\u0007\u000e\u0002\u00029;\u0007",
    "\u000f\u0002\u0002:4\u0003\u0002\u0002\u0002:5\u0003\u0002\u0002\u0002",
    ":6\u0003\u0002\u0002\u0002:7\u0003\u0002\u0002\u0002:8\u0003\u0002\u0002",
    "\u0002:9\u0003\u0002\u0002\u0002;\r\u0003\u0002\u0002\u0002<=\u0005",
    "\u0010\t\u0002=>\u0007\u0004\u0002\u0002>?\u0005\f\u0007\u0002?\u000f",
    "\u0003\u0002\u0002\u0002@A\u0007\u000f\u0002\u0002A\u0011\u0003\u0002",
    "\u0002\u0002\b\u0015\u001b -2:"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, null, "'='", null, null, "'\\'", null, null, 
                     "'''", "'\"'" ];

var symbolicNames = [ null, "ENDOFCOMMAND", "ASSIGN", "SHORTFLAG", "LONGFLAG", 
                      "ESCAPECHAR", "ESCAPEDSQCHAR", "ESCAPEDDQCHAR", "SQCHAR", 
                      "DQCHAR", "DQSTRING", "SQSTRING", "NUMBER", "WORD", 
                      "WHITESPACE" ];

var ruleNames =  [ "commandSequence", "command", "commandName", "commandArgList", 
                   "commandArg", "value", "keyvalue", "key" ];

function TerminalParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

TerminalParser.prototype = Object.create(antlr4.Parser.prototype);
TerminalParser.prototype.constructor = TerminalParser;

Object.defineProperty(TerminalParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

TerminalParser.EOF = antlr4.Token.EOF;
TerminalParser.ENDOFCOMMAND = 1;
TerminalParser.ASSIGN = 2;
TerminalParser.SHORTFLAG = 3;
TerminalParser.LONGFLAG = 4;
TerminalParser.ESCAPECHAR = 5;
TerminalParser.ESCAPEDSQCHAR = 6;
TerminalParser.ESCAPEDDQCHAR = 7;
TerminalParser.SQCHAR = 8;
TerminalParser.DQCHAR = 9;
TerminalParser.DQSTRING = 10;
TerminalParser.SQSTRING = 11;
TerminalParser.NUMBER = 12;
TerminalParser.WORD = 13;
TerminalParser.WHITESPACE = 14;

TerminalParser.RULE_commandSequence = 0;
TerminalParser.RULE_command = 1;
TerminalParser.RULE_commandName = 2;
TerminalParser.RULE_commandArgList = 3;
TerminalParser.RULE_commandArg = 4;
TerminalParser.RULE_value = 5;
TerminalParser.RULE_keyvalue = 6;
TerminalParser.RULE_key = 7;


function CommandSequenceContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = TerminalParser.RULE_commandSequence;
    return this;
}

CommandSequenceContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CommandSequenceContext.prototype.constructor = CommandSequenceContext;

CommandSequenceContext.prototype.command = function() {
    return this.getTypedRuleContext(CommandContext,0);
};

CommandSequenceContext.prototype.EOF = function() {
    return this.getToken(TerminalParser.EOF, 0);
};

CommandSequenceContext.prototype.commandSequence = function() {
    return this.getTypedRuleContext(CommandSequenceContext,0);
};

CommandSequenceContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterCommandSequence(this);
	}
};

CommandSequenceContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitCommandSequence(this);
	}
};



TerminalParser.prototype.commandSequence = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new CommandSequenceContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 0;
    this.enterRecursionRule(localctx, 0, TerminalParser.RULE_commandSequence, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 19;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case TerminalParser.WORD:
            this.state = 17;
            this.command();
            break;
        case TerminalParser.EOF:
            this.state = 18;
            this.match(TerminalParser.EOF);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 25;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,1,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                localctx = new CommandSequenceContext(this, _parentctx, _parentState);
                this.pushNewRecursionContext(localctx, _startState, TerminalParser.RULE_commandSequence);
                this.state = 21;
                if (!( this.precpred(this._ctx, 2))) {
                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
                }
                this.state = 22;
                this.command(); 
            }
            this.state = 27;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,1,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};


function CommandContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = TerminalParser.RULE_command;
    this.name = null; // CommandNameContext
    this.args = null; // CommandArgListContext
    return this;
}

CommandContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CommandContext.prototype.constructor = CommandContext;

CommandContext.prototype.ENDOFCOMMAND = function() {
    return this.getToken(TerminalParser.ENDOFCOMMAND, 0);
};

CommandContext.prototype.commandName = function() {
    return this.getTypedRuleContext(CommandNameContext,0);
};

CommandContext.prototype.commandArgList = function() {
    return this.getTypedRuleContext(CommandArgListContext,0);
};

CommandContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterCommand(this);
	}
};

CommandContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitCommand(this);
	}
};




TerminalParser.CommandContext = CommandContext;

TerminalParser.prototype.command = function() {

    var localctx = new CommandContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, TerminalParser.RULE_command);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 28;
        localctx.name = this.commandName();
        this.state = 30;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << TerminalParser.SHORTFLAG) | (1 << TerminalParser.LONGFLAG) | (1 << TerminalParser.DQSTRING) | (1 << TerminalParser.SQSTRING) | (1 << TerminalParser.NUMBER) | (1 << TerminalParser.WORD))) !== 0)) {
            this.state = 29;
            localctx.args = this.commandArgList(0);
        }

        this.state = 32;
        this.match(TerminalParser.ENDOFCOMMAND);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function CommandNameContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = TerminalParser.RULE_commandName;
    return this;
}

CommandNameContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CommandNameContext.prototype.constructor = CommandNameContext;

CommandNameContext.prototype.WORD = function() {
    return this.getToken(TerminalParser.WORD, 0);
};

CommandNameContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterCommandName(this);
	}
};

CommandNameContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitCommandName(this);
	}
};




TerminalParser.CommandNameContext = CommandNameContext;

TerminalParser.prototype.commandName = function() {

    var localctx = new CommandNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, TerminalParser.RULE_commandName);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 34;
        this.match(TerminalParser.WORD);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function CommandArgListContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = TerminalParser.RULE_commandArgList;
    return this;
}

CommandArgListContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CommandArgListContext.prototype.constructor = CommandArgListContext;

CommandArgListContext.prototype.commandArg = function() {
    return this.getTypedRuleContext(CommandArgContext,0);
};

CommandArgListContext.prototype.commandArgList = function() {
    return this.getTypedRuleContext(CommandArgListContext,0);
};

CommandArgListContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterCommandArgList(this);
	}
};

CommandArgListContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitCommandArgList(this);
	}
};



TerminalParser.prototype.commandArgList = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new CommandArgListContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 6;
    this.enterRecursionRule(localctx, 6, TerminalParser.RULE_commandArgList, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 37;
        this.commandArg();
        this._ctx.stop = this._input.LT(-1);
        this.state = 43;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,3,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                localctx = new CommandArgListContext(this, _parentctx, _parentState);
                this.pushNewRecursionContext(localctx, _startState, TerminalParser.RULE_commandArgList);
                this.state = 39;
                if (!( this.precpred(this._ctx, 1))) {
                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                }
                this.state = 40;
                this.commandArg(); 
            }
            this.state = 45;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,3,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};


function CommandArgContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = TerminalParser.RULE_commandArg;
    return this;
}

CommandArgContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CommandArgContext.prototype.constructor = CommandArgContext;


 
CommandArgContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};


function KwargContext(parser, ctx) {
	CommandArgContext.call(this, parser);
    CommandArgContext.prototype.copyFrom.call(this, ctx);
    return this;
}

KwargContext.prototype = Object.create(CommandArgContext.prototype);
KwargContext.prototype.constructor = KwargContext;

TerminalParser.KwargContext = KwargContext;

KwargContext.prototype.keyvalue = function() {
    return this.getTypedRuleContext(KeyvalueContext,0);
};
KwargContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterKwarg(this);
	}
};

KwargContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitKwarg(this);
	}
};


function ArgContext(parser, ctx) {
	CommandArgContext.call(this, parser);
    CommandArgContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ArgContext.prototype = Object.create(CommandArgContext.prototype);
ArgContext.prototype.constructor = ArgContext;

TerminalParser.ArgContext = ArgContext;

ArgContext.prototype.value = function() {
    return this.getTypedRuleContext(ValueContext,0);
};
ArgContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterArg(this);
	}
};

ArgContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitArg(this);
	}
};



TerminalParser.CommandArgContext = CommandArgContext;

TerminalParser.prototype.commandArg = function() {

    var localctx = new CommandArgContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, TerminalParser.RULE_commandArg);
    try {
        this.state = 48;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
        switch(la_) {
        case 1:
            localctx = new ArgContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 46;
            this.value();
            break;

        case 2:
            localctx = new KwargContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 47;
            this.keyvalue();
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ValueContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = TerminalParser.RULE_value;
    return this;
}

ValueContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ValueContext.prototype.constructor = ValueContext;


 
ValueContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};


function ShortFlagContext(parser, ctx) {
	ValueContext.call(this, parser);
    ValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ShortFlagContext.prototype = Object.create(ValueContext.prototype);
ShortFlagContext.prototype.constructor = ShortFlagContext;

TerminalParser.ShortFlagContext = ShortFlagContext;

ShortFlagContext.prototype.SHORTFLAG = function() {
    return this.getToken(TerminalParser.SHORTFLAG, 0);
};
ShortFlagContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterShortFlag(this);
	}
};

ShortFlagContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitShortFlag(this);
	}
};


function WordContext(parser, ctx) {
	ValueContext.call(this, parser);
    ValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

WordContext.prototype = Object.create(ValueContext.prototype);
WordContext.prototype.constructor = WordContext;

TerminalParser.WordContext = WordContext;

WordContext.prototype.WORD = function() {
    return this.getToken(TerminalParser.WORD, 0);
};
WordContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterWord(this);
	}
};

WordContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitWord(this);
	}
};


function NumberContext(parser, ctx) {
	ValueContext.call(this, parser);
    ValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

NumberContext.prototype = Object.create(ValueContext.prototype);
NumberContext.prototype.constructor = NumberContext;

TerminalParser.NumberContext = NumberContext;

NumberContext.prototype.NUMBER = function() {
    return this.getToken(TerminalParser.NUMBER, 0);
};
NumberContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterNumber(this);
	}
};

NumberContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitNumber(this);
	}
};


function LongFlagContext(parser, ctx) {
	ValueContext.call(this, parser);
    ValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

LongFlagContext.prototype = Object.create(ValueContext.prototype);
LongFlagContext.prototype.constructor = LongFlagContext;

TerminalParser.LongFlagContext = LongFlagContext;

LongFlagContext.prototype.LONGFLAG = function() {
    return this.getToken(TerminalParser.LONGFLAG, 0);
};
LongFlagContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterLongFlag(this);
	}
};

LongFlagContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitLongFlag(this);
	}
};


function SQStringContext(parser, ctx) {
	ValueContext.call(this, parser);
    ValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

SQStringContext.prototype = Object.create(ValueContext.prototype);
SQStringContext.prototype.constructor = SQStringContext;

TerminalParser.SQStringContext = SQStringContext;

SQStringContext.prototype.SQSTRING = function() {
    return this.getToken(TerminalParser.SQSTRING, 0);
};
SQStringContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterSQString(this);
	}
};

SQStringContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitSQString(this);
	}
};


function DQStringContext(parser, ctx) {
	ValueContext.call(this, parser);
    ValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

DQStringContext.prototype = Object.create(ValueContext.prototype);
DQStringContext.prototype.constructor = DQStringContext;

TerminalParser.DQStringContext = DQStringContext;

DQStringContext.prototype.DQSTRING = function() {
    return this.getToken(TerminalParser.DQSTRING, 0);
};
DQStringContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterDQString(this);
	}
};

DQStringContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitDQString(this);
	}
};



TerminalParser.ValueContext = ValueContext;

TerminalParser.prototype.value = function() {

    var localctx = new ValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, TerminalParser.RULE_value);
    try {
        this.state = 56;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case TerminalParser.DQSTRING:
            localctx = new DQStringContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 50;
            this.match(TerminalParser.DQSTRING);
            break;
        case TerminalParser.SQSTRING:
            localctx = new SQStringContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 51;
            this.match(TerminalParser.SQSTRING);
            break;
        case TerminalParser.LONGFLAG:
            localctx = new LongFlagContext(this, localctx);
            this.enterOuterAlt(localctx, 3);
            this.state = 52;
            this.match(TerminalParser.LONGFLAG);
            break;
        case TerminalParser.SHORTFLAG:
            localctx = new ShortFlagContext(this, localctx);
            this.enterOuterAlt(localctx, 4);
            this.state = 53;
            this.match(TerminalParser.SHORTFLAG);
            break;
        case TerminalParser.NUMBER:
            localctx = new NumberContext(this, localctx);
            this.enterOuterAlt(localctx, 5);
            this.state = 54;
            this.match(TerminalParser.NUMBER);
            break;
        case TerminalParser.WORD:
            localctx = new WordContext(this, localctx);
            this.enterOuterAlt(localctx, 6);
            this.state = 55;
            this.match(TerminalParser.WORD);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function KeyvalueContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = TerminalParser.RULE_keyvalue;
    this.k = null; // KeyContext
    this.v = null; // ValueContext
    return this;
}

KeyvalueContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
KeyvalueContext.prototype.constructor = KeyvalueContext;

KeyvalueContext.prototype.ASSIGN = function() {
    return this.getToken(TerminalParser.ASSIGN, 0);
};

KeyvalueContext.prototype.key = function() {
    return this.getTypedRuleContext(KeyContext,0);
};

KeyvalueContext.prototype.value = function() {
    return this.getTypedRuleContext(ValueContext,0);
};

KeyvalueContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterKeyvalue(this);
	}
};

KeyvalueContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitKeyvalue(this);
	}
};




TerminalParser.KeyvalueContext = KeyvalueContext;

TerminalParser.prototype.keyvalue = function() {

    var localctx = new KeyvalueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, TerminalParser.RULE_keyvalue);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 58;
        localctx.k = this.key();
        this.state = 59;
        this.match(TerminalParser.ASSIGN);
        this.state = 60;
        localctx.v = this.value();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function KeyContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = TerminalParser.RULE_key;
    return this;
}

KeyContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
KeyContext.prototype.constructor = KeyContext;

KeyContext.prototype.WORD = function() {
    return this.getToken(TerminalParser.WORD, 0);
};

KeyContext.prototype.enterRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.enterKey(this);
	}
};

KeyContext.prototype.exitRule = function(listener) {
    if(listener instanceof TerminalListener ) {
        listener.exitKey(this);
	}
};




TerminalParser.KeyContext = KeyContext;

TerminalParser.prototype.key = function() {

    var localctx = new KeyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, TerminalParser.RULE_key);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 62;
        this.match(TerminalParser.WORD);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


TerminalParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 0:
			return this.commandSequence_sempred(localctx, predIndex);
	case 3:
			return this.commandArgList_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

TerminalParser.prototype.commandSequence_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 2);
		default:
			throw "No predicate with index:" + predIndex;
	}
};

TerminalParser.prototype.commandArgList_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 1:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.TerminalParser = TerminalParser;

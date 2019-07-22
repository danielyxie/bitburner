// Generated from c:\Users\Helldragger\Documents\git projects\bitburner\u005Cutils\grammars\Terminal.g4 by ANTLR 4.7.1
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class TerminalParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.7.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		ENDOFCOMMAND=1, ASSIGN=2, SHORTFLAG=3, LONGFLAG=4, ESCAPECHAR=5, ESCAPEDSQCHAR=6, 
		ESCAPEDDQCHAR=7, SQCHAR=8, DQCHAR=9, DQSTRING=10, SQSTRING=11, NUMBER=12, 
		WORD=13, WHITESPACE=14;
	public static final int
		RULE_commandSequence = 0, RULE_command = 1, RULE_commandName = 2, RULE_commandArgList = 3, 
		RULE_commandArg = 4, RULE_value = 5, RULE_keyvalue = 6, RULE_key = 7;
	public static final String[] ruleNames = {
		"commandSequence", "command", "commandName", "commandArgList", "commandArg", 
		"value", "keyvalue", "key"
	};

	private static final String[] _LITERAL_NAMES = {
		null, null, "'='", null, null, "'\\'", null, null, "'''", "'\"'"
	};
	private static final String[] _SYMBOLIC_NAMES = {
		null, "ENDOFCOMMAND", "ASSIGN", "SHORTFLAG", "LONGFLAG", "ESCAPECHAR", 
		"ESCAPEDSQCHAR", "ESCAPEDDQCHAR", "SQCHAR", "DQCHAR", "DQSTRING", "SQSTRING", 
		"NUMBER", "WORD", "WHITESPACE"
	};
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "Terminal.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public TerminalParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}
	public static class CommandSequenceContext extends ParserRuleContext {
		public CommandContext command() {
			return getRuleContext(CommandContext.class,0);
		}
		public TerminalNode ENDOFCOMMAND() { return getToken(TerminalParser.ENDOFCOMMAND, 0); }
		public CommandSequenceContext commandSequence() {
			return getRuleContext(CommandSequenceContext.class,0);
		}
		public CommandSequenceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_commandSequence; }
	}

	public final CommandSequenceContext commandSequence() throws RecognitionException {
		CommandSequenceContext _localctx = new CommandSequenceContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_commandSequence);
		try {
			setState(24);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,1,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(16);
				command();
				setState(18);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,0,_ctx) ) {
				case 1:
					{
					setState(17);
					match(ENDOFCOMMAND);
					}
					break;
				}
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(20);
				command();
				setState(21);
				match(ENDOFCOMMAND);
				setState(22);
				commandSequence();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CommandContext extends ParserRuleContext {
		public CommandNameContext commandName() {
			return getRuleContext(CommandNameContext.class,0);
		}
		public CommandArgListContext commandArgList() {
			return getRuleContext(CommandArgListContext.class,0);
		}
		public CommandContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_command; }
	}

	public final CommandContext command() throws RecognitionException {
		CommandContext _localctx = new CommandContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_command);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(26);
			commandName();
			setState(28);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << SHORTFLAG) | (1L << LONGFLAG) | (1L << DQSTRING) | (1L << SQSTRING) | (1L << NUMBER) | (1L << WORD))) != 0)) {
				{
				setState(27);
				commandArgList(0);
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CommandNameContext extends ParserRuleContext {
		public TerminalNode WORD() { return getToken(TerminalParser.WORD, 0); }
		public CommandNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_commandName; }
	}

	public final CommandNameContext commandName() throws RecognitionException {
		CommandNameContext _localctx = new CommandNameContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_commandName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(30);
			match(WORD);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CommandArgListContext extends ParserRuleContext {
		public CommandArgContext commandArg() {
			return getRuleContext(CommandArgContext.class,0);
		}
		public CommandArgListContext commandArgList() {
			return getRuleContext(CommandArgListContext.class,0);
		}
		public CommandArgListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_commandArgList; }
	}

	public final CommandArgListContext commandArgList() throws RecognitionException {
		return commandArgList(0);
	}

	private CommandArgListContext commandArgList(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		CommandArgListContext _localctx = new CommandArgListContext(_ctx, _parentState);
		CommandArgListContext _prevctx = _localctx;
		int _startState = 6;
		enterRecursionRule(_localctx, 6, RULE_commandArgList, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(33);
			commandArg();
			}
			_ctx.stop = _input.LT(-1);
			setState(39);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,3,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					{
					_localctx = new CommandArgListContext(_parentctx, _parentState);
					pushNewRecursionContext(_localctx, _startState, RULE_commandArgList);
					setState(35);
					if (!(precpred(_ctx, 1))) throw new FailedPredicateException(this, "precpred(_ctx, 1)");
					setState(36);
					commandArg();
					}
					} 
				}
				setState(41);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,3,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public static class CommandArgContext extends ParserRuleContext {
		public ValueContext value() {
			return getRuleContext(ValueContext.class,0);
		}
		public KeyvalueContext keyvalue() {
			return getRuleContext(KeyvalueContext.class,0);
		}
		public CommandArgContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_commandArg; }
	}

	public final CommandArgContext commandArg() throws RecognitionException {
		CommandArgContext _localctx = new CommandArgContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_commandArg);
		try {
			setState(44);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,4,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(42);
				value();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(43);
				keyvalue();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ValueContext extends ParserRuleContext {
		public TerminalNode DQSTRING() { return getToken(TerminalParser.DQSTRING, 0); }
		public TerminalNode SQSTRING() { return getToken(TerminalParser.SQSTRING, 0); }
		public TerminalNode LONGFLAG() { return getToken(TerminalParser.LONGFLAG, 0); }
		public TerminalNode SHORTFLAG() { return getToken(TerminalParser.SHORTFLAG, 0); }
		public TerminalNode NUMBER() { return getToken(TerminalParser.NUMBER, 0); }
		public TerminalNode WORD() { return getToken(TerminalParser.WORD, 0); }
		public ValueContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_value; }
	}

	public final ValueContext value() throws RecognitionException {
		ValueContext _localctx = new ValueContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_value);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(46);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << SHORTFLAG) | (1L << LONGFLAG) | (1L << DQSTRING) | (1L << SQSTRING) | (1L << NUMBER) | (1L << WORD))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class KeyvalueContext extends ParserRuleContext {
		public KeyContext key() {
			return getRuleContext(KeyContext.class,0);
		}
		public TerminalNode ASSIGN() { return getToken(TerminalParser.ASSIGN, 0); }
		public ValueContext value() {
			return getRuleContext(ValueContext.class,0);
		}
		public KeyvalueContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_keyvalue; }
	}

	public final KeyvalueContext keyvalue() throws RecognitionException {
		KeyvalueContext _localctx = new KeyvalueContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_keyvalue);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(48);
			key();
			setState(49);
			match(ASSIGN);
			setState(50);
			value();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class KeyContext extends ParserRuleContext {
		public TerminalNode WORD() { return getToken(TerminalParser.WORD, 0); }
		public KeyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_key; }
	}

	public final KeyContext key() throws RecognitionException {
		KeyContext _localctx = new KeyContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_key);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(52);
			match(WORD);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 3:
			return commandArgList_sempred((CommandArgListContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean commandArgList_sempred(CommandArgListContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return precpred(_ctx, 1);
		}
		return true;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\209\4\2\t\2\4\3\t"+
		"\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\3\2\3\2\5\2\25\n\2"+
		"\3\2\3\2\3\2\3\2\5\2\33\n\2\3\3\3\3\5\3\37\n\3\3\4\3\4\3\5\3\5\3\5\3\5"+
		"\3\5\7\5(\n\5\f\5\16\5+\13\5\3\6\3\6\5\6/\n\6\3\7\3\7\3\b\3\b\3\b\3\b"+
		"\3\t\3\t\3\t\2\3\b\n\2\4\6\b\n\f\16\20\2\3\4\2\5\6\f\17\2\65\2\32\3\2"+
		"\2\2\4\34\3\2\2\2\6 \3\2\2\2\b\"\3\2\2\2\n.\3\2\2\2\f\60\3\2\2\2\16\62"+
		"\3\2\2\2\20\66\3\2\2\2\22\24\5\4\3\2\23\25\7\3\2\2\24\23\3\2\2\2\24\25"+
		"\3\2\2\2\25\33\3\2\2\2\26\27\5\4\3\2\27\30\7\3\2\2\30\31\5\2\2\2\31\33"+
		"\3\2\2\2\32\22\3\2\2\2\32\26\3\2\2\2\33\3\3\2\2\2\34\36\5\6\4\2\35\37"+
		"\5\b\5\2\36\35\3\2\2\2\36\37\3\2\2\2\37\5\3\2\2\2 !\7\17\2\2!\7\3\2\2"+
		"\2\"#\b\5\1\2#$\5\n\6\2$)\3\2\2\2%&\f\3\2\2&(\5\n\6\2\'%\3\2\2\2(+\3\2"+
		"\2\2)\'\3\2\2\2)*\3\2\2\2*\t\3\2\2\2+)\3\2\2\2,/\5\f\7\2-/\5\16\b\2.,"+
		"\3\2\2\2.-\3\2\2\2/\13\3\2\2\2\60\61\t\2\2\2\61\r\3\2\2\2\62\63\5\20\t"+
		"\2\63\64\7\4\2\2\64\65\5\f\7\2\65\17\3\2\2\2\66\67\7\17\2\2\67\21\3\2"+
		"\2\2\7\24\32\36).";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}
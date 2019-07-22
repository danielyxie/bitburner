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
		public TerminalNode EOF() { return getToken(TerminalParser.EOF, 0); }
		public CommandSequenceContext commandSequence() {
			return getRuleContext(CommandSequenceContext.class,0);
		}
		public CommandSequenceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_commandSequence; }
	}

	public final CommandSequenceContext commandSequence() throws RecognitionException {
		return commandSequence(0);
	}

	private CommandSequenceContext commandSequence(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		CommandSequenceContext _localctx = new CommandSequenceContext(_ctx, _parentState);
		CommandSequenceContext _prevctx = _localctx;
		int _startState = 0;
		enterRecursionRule(_localctx, 0, RULE_commandSequence, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(19);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case WORD:
				{
				setState(17);
				command();
				}
				break;
			case EOF:
				{
				setState(18);
				match(EOF);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			_ctx.stop = _input.LT(-1);
			setState(25);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,1,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					{
					_localctx = new CommandSequenceContext(_parentctx, _parentState);
					pushNewRecursionContext(_localctx, _startState, RULE_commandSequence);
					setState(21);
					if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
					setState(22);
					command();
					}
					} 
				}
				setState(27);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,1,_ctx);
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

	public static class CommandContext extends ParserRuleContext {
		public CommandNameContext name;
		public CommandArgListContext args;
		public TerminalNode ENDOFCOMMAND() { return getToken(TerminalParser.ENDOFCOMMAND, 0); }
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
			setState(28);
			((CommandContext)_localctx).name = commandName();
			setState(30);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << SHORTFLAG) | (1L << LONGFLAG) | (1L << DQSTRING) | (1L << SQSTRING) | (1L << NUMBER) | (1L << WORD))) != 0)) {
				{
				setState(29);
				((CommandContext)_localctx).args = commandArgList(0);
				}
			}

			setState(32);
			match(ENDOFCOMMAND);
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
			setState(34);
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
			setState(37);
			commandArg();
			}
			_ctx.stop = _input.LT(-1);
			setState(43);
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
					setState(39);
					if (!(precpred(_ctx, 1))) throw new FailedPredicateException(this, "precpred(_ctx, 1)");
					setState(40);
					commandArg();
					}
					} 
				}
				setState(45);
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
		public CommandArgContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_commandArg; }
	 
		public CommandArgContext() { }
		public void copyFrom(CommandArgContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class KwargContext extends CommandArgContext {
		public KeyvalueContext keyvalue() {
			return getRuleContext(KeyvalueContext.class,0);
		}
		public KwargContext(CommandArgContext ctx) { copyFrom(ctx); }
	}
	public static class ArgContext extends CommandArgContext {
		public ValueContext value() {
			return getRuleContext(ValueContext.class,0);
		}
		public ArgContext(CommandArgContext ctx) { copyFrom(ctx); }
	}

	public final CommandArgContext commandArg() throws RecognitionException {
		CommandArgContext _localctx = new CommandArgContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_commandArg);
		try {
			setState(48);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,4,_ctx) ) {
			case 1:
				_localctx = new ArgContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(46);
				value();
				}
				break;
			case 2:
				_localctx = new KwargContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(47);
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
		public ValueContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_value; }
	 
		public ValueContext() { }
		public void copyFrom(ValueContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class ShortFlagContext extends ValueContext {
		public TerminalNode SHORTFLAG() { return getToken(TerminalParser.SHORTFLAG, 0); }
		public ShortFlagContext(ValueContext ctx) { copyFrom(ctx); }
	}
	public static class WordContext extends ValueContext {
		public TerminalNode WORD() { return getToken(TerminalParser.WORD, 0); }
		public WordContext(ValueContext ctx) { copyFrom(ctx); }
	}
	public static class NumberContext extends ValueContext {
		public TerminalNode NUMBER() { return getToken(TerminalParser.NUMBER, 0); }
		public NumberContext(ValueContext ctx) { copyFrom(ctx); }
	}
	public static class LongFlagContext extends ValueContext {
		public TerminalNode LONGFLAG() { return getToken(TerminalParser.LONGFLAG, 0); }
		public LongFlagContext(ValueContext ctx) { copyFrom(ctx); }
	}
	public static class SQStringContext extends ValueContext {
		public TerminalNode SQSTRING() { return getToken(TerminalParser.SQSTRING, 0); }
		public SQStringContext(ValueContext ctx) { copyFrom(ctx); }
	}
	public static class DQStringContext extends ValueContext {
		public TerminalNode DQSTRING() { return getToken(TerminalParser.DQSTRING, 0); }
		public DQStringContext(ValueContext ctx) { copyFrom(ctx); }
	}

	public final ValueContext value() throws RecognitionException {
		ValueContext _localctx = new ValueContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_value);
		try {
			setState(56);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case DQSTRING:
				_localctx = new DQStringContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(50);
				match(DQSTRING);
				}
				break;
			case SQSTRING:
				_localctx = new SQStringContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(51);
				match(SQSTRING);
				}
				break;
			case LONGFLAG:
				_localctx = new LongFlagContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(52);
				match(LONGFLAG);
				}
				break;
			case SHORTFLAG:
				_localctx = new ShortFlagContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(53);
				match(SHORTFLAG);
				}
				break;
			case NUMBER:
				_localctx = new NumberContext(_localctx);
				enterOuterAlt(_localctx, 5);
				{
				setState(54);
				match(NUMBER);
				}
				break;
			case WORD:
				_localctx = new WordContext(_localctx);
				enterOuterAlt(_localctx, 6);
				{
				setState(55);
				match(WORD);
				}
				break;
			default:
				throw new NoViableAltException(this);
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
		public KeyContext k;
		public ValueContext v;
		public TerminalNode ASSIGN() { return getToken(TerminalParser.ASSIGN, 0); }
		public KeyContext key() {
			return getRuleContext(KeyContext.class,0);
		}
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
			setState(58);
			((KeyvalueContext)_localctx).k = key();
			setState(59);
			match(ASSIGN);
			setState(60);
			((KeyvalueContext)_localctx).v = value();
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
			setState(62);
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
		case 0:
			return commandSequence_sempred((CommandSequenceContext)_localctx, predIndex);
		case 3:
			return commandArgList_sempred((CommandArgListContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean commandSequence_sempred(CommandSequenceContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return precpred(_ctx, 2);
		}
		return true;
	}
	private boolean commandArgList_sempred(CommandArgListContext _localctx, int predIndex) {
		switch (predIndex) {
		case 1:
			return precpred(_ctx, 1);
		}
		return true;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\20C\4\2\t\2\4\3\t"+
		"\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\3\2\3\2\3\2\5\2\26"+
		"\n\2\3\2\3\2\7\2\32\n\2\f\2\16\2\35\13\2\3\3\3\3\5\3!\n\3\3\3\3\3\3\4"+
		"\3\4\3\5\3\5\3\5\3\5\3\5\7\5,\n\5\f\5\16\5/\13\5\3\6\3\6\5\6\63\n\6\3"+
		"\7\3\7\3\7\3\7\3\7\3\7\5\7;\n\7\3\b\3\b\3\b\3\b\3\t\3\t\3\t\2\4\2\b\n"+
		"\2\4\6\b\n\f\16\20\2\2\2D\2\25\3\2\2\2\4\36\3\2\2\2\6$\3\2\2\2\b&\3\2"+
		"\2\2\n\62\3\2\2\2\f:\3\2\2\2\16<\3\2\2\2\20@\3\2\2\2\22\23\b\2\1\2\23"+
		"\26\5\4\3\2\24\26\7\2\2\3\25\22\3\2\2\2\25\24\3\2\2\2\26\33\3\2\2\2\27"+
		"\30\f\4\2\2\30\32\5\4\3\2\31\27\3\2\2\2\32\35\3\2\2\2\33\31\3\2\2\2\33"+
		"\34\3\2\2\2\34\3\3\2\2\2\35\33\3\2\2\2\36 \5\6\4\2\37!\5\b\5\2 \37\3\2"+
		"\2\2 !\3\2\2\2!\"\3\2\2\2\"#\7\3\2\2#\5\3\2\2\2$%\7\17\2\2%\7\3\2\2\2"+
		"&\'\b\5\1\2\'(\5\n\6\2(-\3\2\2\2)*\f\3\2\2*,\5\n\6\2+)\3\2\2\2,/\3\2\2"+
		"\2-+\3\2\2\2-.\3\2\2\2.\t\3\2\2\2/-\3\2\2\2\60\63\5\f\7\2\61\63\5\16\b"+
		"\2\62\60\3\2\2\2\62\61\3\2\2\2\63\13\3\2\2\2\64;\7\f\2\2\65;\7\r\2\2\66"+
		";\7\6\2\2\67;\7\5\2\28;\7\16\2\29;\7\17\2\2:\64\3\2\2\2:\65\3\2\2\2:\66"+
		"\3\2\2\2:\67\3\2\2\2:8\3\2\2\2:9\3\2\2\2;\r\3\2\2\2<=\5\20\t\2=>\7\4\2"+
		"\2>?\5\f\7\2?\17\3\2\2\2@A\7\17\2\2A\21\3\2\2\2\b\25\33 -\62:";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}
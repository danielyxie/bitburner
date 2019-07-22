// Generated from c:\Users\Helldragger\Documents\git projects\bitburner\u005Cutils\grammars\Terminal.g4 by ANTLR 4.7.1
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class TerminalLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.7.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		ENDOFCOMMAND=1, ASSIGN=2, SHORTFLAG=3, LONGFLAG=4, ESCAPECHAR=5, ESCAPEDSQCHAR=6, 
		ESCAPEDDQCHAR=7, SQCHAR=8, DQCHAR=9, DQSTRING=10, SQSTRING=11, NUMBER=12, 
		WORD=13, WHITESPACE=14;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	public static final String[] ruleNames = {
		"ENDOFCOMMAND", "ASSIGN", "SHORTFLAG", "LONGFLAG", "CHAR", "DIGIT", "SPECIAL", 
		"ESCAPECHAR", "ESCAPEDSQCHAR", "ESCAPEDDQCHAR", "SQCHAR", "DQCHAR", "DQSTRING", 
		"SQSTRING", "NUMBER", "WORD", "WHITESPACE"
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


	public TerminalLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "Terminal.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\20w\b\1\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t"+
		"\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
		"\3\2\3\2\5\2(\n\2\3\2\6\2+\n\2\r\2\16\2,\3\3\3\3\3\4\3\4\3\4\5\4\64\n"+
		"\4\3\5\3\5\3\5\3\5\3\5\3\6\3\6\3\7\3\7\3\b\3\b\3\t\3\t\3\n\3\n\3\n\3\13"+
		"\3\13\3\13\3\f\3\f\3\r\3\r\3\16\3\16\7\16O\n\16\f\16\16\16R\13\16\3\16"+
		"\3\16\3\17\3\17\7\17X\n\17\f\17\16\17[\13\17\3\17\3\17\3\20\6\20`\n\20"+
		"\r\20\16\20a\3\20\3\20\3\20\6\20g\n\20\r\20\16\20h\5\20k\n\20\3\21\3\21"+
		"\3\21\6\21p\n\21\r\21\16\21q\3\22\3\22\3\22\3\22\4PY\2\23\3\3\5\4\7\5"+
		"\t\6\13\2\r\2\17\2\21\7\23\b\25\t\27\n\31\13\33\f\35\r\37\16!\17#\20\3"+
		"\2\6\4\2C\\c|\3\2\62;\t\2\13\f\17\17\"\"\62;??C\\c|\5\2\13\f\17\17\"\""+
		"\2\177\2\3\3\2\2\2\2\5\3\2\2\2\2\7\3\2\2\2\2\t\3\2\2\2\2\21\3\2\2\2\2"+
		"\23\3\2\2\2\2\25\3\2\2\2\2\27\3\2\2\2\2\31\3\2\2\2\2\33\3\2\2\2\2\35\3"+
		"\2\2\2\2\37\3\2\2\2\2!\3\2\2\2\2#\3\2\2\2\3*\3\2\2\2\5.\3\2\2\2\7\60\3"+
		"\2\2\2\t\65\3\2\2\2\13:\3\2\2\2\r<\3\2\2\2\17>\3\2\2\2\21@\3\2\2\2\23"+
		"B\3\2\2\2\25E\3\2\2\2\27H\3\2\2\2\31J\3\2\2\2\33L\3\2\2\2\35U\3\2\2\2"+
		"\37_\3\2\2\2!o\3\2\2\2#s\3\2\2\2%+\7=\2\2&(\7\17\2\2\'&\3\2\2\2\'(\3\2"+
		"\2\2()\3\2\2\2)+\7\f\2\2*%\3\2\2\2*\'\3\2\2\2+,\3\2\2\2,*\3\2\2\2,-\3"+
		"\2\2\2-\4\3\2\2\2./\7?\2\2/\6\3\2\2\2\60\63\7/\2\2\61\64\5\13\6\2\62\64"+
		"\5\r\7\2\63\61\3\2\2\2\63\62\3\2\2\2\64\b\3\2\2\2\65\66\7/\2\2\66\67\7"+
		"/\2\2\678\3\2\2\289\5!\21\29\n\3\2\2\2:;\t\2\2\2;\f\3\2\2\2<=\t\3\2\2"+
		"=\16\3\2\2\2>?\n\4\2\2?\20\3\2\2\2@A\7^\2\2A\22\3\2\2\2BC\5\21\t\2CD\7"+
		")\2\2D\24\3\2\2\2EF\5\21\t\2FG\7$\2\2G\26\3\2\2\2HI\7)\2\2I\30\3\2\2\2"+
		"JK\7$\2\2K\32\3\2\2\2LP\5\31\r\2MO\13\2\2\2NM\3\2\2\2OR\3\2\2\2PQ\3\2"+
		"\2\2PN\3\2\2\2QS\3\2\2\2RP\3\2\2\2ST\5\31\r\2T\34\3\2\2\2UY\5\27\f\2V"+
		"X\13\2\2\2WV\3\2\2\2X[\3\2\2\2YZ\3\2\2\2YW\3\2\2\2Z\\\3\2\2\2[Y\3\2\2"+
		"\2\\]\5\27\f\2]\36\3\2\2\2^`\t\3\2\2_^\3\2\2\2`a\3\2\2\2a_\3\2\2\2ab\3"+
		"\2\2\2bj\3\2\2\2ck\3\2\2\2df\7\60\2\2eg\t\3\2\2fe\3\2\2\2gh\3\2\2\2hf"+
		"\3\2\2\2hi\3\2\2\2ik\3\2\2\2jc\3\2\2\2jd\3\2\2\2k \3\2\2\2lp\5\13\6\2"+
		"mp\5\r\7\2np\5\17\b\2ol\3\2\2\2om\3\2\2\2on\3\2\2\2pq\3\2\2\2qo\3\2\2"+
		"\2qr\3\2\2\2r\"\3\2\2\2st\t\5\2\2tu\3\2\2\2uv\b\22\2\2v$\3\2\2\2\16\2"+
		"\'*,\63PYahjoq\3\2\3\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}
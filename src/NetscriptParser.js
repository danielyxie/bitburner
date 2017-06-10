/* Parser
 *  Creates Abstract Syntax Tree Nodes
 * Operates on a stream of tokens from the Tokenizer 
 */ 
 
var FALSE = {type: "bool", value: false};

function Parser(input) {
    var PRECEDENCE = {
        "=": 1,
        "||": 2,
        "&&": 3,
        "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
        "+": 10, "-": 10,
        "*": 20, "/": 20, "%": 20,
    };
    return parse_toplevel();
	
	//Returns true if the next token is a punc type with value ch
    function is_punc(ch) {
        var tok = input.peek();
        return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
    }
	
	//Returns true if the next token is the kw keyword
    function is_kw(kw) {
        var tok = input.peek();
        return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
    }
	
	//Returns true if the next token is an op type with the given op value
    function is_op(op) {
        var tok = input.peek();
        return tok && tok.type == "op" && (!op || tok.value == op) && tok;
    }
	
	//Checks that the next character is the given punctuation character and throws
	//an error if it's not. If it is, skips over it in the input
    function checkPuncAndSkip(ch) {
        if (is_punc(ch)) input.next();
        else input.croak("Expecting punctuation: \"" + ch + "\"");
    }
	
	//Checks that the next character is the given keyword and throws an error
	//if its not. If it is, skips over it in the input
    function checkKeywordAndSkip(kw) {
        if (is_kw(kw)) input.next();
        else input.croak("Expecting keyword: \"" + kw + "\"");
    }
	
	//Checks that the next character is the given operator and throws an error
	//if its not. If it is, skips over it in the input
    function checkOpAndSkip(op) {
        if (is_op(op)) input.next();
        else input.croak("Expecting operator: \"" + op + "\"");
    }
	
    function unexpected() {
        input.croak("Unexpected token: " + JSON.stringify(input.peek()));
    }
	
    function maybe_binary(left, my_prec) {
        var tok = is_op();
        if (tok) {
            var his_prec = PRECEDENCE[tok.value];
            if (his_prec > my_prec) {
                input.next();
                return maybe_binary({
                    type     : tok.value == "=" ? "assign" : "binary",
                    operator : tok.value,
                    left     : left,
                    right    : maybe_binary(parse_atom(), his_prec)
                }, my_prec);
            }
        }
        return left;
    }
	
    function delimited(start, stop, separator, parser) {
        var a = [], first = true;
        checkPuncAndSkip(start);
        while (!input.eof()) {
            if (is_punc(stop)) break;
            if (first) first = false; else checkPuncAndSkip(separator);
            if (is_punc(stop)) break;
            a.push(parser());
        }
        checkPuncAndSkip(stop);
        return a;
    }
	
    function parse_call(func) {
        return {
            type: "call",
            func: func,
            args: delimited("(", ")", ",", parse_expression),
        };
    }
	
    function parse_varname() {
        var name = input.next();
        if (name.type != "var") input.croak("Expecting variable name");
        return name.value;
    }
	
	/* type: "if",
	 * cond: [ {"type": "var", "value": "cond1"}, {"type": "var", "value": "cond2"}...]
	 * then: [ {"type": "var", "value": "then1"}, {"type": "var", "value": "then2"}...]
	 * else: {"type": "var", "value": "foo"}
	 */
    function parse_if() {
        checkKeywordAndSkip("if");
		
		//Conditional
        var cond = parse_expression();
		
		//Body
        var then = parse_expression();
        var ret = {
            type: "if",
            cond: [],
            then: [],
        };
		ret.cond.push(cond);
		ret.then.push(then);
		
		// Parse all elif branches
		while (is_kw("elif")) {
			input.next();
			var cond = parse_expression();
			var then = parse_expression();
			ret.cond.push(cond);
			ret.then.push(then);
		}
		
		// Parse else branch, if it exists
        if (is_kw("else")) {
            input.next();
            ret.else = parse_expression();
        }
		
        return ret;
    }
	
	/* for (init, cond, postloop) {code;}
	 *
	 * type: "for",
	 * init: assign node,
	 * cond: var node,
	 * postloop: assign node
	 * code: prog node
	 */
	function parse_for() {
		checkKeywordAndSkip("for");

		temp = delimited("(", ")", ";", parse_expression);
        var splitExpressions = temp.slice();
		code = parse_expression();
		
		if (splitExpressions.length != 3) {
			throw new Error("for statement has incorrect number of arguments");
		}
		
		//TODO Check type of the init, cond, and postloop nodes 
		return {
			type: "for",
			init: splitExpressions[0],
			cond: splitExpressions[1],
			postloop: splitExpressions[2],
			code: code
		}
	}
	
	/* while (cond) {}
	 * 
	 * type: "while",
	 * cond: var node
	 * code: prog node
	 */
	function parse_while() {
		checkKeywordAndSkip("while");
		
		var cond = parse_expression();
		var code = parse_expression();
		return {
			type: "while",
			cond: cond,
			code: code
		}
	}
    
    /* hacknetnodes[i].operator
     */
    function parse_hacknetnodes() {
        var index = null;
        if (is_punc("[")) {
            index = parse_expression();
            if (index.type != "index") {
                unexpected();
            }
        }
        
        if (is_punc(".")) {
            checkPuncAndSkip(".");
            var op = maybe_call(function() {
                var tok = input.next();
                return tok;
            });
            return {
                type: "var",
                value: "hacknetnodes",
                index: index,
                op: op,
            };
        }
        unexpected();
    }
    
    function parse_array() {        
        //Declaring a new array with Array[1,2,3]
        var array = delimited("[", "]", ",", parse_expression);
        return {type: "var", 
                value: "array",
                array: array
                };
    }
    
    function parse_arrayindex() {
        var index = delimited("[", "]", ";", parse_expression);
        var val = 0;
        if (index.length == 1 && (index[0].type == "num" || index[0].type == "var")) {
            val = index[0];
        } else {
            val = 0;
            console.log("WARNING: Extra indices passed in")
        }
            
        return { type: "index", value: val };
    }
	
    function parse_bool() {
        return {
            type  : "bool",
            value : input.next().value == "true"
        };
    }
	
    function maybe_call(expr) {
        expr = expr();
        return is_punc("(") ? parse_call(expr) : expr;
    }
	
    function parse_atom() {
        return maybe_call(function(){
            if (is_punc("(")) {
                input.next();
                var exp = parse_expression();
                checkPuncAndSkip(")");
                return exp;
            }
            if (is_punc("{")) return parse_prog();
            if (is_punc("[")) return parse_arrayindex();
            if (is_kw("if")) return parse_if();
			if (is_kw("for")) return parse_for();
			if (is_kw("while")) return parse_while();
            if (is_kw("true") || is_kw("false")) return parse_bool();
            
            var tok = input.next();
            if (tok.type == "var" && tok.value == "hacknetnodes") return parse_hacknetnodes();
            if (tok.type == "var" && tok.value == "Array") return parse_array();
            if (tok.type == "var" && is_punc("[")) {
                //Returns a variable node except with an extra "index" field so 
                //we can identify it as an index
                var index = parse_arrayindex();
                if (index.type != "index") {
                    unexpected();
                }
                tok.index = index;
                return tok;
            }
            if (tok.type == "var" || tok.type == "num" || tok.type == "str")
                return tok;
            unexpected();
        });
    }
	
    function parse_toplevel() {
        var prog = [];
        while (!input.eof()) {
            prog.push(parse_expression());
            if (!input.eof()) checkPuncAndSkip(";");
        }
		//Return the top level Abstract Syntax Tree, where the top node is a "prog" node
        return { type: "prog", prog: prog };
    }
	
    function parse_prog() {
        var prog = delimited("{", "}", ";", parse_expression);
        if (prog.length == 0) return FALSE;
        if (prog.length == 1) return prog[0];
        return { type: "prog", prog: prog };
    }
	
    function parse_expression() {
        return maybe_call(function(){
            return maybe_binary(parse_atom(), 0);
        });
    }
}
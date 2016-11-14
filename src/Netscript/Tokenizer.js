/* Tokenizer 
 * Acts on top of the InputStream class. Takes in a character input stream and and parses it into tokens.
 * Tokens can be accessed with peek() and next().
 *
 *  Token types:
 *      {type: "punc", value: "(" }           // punctuation: parens, comma, semicolon etc.
 *      {type: "num", value: 5 }              // numbers
 *      {type: "str", value: "Hello World!" } // strings
 *      {type: "kw", value: "lambda" }        // keywords
 *      {type: "var", value: "a" }            // identifiers
 *      {type: "op", value: "!=" }            // operators
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
 
function Tokenizer(input) {
    var current = null;
    var keywords = " if then else true false while for ";
    
    return {
        next    : next,
        peek    : peek,
        eof     : eof,
        croak   : input.croak
    }
    
    function is_keyword(x) {
        return keywords.indexOf(" " + x + " ") >= 0;
    }
    
    function is_digit(ch) {
        return /[0-9]/i.test(ch);
    }
    
    //An identifier can start with any letter or an underscore
    function is_id_start(ch) {
        return /[a-z_]/i.test(ch);
    }
    
    function is_id(ch) {
        return is_id_start(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
    }
    
    function is_op_char(ch) {
        return "+-*/%=&|<>!".indexOf(ch) >= 0;
    }
    
    function is_punc(ch) {
        return ",;(){}[]".indexOf(ch) >= 0;
    }
    
    function is_whitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    }
    
    function read_while(predicate) {
        var str = "";
        while (!input.eof() && predicate(input.peek()))
            str += input.next();
        return str;
    }
    
    function read_number() {
        var has_dot = false;
        //Reads the number from the input. Checks for only a single decimal point
        var number = read_while(function(ch){
            if (ch == ".") {
                if (has_dot) return false;
                has_dot = true;
                return true;
            }
            return is_digit(ch);
        });
        return { type: "num", value: parseFloat(number) };
    }
    
    //This function also checks the identifier against a list of known keywords (defined at the top)
    //and will return a kw object rather than identifier if it is one
    function read_ident() {
        //Identifier must start with a letter or underscore..and can contain anything from ?!-<>=0123456789
        var id = read_while(is_id);
        return {
            type  : is_keyword(id) ? "kw" : "var",
            value : id
        };
    }
    
    function read_escaped(end) {
        var escaped = false, str = "";
        input.next();   //Skip the quotation mark
        while (!input.eof()) {
            var ch = input.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch == "\\") {
                escaped = true;
            } else if (ch == end) {
                break;
            } else {
                str += ch;
            }
        }
        return str;
    }
    
    function read_string() {
        return { type: "str", value: read_escaped('"') };
    }
    
    //Only supports single-line comments right now
    function skip_comment() {
        read_while(function(ch){ return ch != "\n" });
        input.next();
    }
    
    //Gets the next token
    function read_next() {
        //Skip over whitespace
        read_while(is_whitespace);
        
        if (input.eof()) return null;
        
        //Peek the next character and decide what to do based on what that
        //next character is
        var ch = input.peek();
        
        if (ch == "//") {
            skip_comment();
            return read_next();
        }
        
        if (ch == '"')          return read_string();
        if (is_digit(ch))       return read_number();
        if (is_id_start(ch))    return read_ident();    
        if (is_punc(ch)) return {
            type    : "punc",
            value   : input.next()
        }
        if (is_op_char(ch)) return {
            type    : "op",
            value   : read_while(is_op_char)
        }
        
    }
    
    function peek() {
        //Returns current token, unless its null in which case it grabs the next one
        //and returns it
        return current || (current = read_next());
    }
    
    function next() {
        //The token might have been peaked already, in which case read_next() was already
        //called so just return current
        var tok = current;
        current = null;
        return tok || read_next();
    }
    
    function eof() {
        return peek() == null;
    }
}

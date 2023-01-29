import * as acorn from "acorn";
/**
 * @license
 * JavaScript Interpreter
 *
 * Copyright 2013 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Interpreting JavaScript in JavaScript.
 * @author fraser@google.com (Neil Fraser)
 */
("use strict");

/**
 * Create a new interpreter.
 * @param {string|!Object} code Raw JavaScript text or AST.
 * @param {Function=} opt_initFunc Optional initialization function.  Used to
 *     define APIs.  When called it is passed the interpreter object and the
 *     global scope object.
 * @param {Number} Bitburner-specific number used for determining exception line numbers
 * @constructor
 */
var Interpreter = function (code, opt_initFunc, lineOffset = 0) {
  this.sourceCode = code;
  this.sourceCodeLineOffset = lineOffset;
  if (typeof code === "string") {
    code = acorn.parse(code, Interpreter.PARSE_OPTIONS);
  }
  this.ast = code;
  this.initFunc_ = opt_initFunc;
  this.paused_ = false;
  this.polyfills_ = [];
  // Unique identifier for native functions.  Used in serialization.
  this.functionCounter_ = 0;
  // Map node types to our step function names; a property lookup is faster
  // than string concatenation with "step" prefix.
  this.stepFunctions_ = Object.create(null);
  var stepMatch = /^step([A-Z]\w*)$/;
  var m;
  for (var methodName in this) {
    if (typeof this[methodName] === "function" && (m = methodName.match(stepMatch))) {
      this.stepFunctions_[m[1]] = this[methodName].bind(this);
    }
  }
  // Create and initialize the global scope.
  this.global = this.createScope(this.ast, null);
  // Run the polyfills.
  this.ast = acorn.parse(this.polyfills_.join("\n"), Interpreter.PARSE_OPTIONS);
  this.polyfills_ = undefined; // Allow polyfill strings to garbage collect.
  this.stripLocations_(this.ast, undefined, undefined);
  var state = new Interpreter.State(this.ast, this.global);
  state.done = false;
  this.stateStack = [state];
  this.run();
  this.value = undefined;
  // Point at the main program.
  this.ast = code;
  var state = new Interpreter.State(this.ast, this.global);
  state.done = false;
  this.stateStack.length = 0;
  this.stateStack[0] = state;
  // Get a handle on Acorn's node_t object.  It's tricky to access.
  this.nodeConstructor = state.node.constructor;
  // Preserve publicly properties from being pruned/renamed by JS compilers.
  // Add others as needed.
  this["stateStack"] = this.stateStack;
};

/**
 * @const {!Object} Configuration used for all Acorn parsing.
 */
Interpreter.PARSE_OPTIONS = {
  ecmaVersion: 5,
  locations: true,
};

/**
 * Property descriptor of readonly properties.
 */
Interpreter.READONLY_DESCRIPTOR = {
  configurable: true,
  enumerable: true,
  writable: false,
};

/**
 * Property descriptor of non-enumerable properties.
 */
Interpreter.NONENUMERABLE_DESCRIPTOR = {
  configurable: true,
  enumerable: false,
  writable: true,
};

/**
 * Property descriptor of readonly, non-enumerable properties.
 */
Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR = {
  configurable: true,
  enumerable: false,
  writable: false,
};

/**
 * Property descriptor of variables.
 */
Interpreter.VARIABLE_DESCRIPTOR = {
  configurable: false,
  enumerable: true,
  writable: true,
};

/**
 * Unique symbol for indicating that a step has encountered an error, has
 * added it to the stack, and will be thrown within the user's program.
 * When STEP_ERROR is thrown in the JS-Interpreter, the error can be ignored.
 */
Interpreter.STEP_ERROR = {};

/**
 * Unique symbol for indicating that a reference is a variable on the scope,
 * not an object property.
 */
Interpreter.SCOPE_REFERENCE = {};

/**
 * Unique symbol for indicating, when used as the value of the value
 * parameter in calls to setProperty and friends, that the value
 * should be taken from the property descriptor instead.
 */
Interpreter.VALUE_IN_DESCRIPTOR = {};

/**
 * For cycle detection in array to string and error conversion;
 * see spec bug github.com/tc39/ecma262/issues/289
 * Since this is for atomic actions only, it can be a class property.
 */
Interpreter.toStringCycles_ = [];

/**
 * Determine error/exception line number in Bitburner source code
 * @param {Object} AST Node that causes Error/Exception
 */
Interpreter.prototype.getErrorLineNumber = function (node) {
  var code = this.sourceCode;
  if (node == null || node.start == null) {
    return NaN;
  }
  try {
    code = code.substring(0, node.start);
    return (code.match(/\n/g) || []).length + 1 - this.sourceCodeLineOffset;
  } catch (e) {
    return NaN;
  }
};

/**
 * Generate the appropriate line number error message for Bitburner
 * @param {Number} lineNumber
 */
Interpreter.prototype.getErrorLineNumberMessage = function (lineNumber) {
  if (isNaN(lineNumber)) {
    return " (Unknown line number)";
  } else if (lineNumber <= 0) {
    return " (Error occurred in an imported function)";
  } else {
    return (
      " (Line Number " +
      lineNumber +
      ". This line number is probably incorrect " +
      "if your script is importing any functions. This is being worked on)"
    );
  }
};

/**
 * Add more code to the interpreter.
 * @param {string|!Object} code Raw JavaScript text or AST.
 */
Interpreter.prototype.appendCode = function (code) {
  var state = this.stateStack[0];
  if (!state || state.node["type"] !== "Program") {
    throw Error("Expecting original AST to start with a Program node.");
  }
  if (typeof code === "string") {
    code = acorn.parse(code, Interpreter.PARSE_OPTIONS);
  }
  if (!code || code["type"] !== "Program") {
    throw Error("Expecting new AST to start with a Program node.");
  }
  this.populateScope_(code, state.scope);
  // Append the new program to the old one.
  for (var i = 0, node; (node = code["body"][i]); i++) {
    state.node["body"].push(node);
  }
  state.done = false;
};

/**
 * Execute one step of the interpreter.
 * @return {boolean} True if a step was executed, false if no more instructions.
 */
Interpreter.prototype.step = function () {
  var stack = this.stateStack;
  var state = stack[stack.length - 1];
  if (!state) {
    return false;
  }
  var node = state.node,
    type = node["type"];
  if (type === "Program" && state.done) {
    return false;
  } else if (this.paused_) {
    return true;
  }
  try {
    var nextState = this.stepFunctions_[type](stack, state, node);
  } catch (e) {
    // Eat any step errors.  They have been thrown on the stack.
    if (e !== Interpreter.STEP_ERROR) {
      // Uh oh.  This is a real error in the JS-Interpreter.  Rethrow.
      throw e;
    }
  }
  if (nextState) {
    stack.push(nextState);
  }
  if (!node["end"]) {
    // This is polyfill code.  Keep executing until we arrive at user code.
    return this.step();
  }
  return true;
};

/**
 * Execute the interpreter to program completion.  Vulnerable to infinite loops.
 * @return {boolean} True if a execution is asynchronously blocked,
 *     false if no more instructions.
 */
Interpreter.prototype.run = function () {
  while (!this.paused_ && this.step()) {}
  return this.paused_;
};

/**
 * Initialize the global scope with buitin properties and functions.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initGlobalScope = function (scope) {
  // Initialize uneditable global properties.
  this.setProperty(scope, "NaN", NaN, Interpreter.READONLY_DESCRIPTOR);
  this.setProperty(scope, "Infinity", Infinity, Interpreter.READONLY_DESCRIPTOR);
  this.setProperty(scope, "undefined", undefined, Interpreter.READONLY_DESCRIPTOR);
  this.setProperty(scope, "window", scope, Interpreter.READONLY_DESCRIPTOR);
  this.setProperty(scope, "this", scope, Interpreter.READONLY_DESCRIPTOR);
  this.setProperty(scope, "self", scope); // Editable.

  // Create the objects which will become Object.prototype and
  // Function.prototype, which are needed to bootstrap everything else.
  this.OBJECT_PROTO = new Interpreter.Object(null);
  this.FUNCTION_PROTO = new Interpreter.Object(this.OBJECT_PROTO);
  // Initialize global objects.
  this.initFunction(scope);
  this.initObject(scope);
  // Unable to set scope's parent prior (OBJECT did not exist).
  // Note that in a browser this would be 'Window', whereas in Node.js it would
  // be 'Object'.  This interpreter is closer to Node in that it has no DOM.
  scope.proto = this.OBJECT_PROTO;
  this.setProperty(scope, "constructor", this.OBJECT, Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.initArray(scope);
  this.initString(scope);
  this.initBoolean(scope);
  this.initNumber(scope);
  this.initDate(scope);
  this.initRegExp(scope);
  this.initError(scope);
  this.initMath(scope);
  this.initJSON(scope);

  // Initialize global functions.
  var thisInterpreter = this;
  var func = this.createNativeFunction(function (x) {
    throw EvalError("Can't happen");
  }, false);
  func.eval = true;
  this.setProperty(scope, "eval", func);

  this.setProperty(scope, "parseInt", this.createNativeFunction(parseInt, false));
  this.setProperty(scope, "parseFloat", this.createNativeFunction(parseFloat, false));

  this.setProperty(scope, "isNaN", this.createNativeFunction(isNaN, false));

  this.setProperty(scope, "isFinite", this.createNativeFunction(isFinite, false));

  var strFunctions = [
    [escape, "escape"],
    [unescape, "unescape"],
    [decodeURI, "decodeURI"],
    [decodeURIComponent, "decodeURIComponent"],
    [encodeURI, "encodeURI"],
    [encodeURIComponent, "encodeURIComponent"],
  ];
  for (var i = 0; i < strFunctions.length; i++) {
    var wrapper = (function (nativeFunc) {
      return function (str) {
        try {
          return nativeFunc(str);
        } catch (e) {
          // decodeURI('%xy') will throw an error.  Catch and rethrow.
          thisInterpreter.throwException(thisInterpreter.URI_ERROR, e.message);
        }
      };
    })(strFunctions[i][0]);
    this.setProperty(
      scope,
      strFunctions[i][1],
      this.createNativeFunction(wrapper, false),
      Interpreter.NONENUMERABLE_DESCRIPTOR,
    );
  }
  // Preserve publicly properties from being pruned/renamed by JS compilers.
  // Add others as needed.
  this["OBJECT"] = this.OBJECT;
  this["OBJECT_PROTO"] = this.OBJECT_PROTO;
  this["FUNCTION"] = this.FUNCTION;
  this["FUNCTION_PROTO"] = this.FUNCTION_PROTO;
  this["ARRAY"] = this.ARRAY;
  this["ARRAY_PROTO"] = this.ARRAY_PROTO;
  this["REGEXP"] = this.REGEXP;
  this["REGEXP_PROTO"] = this.REGEXP_PROTO;
  this["DATE"] = this.DATE;
  this["DATE_PROTO"] = this.DATE_PROTO;
  // The following properties are obsolete.  Do not use.
  this["UNDEFINED"] = undefined;
  this["NULL"] = null;
  this["NAN"] = NaN;
  this["TRUE"] = true;
  this["FALSE"] = false;
  this["STRING_EMPTY"] = "";
  this["NUMBER_ZERO"] = 0;
  this["NUMBER_ONE"] = 1;

  // Run any user-provided initialization.
  if (this.initFunc_) {
    this.initFunc_(this, scope);
  }
};

/**
 * Initialize the Function class.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initFunction = function (scope) {
  var thisInterpreter = this;
  var wrapper;
  var identifierRegexp = /^[A-Za-z_$][\w$]*$/;
  // Function constructor.
  wrapper = function (var_args) {
    if (thisInterpreter.calledWithNew()) {
      // Called as new Function().
      var newFunc = this;
    } else {
      // Called as Function().
      var newFunc = thisInterpreter.createObjectProto(thisInterpreter.FUNCTION_PROTO);
    }
    if (arguments.length) {
      var code = String(arguments[arguments.length - 1]);
    } else {
      var code = "";
    }
    var argsStr = Array.prototype.slice.call(arguments, 0, -1).join(",").trim();
    if (argsStr) {
      var args = argsStr.split(/\s*,\s*/);
      for (var i = 0; i < args.length; i++) {
        var name = args[i];
        if (!identifierRegexp.test(name)) {
          thisInterpreter.throwException(thisInterpreter.SYNTAX_ERROR, "Invalid function argument: " + name);
        }
      }
      argsStr = args.join(", ");
    }
    // Interestingly, the scope for constructed functions is the global scope,
    // even if they were constructed in some other scope.
    newFunc.parentScope = thisInterpreter.global;
    // Acorn needs to parse code in the context of a function or else 'return'
    // statements will be syntax errors.
    try {
      var ast = acorn.parse("(function(" + argsStr + ") {" + code + "})", Interpreter.PARSE_OPTIONS);
    } catch (e) {
      // Acorn threw a SyntaxError.  Rethrow as a trappable error.
      thisInterpreter.throwException(thisInterpreter.SYNTAX_ERROR, "Invalid code: " + e.message);
    }
    if (ast["body"].length !== 1) {
      // Function('a', 'return a + 6;}; {alert(1);');
      thisInterpreter.throwException(thisInterpreter.SYNTAX_ERROR, "Invalid code in function body.");
    }
    newFunc.node = ast["body"][0]["expression"];
    thisInterpreter.setProperty(newFunc, "length", newFunc.node["length"], Interpreter.READONLY_DESCRIPTOR);
    return newFunc;
  };
  wrapper.id = this.functionCounter_++;
  this.FUNCTION = this.createObjectProto(this.FUNCTION_PROTO);

  this.setProperty(scope, "Function", this.FUNCTION);
  // Manually setup type and prototype because createObj doesn't recognize
  // this object as a function (this.FUNCTION did not exist).
  this.setProperty(this.FUNCTION, "prototype", this.FUNCTION_PROTO);
  this.FUNCTION.nativeFunc = wrapper;

  // Configure Function.prototype.
  this.setProperty(this.FUNCTION_PROTO, "constructor", this.FUNCTION, Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.FUNCTION_PROTO.nativeFunc = function () {};
  this.FUNCTION_PROTO.nativeFunc.id = this.functionCounter_++;
  this.setProperty(this.FUNCTION_PROTO, "length", 0, Interpreter.READONLY_DESCRIPTOR);

  var boxThis = function (value) {
    // In non-strict mode 'this' must be an object.
    if ((!value || !value.isObject) && !thisInterpreter.getScope().strict) {
      if (value === undefined || value === null) {
        // 'Undefined' and 'null' are changed to global object.
        value = thisInterpreter.global;
      } else {
        // Primitives must be boxed in non-strict mode.
        var box = thisInterpreter.createObjectProto(thisInterpreter.getPrototype(value));
        box.data = value;
        value = box;
      }
    }
    return value;
  };

  wrapper = function (thisArg, args) {
    var state = thisInterpreter.stateStack[thisInterpreter.stateStack.length - 1];
    // Rewrite the current 'CallExpression' to apply a different function.
    state.func_ = this;
    // Assign the 'this' object.
    state.funcThis_ = boxThis(thisArg);
    // Bind any provided arguments.
    state.arguments_ = [];
    if (args !== null && args !== undefined) {
      if (args.isObject) {
        state.arguments_ = thisInterpreter.arrayPseudoToNative(args);
      } else {
        thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, "CreateListFromArrayLike called on non-object");
      }
    }
    state.doneExec_ = false;
  };
  this.setNativeFunctionPrototype(this.FUNCTION, "apply", wrapper);

  wrapper = function (thisArg /*, var_args */) {
    var state = thisInterpreter.stateStack[thisInterpreter.stateStack.length - 1];
    // Rewrite the current 'CallExpression' to call a different function.
    state.func_ = this;
    // Assign the 'this' object.
    state.funcThis_ = boxThis(thisArg);
    // Bind any provided arguments.
    state.arguments_ = [];
    for (var i = 1; i < arguments.length; i++) {
      state.arguments_.push(arguments[i]);
    }
    state.doneExec_ = false;
  };
  this.setNativeFunctionPrototype(this.FUNCTION, "call", wrapper);

  this.polyfills_.push(
    // Polyfill copied from:
    // developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind
    "Object.defineProperty(Function.prototype, 'bind',",
    "{configurable: true, writable: true, value:",
    "function(oThis) {",
    "if (typeof this !== 'function') {",
    "throw TypeError('What is trying to be bound is not callable');",
    "}",
    "var aArgs   = Array.prototype.slice.call(arguments, 1),",
    "fToBind = this,",
    "fNOP    = function() {},",
    "fBound  = function() {",
    "return fToBind.apply(this instanceof fNOP",
    "? this",
    ": oThis,",
    "aArgs.concat(Array.prototype.slice.call(arguments)));",
    "};",
    "if (this.prototype) {",
    "fNOP.prototype = this.prototype;",
    "}",
    "fBound.prototype = new fNOP();",
    "return fBound;",
    "}",
    "});",
    "",
  );

  // Function has no parent to inherit from, so it needs its own mandatory
  // toString and valueOf functions.
  wrapper = function () {
    return this.toString();
  };
  this.setNativeFunctionPrototype(this.FUNCTION, "toString", wrapper);
  this.setProperty(
    this.FUNCTION,
    "toString",
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );
  wrapper = function () {
    return this.valueOf();
  };
  this.setNativeFunctionPrototype(this.FUNCTION, "valueOf", wrapper);
  this.setProperty(
    this.FUNCTION,
    "valueOf",
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );
};

/**
 * Initialize the Object class.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initObject = function (scope) {
  var thisInterpreter = this;
  var wrapper;
  // Object constructor.
  wrapper = function (value) {
    if (value === undefined || value === null) {
      // Create a new object.
      if (thisInterpreter.calledWithNew()) {
        // Called as new Object().
        return this;
      } else {
        // Called as Object().
        return thisInterpreter.createObjectProto(thisInterpreter.OBJECT_PROTO);
      }
    }
    if (!value.isObject) {
      // Wrap the value as an object.
      var box = thisInterpreter.createObjectProto(thisInterpreter.getPrototype(value));
      box.data = value;
      return box;
    }
    // Return the provided object.
    return value;
  };
  this.OBJECT = this.createNativeFunction(wrapper, true);
  // Throw away the created prototype and use the root prototype.
  this.setProperty(this.OBJECT, "prototype", this.OBJECT_PROTO);
  this.setProperty(this.OBJECT_PROTO, "constructor", this.OBJECT, Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.setProperty(scope, "Object", this.OBJECT);

  /**
   * Checks if the provided value is null or undefined.
   * If so, then throw an error in the call stack.
   * @param {Interpreter.Value} value Value to check.
   */
  var throwIfNullUndefined = function (value) {
    if (value === undefined || value === null) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, "Cannot convert '" + value + "' to object");
    }
  };

  // Static methods on Object.
  wrapper = function (obj) {
    throwIfNullUndefined(obj);
    var props = obj.isObject ? obj.properties : obj;
    return thisInterpreter.arrayNativeToPseudo(Object.getOwnPropertyNames(props));
  };
  this.setProperty(
    this.OBJECT,
    "getOwnPropertyNames",
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );

  wrapper = function (obj) {
    throwIfNullUndefined(obj);
    if (obj.isObject) {
      obj = obj.properties;
    }
    return thisInterpreter.arrayNativeToPseudo(Object.keys(obj));
  };
  this.setProperty(
    this.OBJECT,
    "keys",
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );

  wrapper = function (proto) {
    // Support for the second argument is the responsibility of a polyfill.
    if (proto === null) {
      return thisInterpreter.createObjectProto(null);
    }
    if (proto === undefined || !proto.isObject) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, "Object prototype may only be an Object or null");
    }
    return thisInterpreter.createObjectProto(proto);
  };
  this.setProperty(
    this.OBJECT,
    "create",
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );

  // Add a polyfill to handle create's second argument.
  this.polyfills_.push(
    "(function() {",
    "var create_ = Object.create;",
    "Object.create = function(proto, props) {",
    "var obj = create_(proto);",
    "props && Object.defineProperties(obj, props);",
    "return obj;",
    "};",
    "})();",
    "",
  );

  wrapper = function (obj, prop, descriptor) {
    prop = String(prop);
    if (!obj || !obj.isObject) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, "Object.defineProperty called on non-object");
    }
    if (!descriptor || !descriptor.isObject) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, "Property description must be an object");
    }
    if (!obj.properties[prop] && obj.preventExtensions) {
      thisInterpreter.throwException(
        thisInterpreter.TYPE_ERROR,
        "Can't define property '" + prop + "', object is not extensible",
      );
    }
    // The polyfill guarantees no inheritance and no getter functions.
    // Therefore the descriptor properties map is the native object needed.
    thisInterpreter.setProperty(obj, prop, Interpreter.VALUE_IN_DESCRIPTOR, descriptor.properties);
    return obj;
  };
  this.setProperty(
    this.OBJECT,
    "defineProperty",
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );

  this.polyfills_.push(
    // Flatten the descriptor to remove any inheritance or getter functions.
    "(function() {",
    "var defineProperty_ = Object.defineProperty;",
    "Object.defineProperty = function(obj, prop, d1) {",
    "var d2 = {};",
    "if ('configurable' in d1) d2.configurable = d1.configurable;",
    "if ('enumerable' in d1) d2.enumerable = d1.enumerable;",
    "if ('writable' in d1) d2.writable = d1.writable;",
    "if ('value' in d1) d2.value = d1.value;",
    "if ('get' in d1) d2.get = d1.get;",
    "if ('set' in d1) d2.set = d1.set;",
    "return defineProperty_(obj, prop, d2);",
    "};",
    "})();",

    "Object.defineProperty(Object, 'defineProperties',",
    "{configurable: true, writable: true, value:",
    "function(obj, props) {",
    "var keys = Object.keys(props);",
    "for (var i = 0; i < keys.length; i++) {",
    "Object.defineProperty(obj, keys[i], props[keys[i]]);",
    "}",
    "return obj;",
    "}",
    "});",
    "",
  );

  wrapper = function (obj, prop) {
    if (!obj || !obj.isObject) {
      thisInterpreter.throwException(
        thisInterpreter.TYPE_ERROR,
        "Object.getOwnPropertyDescriptor called on non-object",
      );
    }
    prop = String(prop);
    if (!(prop in obj.properties)) {
      return undefined;
    }
    var descriptor = Object.getOwnPropertyDescriptor(obj.properties, prop);
    var getter = obj.getter[prop];
    var setter = obj.setter[prop];

    if (getter || setter) {
      descriptor.get = getter;
      descriptor.set = setter;
      delete descriptor.value;
      delete descriptor.writable;
    }
    // Preserve value, but remove it for the nativeToPseudo call.
    var value = descriptor.value;
    var hasValue = "value" in descriptor;
    delete descriptor.value;
    var pseudoDescriptor = thisInterpreter.nativeToPseudo(descriptor);
    if (hasValue) {
      thisInterpreter.setProperty(pseudoDescriptor, "value", value);
    }
    return pseudoDescriptor;
  };
  this.setProperty(
    this.OBJECT,
    "getOwnPropertyDescriptor",
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );

  wrapper = function (obj) {
    throwIfNullUndefined(obj);
    return thisInterpreter.getPrototype(obj);
  };
  this.setProperty(
    this.OBJECT,
    "getPrototypeOf",
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );

  wrapper = function (obj) {
    return Boolean(obj) && !obj.preventExtensions;
  };
  this.setProperty(
    this.OBJECT,
    "isExtensible",
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );

  wrapper = function (obj) {
    if (obj && obj.isObject) {
      obj.preventExtensions = true;
    }
    return obj;
  };
  this.setProperty(
    this.OBJECT,
    "preventExtensions",
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );

  // Instance methods on Object.
  this.setNativeFunctionPrototype(this.OBJECT, "toString", Interpreter.Object.prototype.toString);
  this.setNativeFunctionPrototype(this.OBJECT, "toLocaleString", Interpreter.Object.prototype.toString);
  this.setNativeFunctionPrototype(this.OBJECT, "valueOf", Interpreter.Object.prototype.valueOf);

  wrapper = function (prop) {
    throwIfNullUndefined(this);
    if (!this.isObject) {
      return this.hasOwnProperty(prop);
    }
    return String(prop) in this.properties;
  };
  this.setNativeFunctionPrototype(this.OBJECT, "hasOwnProperty", wrapper);

  wrapper = function (prop) {
    throwIfNullUndefined(this);
    if (!this.isObject) {
      return this.propertyIsEnumerable(prop);
    }
    return Object.prototype.propertyIsEnumerable.call(this.properties, prop);
  };
  this.setNativeFunctionPrototype(this.OBJECT, "propertyIsEnumerable", wrapper);

  wrapper = function (obj) {
    while (true) {
      // Note, circular loops shouldn't be possible.
      obj = thisInterpreter.getPrototype(obj);
      if (!obj) {
        // No parent; reached the top.
        return false;
      }
      if (obj === this) {
        return true;
      }
    }
  };
  this.setNativeFunctionPrototype(this.OBJECT, "isPrototypeOf", wrapper);
};

/**
 * Initialize the Array class.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initArray = function (scope) {
  var thisInterpreter = this;
  var wrapper;
  // Array constructor.
  wrapper = function (var_args) {
    if (thisInterpreter.calledWithNew()) {
      // Called as new Array().
      var newArray = this;
    } else {
      // Called as Array().
      var newArray = thisInterpreter.createObjectProto(thisInterpreter.ARRAY_PROTO);
    }
    var first = arguments[0];
    if (arguments.length === 1 && typeof first === "number") {
      if (isNaN(Interpreter.legalArrayLength(first))) {
        thisInterpreter.throwException(thisInterpreter.RANGE_ERROR, "Invalid array length");
      }
      newArray.properties.length = first;
    } else {
      for (var i = 0; i < arguments.length; i++) {
        newArray.properties[i] = arguments[i];
      }
      newArray.properties.length = i;
    }
    return newArray;
  };
  this.ARRAY = this.createNativeFunction(wrapper, true);
  this.ARRAY_PROTO = this.ARRAY.properties["prototype"];
  this.setProperty(scope, "Array", this.ARRAY);

  // Static methods on Array.
  wrapper = function (obj) {
    return obj && obj.class === "Array";
  };
  this.setProperty(
    this.ARRAY,
    "isArray",
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );

  // Instance methods on Array.
  wrapper = function () {
    return Array.prototype.pop.call(this.properties);
  };
  this.setNativeFunctionPrototype(this.ARRAY, "pop", wrapper);

  wrapper = function (var_args) {
    return Array.prototype.push.apply(this.properties, arguments);
  };
  this.setNativeFunctionPrototype(this.ARRAY, "push", wrapper);

  wrapper = function () {
    return Array.prototype.shift.call(this.properties);
  };
  this.setNativeFunctionPrototype(this.ARRAY, "shift", wrapper);

  wrapper = function (var_args) {
    return Array.prototype.unshift.apply(this.properties, arguments);
  };
  this.setNativeFunctionPrototype(this.ARRAY, "unshift", wrapper);

  wrapper = function () {
    Array.prototype.reverse.call(this.properties);
    return this;
  };
  this.setNativeFunctionPrototype(this.ARRAY, "reverse", wrapper);

  wrapper = function (index, howmany /*, var_args*/) {
    var list = Array.prototype.splice.apply(this.properties, arguments);
    return thisInterpreter.arrayNativeToPseudo(list);
  };
  this.setNativeFunctionPrototype(this.ARRAY, "splice", wrapper);

  wrapper = function (opt_begin, opt_end) {
    var list = Array.prototype.slice.call(this.properties, opt_begin, opt_end);
    return thisInterpreter.arrayNativeToPseudo(list);
  };
  this.setNativeFunctionPrototype(this.ARRAY, "slice", wrapper);

  wrapper = function (opt_separator) {
    return Array.prototype.join.call(this.properties, opt_separator);
  };
  this.setNativeFunctionPrototype(this.ARRAY, "join", wrapper);

  wrapper = function (var_args) {
    var list = [];
    var length = 0;
    // Start by copying the current array.
    var iLength = thisInterpreter.getProperty(this, "length");
    for (var i = 0; i < iLength; i++) {
      if (thisInterpreter.hasProperty(this, i)) {
        var element = thisInterpreter.getProperty(this, i);
        list[length] = element;
      }
      length++;
    }
    // Loop through all arguments and copy them in.
    for (var i = 0; i < arguments.length; i++) {
      var value = arguments[i];
      if (thisInterpreter.isa(value, thisInterpreter.ARRAY)) {
        var jLength = thisInterpreter.getProperty(value, "length");
        for (var j = 0; j < jLength; j++) {
          if (thisInterpreter.hasProperty(value, j)) {
            list[length] = thisInterpreter.getProperty(value, j);
          }
          length++;
        }
      } else {
        list[length] = value;
      }
    }
    return thisInterpreter.arrayNativeToPseudo(list);
  };
  this.setNativeFunctionPrototype(this.ARRAY, "concat", wrapper);

  wrapper = function (searchElement, opt_fromIndex) {
    return Array.prototype.indexOf.apply(this.properties, arguments);
  };
  this.setNativeFunctionPrototype(this.ARRAY, "indexOf", wrapper);

  wrapper = function (searchElement, opt_fromIndex) {
    return Array.prototype.lastIndexOf.apply(this.properties, arguments);
  };
  this.setNativeFunctionPrototype(this.ARRAY, "lastIndexOf", wrapper);

  wrapper = function () {
    Array.prototype.sort.call(this.properties);
    return this;
  };
  this.setNativeFunctionPrototype(this.ARRAY, "sort", wrapper);

  this.polyfills_.push(
    // Polyfill copied from:
    // developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/every
    "Object.defineProperty(Array.prototype, 'every',",
    "{configurable: true, writable: true, value:",
    "function(callbackfn, thisArg) {",
    "if (!this || typeof callbackfn !== 'function') throw TypeError();",
    "var T, k;",
    "var O = Object(this);",
    "var len = O.length >>> 0;",
    "if (arguments.length > 1) T = thisArg;",
    "k = 0;",
    "while (k < len) {",
    "if (k in O && !callbackfn.call(T, O[k], k, O)) return false;",
    "k++;",
    "}",
    "return true;",
    "}",
    "});",

    // Polyfill copied from:
    // developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    "Object.defineProperty(Array.prototype, 'filter',",
    "{configurable: true, writable: true, value:",
    "function(fun/*, thisArg*/) {",
    "if (this === void 0 || this === null || typeof fun !== 'function') throw TypeError();",
    "var t = Object(this);",
    "var len = t.length >>> 0;",
    "var res = [];",
    "var thisArg = arguments.length >= 2 ? arguments[1] : void 0;",
    "for (var i = 0; i < len; i++) {",
    "if (i in t) {",
    "var val = t[i];",
    "if (fun.call(thisArg, val, i, t)) res.push(val);",
    "}",
    "}",
    "return res;",
    "}",
    "});",

    // Polyfill copied from:
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    "if (!Array.prototype.find) {",
    "Object.defineProperty(Array.prototype, 'find', {",
    "value: function(predicate) {",
    "if (this == null) {",
    "throw new TypeError('\"this\" is null or not defined');",
    "}",
    "var o = Object(this);",
    "var len = o.length >>> 0;",
    "if (typeof predicate !== 'function') {",
    "throw new TypeError('predicate must be a function');",
    "}",
    "var thisArg = arguments[1];",
    "var k = 0;",
    "while (k < len) {",
    "var kValue = o[k];",
    "if (predicate.call(thisArg, kValue, k, o)) {",
    "return kValue;",
    "}",
    "k++;",
    "}",
    "return undefined;",
    "},",
    "configurable: true,",
    "writable: true",
    "});",
    "}",

    // Poly fill copied from:
    // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
    "if (!Array.prototype.findIndex) {",
    "Object.defineProperty(Array.prototype, 'findIndex', {",
    "value: function(predicate) {",
    "if (this == null) {",
    "throw new TypeError('\"this\" is null or not defined');",
    "}",
    "var o = Object(this);",
    "var len = o.length >>> 0;",
    "if (typeof predicate !== 'function') {",
    "throw new TypeError('predicate must be a function');",
    "}",
    "var thisArg = arguments[1];",
    "var k = 0;",
    "while (k < len) {",
    "var kValue = o[k];",
    "if (predicate.call(thisArg, kValue, k, o)) {",
    "return k;",
    "}",
    "k++;",
    "}",
    "return -1;",
    "},",
    "configurable: true,",
    "writable: true",
    "});",
    "}",

    // Polyfill copied from:
    // developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    "Object.defineProperty(Array.prototype, 'forEach',",
    "{configurable: true, writable: true, value:",
    "function(callback, thisArg) {",
    "if (!this || typeof callback !== 'function') throw TypeError();",
    "var T, k;",
    "var O = Object(this);",
    "var len = O.length >>> 0;",
    "if (arguments.length > 1) T = thisArg;",
    "k = 0;",
    "while (k < len) {",
    "if (k in O) callback.call(T, O[k], k, O);",
    "k++;",
    "}",
    "}",
    "});",

    // Polyfill copied from:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill
    "Object.defineProperty(Array.prototype, 'includes', {",
    "value: function(searchElement, fromIndex) {",
    "if (this == null) {",
    "throw new TypeError('\"this\" is null or not defined');",
    "}",
    "// 1. Let O be ? ToObject(this value).",
    "var o = Object(this);",
    '// 2. Let len be ? ToLength(? Get(O, "length")).',
    "var len = o.length >>> 0;",
    "// 3. If len is 0, return false.",
    "if (len === 0) {",
    "return false;",
    "}",
    "// 4. Let n be ? ToInteger(fromIndex).",
    "//    (If fromIndex is undefined, this step produces the value 0.)",
    "var n = fromIndex | 0;",
    "// 5. If n ≥ 0, then",
    "//  a. Let k be n.",
    "// 6. Else n < 0,",
    "//  a. Let k be len + n.",
    "//  b. If k < 0, let k be 0.",
    "var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);",
    "function sameValueZero(x, y) {",
    "return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));",
    "}",
    "// 7. Repeat, while k < len",
    "while (k < len) {",
    "// a. Let elementK be the result of ? Get(O, ! ToString(k)).",
    "// b. If SameValueZero(searchElement, elementK) is true, return true.",
    "if (sameValueZero(o[k], searchElement)) {",
    "return true;",
    "}",
    "// c. Increase k by 1. ",
    "k++;",
    "}",
    "// 8. Return false",
    "return false;",
    "}",
    "});",

    // Polyfill copied from:
    // developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    "Object.defineProperty(Array.prototype, 'map',",
    "{configurable: true, writable: true, value:",
    "function(callback, thisArg) {",
    "if (!this || typeof callback !== 'function') new TypeError;",
    "var T, A, k;",
    "var O = Object(this);",
    "var len = O.length >>> 0;",
    "if (arguments.length > 1) T = thisArg;",
    "A = new Array(len);",
    "k = 0;",
    "while (k < len) {",
    "if (k in O) A[k] = callback.call(T, O[k], k, O);",
    "k++;",
    "}",
    "return A;",
    "}",
    "});",

    // Polyfill copied from:
    // developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    "Object.defineProperty(Array.prototype, 'reduce',",
    "{configurable: true, writable: true, value:",
    "function(callback /*, initialValue*/) {",
    "if (!this || typeof callback !== 'function') throw TypeError();",
    "var t = Object(this), len = t.length >>> 0, k = 0, value;",
    "if (arguments.length === 2) {",
    "value = arguments[1];",
    "} else {",
    "while (k < len && !(k in t)) k++;",
    "if (k >= len) {",
    "throw TypeError('Reduce of empty array with no initial value');",
    "}",
    "value = t[k++];",
    "}",
    "for (; k < len; k++) {",
    "if (k in t) value = callback(value, t[k], k, t);",
    "}",
    "return value;",
    "}",
    "});",

    // Polyfill copied from:
    // developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight
    "Object.defineProperty(Array.prototype, 'reduceRight',",
    "{configurable: true, writable: true, value:",
    "function(callback /*, initialValue*/) {",
    "if (null === this || 'undefined' === typeof this || 'function' !== typeof callback) throw TypeError();",
    "var t = Object(this), len = t.length >>> 0, k = len - 1, value;",
    "if (arguments.length >= 2) {",
    "value = arguments[1];",
    "} else {",
    "while (k >= 0 && !(k in t)) k--;",
    "if (k < 0) {",
    "throw TypeError('Reduce of empty array with no initial value');",
    "}",
    "value = t[k--];",
    "}",
    "for (; k >= 0; k--) {",
    "if (k in t) value = callback(value, t[k], k, t);",
    "}",
    "return value;",
    "}",
    "});",

    // Polyfill copied from:
    // developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/some
    "Object.defineProperty(Array.prototype, 'some',",
    "{configurable: true, writable: true, value:",
    "function(fun/*, thisArg*/) {",
    "if (!this || typeof fun !== 'function') throw TypeError();",
    "var t = Object(this);",
    "var len = t.length >>> 0;",
    "var thisArg = arguments.length >= 2 ? arguments[1] : void 0;",
    "for (var i = 0; i < len; i++) {",
    "if (i in t && fun.call(thisArg, t[i], i, t)) {",
    "return true;",
    "}",
    "}",
    "return false;",
    "}",
    "});",

    "(function() {",
    "var sort_ = Array.prototype.sort;",
    "Array.prototype.sort = function(opt_comp) {",
    // Fast native sort.
    "if (typeof opt_comp !== 'function') {",
    "return sort_.call(this);",
    "}",
    // Slow bubble sort.
    "for (var i = 0; i < this.length; i++) {",
    "var changes = 0;",
    "for (var j = 0; j < this.length - i - 1; j++) {",
    "if (opt_comp(this[j], this[j + 1]) > 0) {",
    "var swap = this[j];",
    "this[j] = this[j + 1];",
    "this[j + 1] = swap;",
    "changes++;",
    "}",
    "}",
    "if (!changes) break;",
    "}",
    "return this;",
    "};",
    "})();",

    "Object.defineProperty(Array.prototype, 'toLocaleString',",
    "{configurable: true, writable: true, value:",
    "function() {",
    "var out = [];",
    "for (var i = 0; i < this.length; i++) {",
    "out[i] = (this[i] === null || this[i] === undefined) ? '' : this[i].toLocaleString();",
    "}",
    "return out.join(',');",
    "}",
    "});",
    "",
  );
};

/**
 * Initialize the String class.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initString = function (scope) {
  var thisInterpreter = this;
  var wrapper;
  // String constructor.
  wrapper = function (value) {
    value = String(value);
    if (thisInterpreter.calledWithNew()) {
      // Called as new String().
      this.data = value;
      return this;
    } else {
      // Called as String().
      return value;
    }
  };
  this.STRING = this.createNativeFunction(wrapper, true);
  this.setProperty(scope, "String", this.STRING);

  // Static methods on String.
  this.setProperty(
    this.STRING,
    "fromCharCode",
    this.createNativeFunction(String.fromCharCode, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );

  // Instance methods on String.
  // Methods with exclusively primitive arguments.
  var functions = [
    "charAt",
    "charCodeAt",
    "concat",
    "indexOf",
    "lastIndexOf",
    "slice",
    "substr",
    "substring",
    "toLocaleLowerCase",
    "toLocaleUpperCase",
    "toLowerCase",
    "toUpperCase",
    "trim",
  ];
  for (var i = 0; i < functions.length; i++) {
    this.setNativeFunctionPrototype(this.STRING, functions[i], String.prototype[functions[i]]);
  }

  wrapper = function (compareString, locales, options) {
    locales = locales ? thisInterpreter.pseudoToNative(locales) : undefined;
    options = options ? thisInterpreter.pseudoToNative(options) : undefined;
    return String(this).localeCompare(compareString, locales, options);
  };
  this.setNativeFunctionPrototype(this.STRING, "localeCompare", wrapper);

  wrapper = function (separator, limit) {
    if (thisInterpreter.isa(separator, thisInterpreter.REGEXP)) {
      separator = separator.data;
    }
    var jsList = String(this).split(separator, limit);
    return thisInterpreter.arrayNativeToPseudo(jsList);
  };
  this.setNativeFunctionPrototype(this.STRING, "split", wrapper);

  wrapper = function (regexp) {
    if (thisInterpreter.isa(regexp, thisInterpreter.REGEXP)) {
      regexp = regexp.data;
    }
    var m = String(this).match(regexp);
    return m && thisInterpreter.arrayNativeToPseudo(m);
  };
  this.setNativeFunctionPrototype(this.STRING, "match", wrapper);

  wrapper = function (regexp) {
    if (thisInterpreter.isa(regexp, thisInterpreter.REGEXP)) {
      regexp = regexp.data;
    }
    return String(this).search(regexp);
  };
  this.setNativeFunctionPrototype(this.STRING, "search", wrapper);

  wrapper = function (substr, newSubstr) {
    // Support for function replacements is the responsibility of a polyfill.
    if (thisInterpreter.isa(substr, thisInterpreter.REGEXP)) {
      substr = substr.data;
    }
    return String(this).replace(substr, newSubstr);
  };
  this.setNativeFunctionPrototype(this.STRING, "replace", wrapper);
  // Add a polyfill to handle replace's second argument being a function.
  this.polyfills_.push(
    "(function() {",
    "var replace_ = String.prototype.replace;",
    "String.prototype.replace = function(substr, newSubstr) {",
    "if (typeof newSubstr !== 'function') {",
    // string.replace(string|regexp, string)
    "return replace_.call(this, substr, newSubstr);",
    "}",
    "var str = this;",
    "if (substr instanceof RegExp) {", // string.replace(regexp, function)
    "var subs = [];",
    "var m = substr.exec(str);",
    "while (m) {",
    "m.push(m.index, str);",
    "var inject = newSubstr.apply(null, m);",
    "subs.push([m.index, m[0].length, inject]);",
    "m = substr.global ? substr.exec(str) : null;",
    "}",
    "for (var i = subs.length - 1; i >= 0; i--) {",
    "str = str.substring(0, subs[i][0]) + subs[i][2] + " + "str.substring(subs[i][0] + subs[i][1]);",
    "}",
    "} else {", // string.replace(string, function)
    "var i = str.indexOf(substr);",
    "if (i !== -1) {",
    "var inject = newSubstr(str.substr(i, substr.length), i, str);",
    "str = str.substring(0, i) + inject + " + "str.substring(i + substr.length);",
    "}",
    "}",
    "return str;",
    "};",
    "})();",

    // Polyfill copied from:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
    "if (!String.prototype.endsWith) {",
    "String.prototype.endsWith = function(search, this_len) {",
    "if (this_len === undefined || this_len > this.length) {",
    "this_len = this.length;",
    "}",
    "return this.substring(this_len - search.length, this_len) === search;",
    "};",
    "}",

    //Polyfill copied from:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
    "if (!String.prototype.includes) {",
    "String.prototype.includes = function(search, start) {",
    "'use strict';",
    "if (typeof start !== 'number') {",
    "start = 0;",
    "}",
    "    ",
    "if (start + search.length > this.length) {",
    "return false;",
    "} else {",
    "return this.indexOf(search, start) !== -1;",
    "}",
    "};",
    "}",

    // Polyfill copied from:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
    "if (!String.prototype.startsWith) {",
    "String.prototype.startsWith = function(search, pos) {",
    "return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;",
    "};",
    "}",

    "",
  );
};

/**
 * Initialize the Boolean class.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initBoolean = function (scope) {
  var thisInterpreter = this;
  var wrapper;
  // Boolean constructor.
  wrapper = function (value) {
    value = Boolean(value);
    if (thisInterpreter.calledWithNew()) {
      // Called as new Boolean().
      this.data = value;
      return this;
    } else {
      // Called as Boolean().
      return value;
    }
  };
  this.BOOLEAN = this.createNativeFunction(wrapper, true);
  this.setProperty(scope, "Boolean", this.BOOLEAN);
};

/**
 * Initialize the Number class.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initNumber = function (scope) {
  var thisInterpreter = this;
  var wrapper;
  // Number constructor.
  wrapper = function (value) {
    value = Number(value);
    if (thisInterpreter.calledWithNew()) {
      // Called as new Number().
      this.data = value;
      return this;
    } else {
      // Called as Number().
      return value;
    }
  };
  this.NUMBER = this.createNativeFunction(wrapper, true);
  this.setProperty(scope, "Number", this.NUMBER);

  var numConsts = ["MAX_VALUE", "MIN_VALUE", "NaN", "NEGATIVE_INFINITY", "POSITIVE_INFINITY"];
  for (var i = 0; i < numConsts.length; i++) {
    this.setProperty(this.NUMBER, numConsts[i], Number[numConsts[i]], Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  }

  // Instance methods on Number.
  wrapper = function (fractionDigits) {
    try {
      return Number(this).toExponential(fractionDigits);
    } catch (e) {
      // Throws if fractionDigits isn't within 0-20.
      thisInterpreter.throwException(thisInterpreter.ERROR, e.message);
    }
  };
  this.setNativeFunctionPrototype(this.NUMBER, "toExponential", wrapper);

  wrapper = function (digits) {
    try {
      return Number(this).toFixed(digits);
    } catch (e) {
      // Throws if digits isn't within 0-20.
      thisInterpreter.throwException(thisInterpreter.ERROR, e.message);
    }
  };
  this.setNativeFunctionPrototype(this.NUMBER, "toFixed", wrapper);

  wrapper = function (precision) {
    try {
      return Number(this).toPrecision(precision);
    } catch (e) {
      // Throws if precision isn't within range (depends on implementation).
      thisInterpreter.throwException(thisInterpreter.ERROR, e.message);
    }
  };
  this.setNativeFunctionPrototype(this.NUMBER, "toPrecision", wrapper);

  wrapper = function (radix) {
    try {
      return Number(this).toString(radix);
    } catch (e) {
      // Throws if radix isn't within 2-36.
      thisInterpreter.throwException(thisInterpreter.ERROR, e.message);
    }
  };
  this.setNativeFunctionPrototype(this.NUMBER, "toString", wrapper);

  wrapper = function (locales, options) {
    locales = locales ? thisInterpreter.pseudoToNative(locales) : undefined;
    options = options ? thisInterpreter.pseudoToNative(options) : undefined;
    return Number(this).toLocaleString(locales, options);
  };
  this.setNativeFunctionPrototype(this.NUMBER, "toLocaleString", wrapper);
};

/**
 * Initialize the Date class.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initDate = function (scope) {
  var thisInterpreter = this;
  var wrapper;
  // Date constructor.
  wrapper = function (value, var_args) {
    if (!thisInterpreter.calledWithNew()) {
      // Called as Date().
      // Calling Date() as a function returns a string, no arguments are heeded.
      return Date();
    }
    // Called as new Date().
    var args = [null].concat(Array.from(arguments));
    this.data = new (Function.prototype.bind.apply(Date, args))();
    return this;
  };
  this.DATE = this.createNativeFunction(wrapper, true);
  this.DATE_PROTO = this.DATE.properties["prototype"];
  this.setProperty(scope, "Date", this.DATE);

  // Static methods on Date.
  this.setProperty(this.DATE, "now", this.createNativeFunction(Date.now, false), Interpreter.NONENUMERABLE_DESCRIPTOR);

  this.setProperty(
    this.DATE,
    "parse",
    this.createNativeFunction(Date.parse, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );

  this.setProperty(this.DATE, "UTC", this.createNativeFunction(Date.UTC, false), Interpreter.NONENUMERABLE_DESCRIPTOR);

  // Instance methods on Date.
  var functions = [
    "getDate",
    "getDay",
    "getFullYear",
    "getHours",
    "getMilliseconds",
    "getMinutes",
    "getMonth",
    "getSeconds",
    "getTime",
    "getTimezoneOffset",
    "getUTCDate",
    "getUTCDay",
    "getUTCFullYear",
    "getUTCHours",
    "getUTCMilliseconds",
    "getUTCMinutes",
    "getUTCMonth",
    "getUTCSeconds",
    "getYear",
    "setDate",
    "setFullYear",
    "setHours",
    "setMilliseconds",
    "setMinutes",
    "setMonth",
    "setSeconds",
    "setTime",
    "setUTCDate",
    "setUTCFullYear",
    "setUTCHours",
    "setUTCMilliseconds",
    "setUTCMinutes",
    "setUTCMonth",
    "setUTCSeconds",
    "setYear",
    "toDateString",
    "toISOString",
    "toJSON",
    "toGMTString",
    "toLocaleDateString",
    "toLocaleString",
    "toLocaleTimeString",
    "toTimeString",
    "toUTCString",
  ];
  for (var i = 0; i < functions.length; i++) {
    wrapper = (function (nativeFunc) {
      return function (var_args) {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args[i] = thisInterpreter.pseudoToNative(arguments[i]);
        }
        return this.data[nativeFunc].apply(this.data, args);
      };
    })(functions[i]);
    this.setNativeFunctionPrototype(this.DATE, functions[i], wrapper);
  }
};

/**
 * Initialize Regular Expression object.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initRegExp = function (scope) {
  var thisInterpreter = this;
  var wrapper;
  // RegExp constructor.
  wrapper = function (pattern, flags) {
    if (thisInterpreter.calledWithNew()) {
      // Called as new RegExp().
      var rgx = this;
    } else {
      // Called as RegExp().
      var rgx = thisInterpreter.createObjectProto(thisInterpreter.REGEXP_PROTO);
    }
    pattern = pattern ? pattern.toString() : "";
    flags = flags ? flags.toString() : "";
    thisInterpreter.populateRegExp(rgx, new RegExp(pattern, flags));
    return rgx;
  };
  this.REGEXP = this.createNativeFunction(wrapper, true);
  this.REGEXP_PROTO = this.REGEXP.properties["prototype"];
  this.setProperty(scope, "RegExp", this.REGEXP);

  this.setProperty(
    this.REGEXP.properties["prototype"],
    "global",
    undefined,
    Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR,
  );
  this.setProperty(
    this.REGEXP.properties["prototype"],
    "ignoreCase",
    undefined,
    Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR,
  );
  this.setProperty(
    this.REGEXP.properties["prototype"],
    "multiline",
    undefined,
    Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR,
  );
  this.setProperty(
    this.REGEXP.properties["prototype"],
    "source",
    "(?:)",
    Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR,
  );

  wrapper = function (str) {
    return this.data.test(str);
  };
  this.setNativeFunctionPrototype(this.REGEXP, "test", wrapper);

  wrapper = function (str) {
    str = str.toString();
    // Get lastIndex from wrapped regex, since this is settable.
    this.data.lastIndex = Number(thisInterpreter.getProperty(this, "lastIndex"));
    var match = this.data.exec(str);
    thisInterpreter.setProperty(this, "lastIndex", this.data.lastIndex);

    if (match) {
      var result = thisInterpreter.createObjectProto(thisInterpreter.ARRAY_PROTO);
      for (var i = 0; i < match.length; i++) {
        thisInterpreter.setProperty(result, i, match[i]);
      }
      // match has additional properties.
      thisInterpreter.setProperty(result, "index", match.index);
      thisInterpreter.setProperty(result, "input", match.input);
      return result;
    }
    return null;
  };
  this.setNativeFunctionPrototype(this.REGEXP, "exec", wrapper);
};

/**
 * Initialize the Error class.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initError = function (scope) {
  var thisInterpreter = this;
  // Error constructor.
  this.ERROR = this.createNativeFunction(function (opt_message) {
    if (thisInterpreter.calledWithNew()) {
      // Called as new Error().
      var newError = this;
    } else {
      // Called as Error().
      var newError = thisInterpreter.createObject(thisInterpreter.ERROR);
    }
    if (opt_message) {
      thisInterpreter.setProperty(newError, "message", String(opt_message), Interpreter.NONENUMERABLE_DESCRIPTOR);
    }
    return newError;
  }, true);
  this.setProperty(scope, "Error", this.ERROR);
  this.setProperty(this.ERROR.properties["prototype"], "message", "", Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.setProperty(this.ERROR.properties["prototype"], "name", "Error", Interpreter.NONENUMERABLE_DESCRIPTOR);

  var createErrorSubclass = function (name) {
    var constructor = thisInterpreter.createNativeFunction(function (opt_message) {
      if (thisInterpreter.calledWithNew()) {
        // Called as new XyzError().
        var newError = this;
      } else {
        // Called as XyzError().
        var newError = thisInterpreter.createObject(constructor);
      }
      if (opt_message) {
        thisInterpreter.setProperty(newError, "message", String(opt_message), Interpreter.NONENUMERABLE_DESCRIPTOR);
      }
      return newError;
    }, true);
    thisInterpreter.setProperty(constructor, "prototype", thisInterpreter.createObject(thisInterpreter.ERROR));
    thisInterpreter.setProperty(
      constructor.properties["prototype"],
      "name",
      name,
      Interpreter.NONENUMERABLE_DESCRIPTOR,
    );
    thisInterpreter.setProperty(scope, name, constructor);

    return constructor;
  };

  this.EVAL_ERROR = createErrorSubclass("EvalError");
  this.RANGE_ERROR = createErrorSubclass("RangeError");
  this.REFERENCE_ERROR = createErrorSubclass("ReferenceError");
  this.SYNTAX_ERROR = createErrorSubclass("SyntaxError");
  this.TYPE_ERROR = createErrorSubclass("TypeError");
  this.URI_ERROR = createErrorSubclass("URIError");
};

/**
 * Initialize Math object.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initMath = function (scope) {
  var thisInterpreter = this;
  var myMath = this.createObjectProto(this.OBJECT_PROTO);
  this.setProperty(scope, "Math", myMath);
  var mathConsts = ["E", "LN2", "LN10", "LOG2E", "LOG10E", "PI", "SQRT1_2", "SQRT2"];
  for (var i = 0; i < mathConsts.length; i++) {
    this.setProperty(myMath, mathConsts[i], Math[mathConsts[i]], Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  }
  var numFunctions = [
    "abs",
    "acos",
    "asin",
    "atan",
    "atan2",
    "ceil",
    "cos",
    "exp",
    "floor",
    "log",
    "max",
    "min",
    "pow",
    "random",
    "round",
    "sin",
    "sqrt",
    "tan",
  ];
  for (var i = 0; i < numFunctions.length; i++) {
    this.setProperty(
      myMath,
      numFunctions[i],
      this.createNativeFunction(Math[numFunctions[i]], false),
      Interpreter.NONENUMERABLE_DESCRIPTOR,
    );
  }
};

/**
 * Initialize JSON object.
 * @param {!Interpreter.Object} scope Global scope.
 */
Interpreter.prototype.initJSON = function (scope) {
  var thisInterpreter = this;
  var myJSON = thisInterpreter.createObjectProto(this.OBJECT_PROTO);
  this.setProperty(scope, "JSON", myJSON);

  var wrapper = function (text) {
    try {
      var nativeObj = JSON.parse(text.toString());
    } catch (e) {
      thisInterpreter.throwException(thisInterpreter.SYNTAX_ERROR, e.message);
    }
    return thisInterpreter.nativeToPseudo(nativeObj);
  };
  this.setProperty(myJSON, "parse", this.createNativeFunction(wrapper, false));

  wrapper = function (value) {
    var nativeObj = thisInterpreter.pseudoToNative(value);
    try {
      var str = JSON.stringify(nativeObj);
    } catch (e) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, e.message);
    }
    return str;
  };
  this.setProperty(myJSON, "stringify", this.createNativeFunction(wrapper, false));
};

/**
 * Is an object of a certain class?
 * @param {Interpreter.Value} child Object to check.
 * @param {Interpreter.Object} constructor Constructor of object.
 * @return {boolean} True if object is the class or inherits from it.
 *     False otherwise.
 */
Interpreter.prototype.isa = function (child, constructor) {
  if (child === null || child === undefined || !constructor) {
    return false;
  }
  var proto = constructor.properties["prototype"];
  if (child === proto) {
    return true;
  }
  // The first step up the prototype chain is harder since the child might be
  // a primitive value.  Subsequent steps can just follow the .proto property.
  child = this.getPrototype(child);
  while (child) {
    if (child === proto) {
      return true;
    }
    child = child.proto;
  }
  return false;
};

/**
 * Is a value a legal integer for an array length?
 * @param {Interpreter.Value} x Value to check.
 * @return {number} Zero, or a positive integer if the value can be
 *     converted to such.  NaN otherwise.
 */
Interpreter.legalArrayLength = function (x) {
  var n = x >>> 0;
  // Array length must be between 0 and 2^32-1 (inclusive).
  return n === Number(x) ? n : NaN;
};

/**
 * Is a value a legal integer for an array index?
 * @param {Interpreter.Value} x Value to check.
 * @return {number} Zero, or a positive integer if the value can be
 *     converted to such.  NaN otherwise.
 */
Interpreter.legalArrayIndex = function (x) {
  var n = x >>> 0;
  // Array index cannot be 2^32-1, otherwise length would be 2^32.
  // 0xffffffff is 2^32-1.
  return String(n) === String(x) && n !== 0xffffffff ? n : NaN;
};

/**
 * Typedef for JS values.
 * @typedef {!Interpreter.Object|boolean|number|string|undefined|null}
 */
Interpreter.Value;

/**
 * Class for an object.
 * @param {Interpreter.Object} proto Prototype object or null.
 * @constructor
 */
Interpreter.Object = function (proto) {
  this.getter = Object.create(null);
  this.setter = Object.create(null);
  this.properties = Object.create(null);
  this.proto = proto;
};

/** @type {Interpreter.Object} */
Interpreter.Object.prototype.proto = null;

/** @type {boolean} */
Interpreter.Object.prototype.isObject = true;

/** @type {string} */
Interpreter.Object.prototype.class = "Object";

/** @type {Date|RegExp|boolean|number|string|undefined|null} */
Interpreter.Object.prototype.data = null;

/**
 * Convert this object into a string.
 * @return {string} String value.
 * @override
 */
Interpreter.Object.prototype.toString = function () {
  if (this.class === "Array") {
    // Array
    var cycles = Interpreter.toStringCycles_;
    cycles.push(this);
    try {
      var strs = [];
      for (var i = 0; i < this.properties.length; i++) {
        var value = this.properties[i];
        strs[i] = value && value.isObject && cycles.indexOf(value) !== -1 ? "..." : value;
      }
    } finally {
      cycles.pop();
    }
    return strs.join(",");
  }
  if (this.class === "Error") {
    var cycles = Interpreter.toStringCycles_;
    if (cycles.indexOf(this) !== -1) {
      return "[object Error]";
    }
    var name, message;
    // Bug: Does not support getters and setters for name or message.
    var obj = this;
    do {
      if ("name" in obj.properties) {
        name = obj.properties["name"];
        break;
      }
    } while ((obj = obj.proto));
    var obj = this;
    do {
      if ("message" in obj.properties) {
        message = obj.properties["message"];
        break;
      }
    } while ((obj = obj.proto));
    cycles.push(this);
    try {
      name = name && name.toString();
      message = message && message.toString();
    } finally {
      cycles.pop();
    }
    return message ? name + ": " + message : String(name);
  }

  // RegExp, Date, and boxed primitives.
  if (this.data !== null) {
    return String(this.data);
  }

  return "[object " + this.class + "]";
};

/**
 * Return the object's value.
 * @return {Interpreter.Value} Value.
 * @override
 */
Interpreter.Object.prototype.valueOf = function () {
  if (this.data === undefined || this.data === null || this.data instanceof RegExp) {
    return this; // An Object.
  }
  if (this.data instanceof Date) {
    return this.data.valueOf(); // Milliseconds.
  }
  return /** @type {(boolean|number|string)} */ (this.data); // Boxed primitive.
};

/**
 * Create a new data object based on a constructor's prototype.
 * @param {Interpreter.Object} constructor Parent constructor function,
 *     or null if scope object.
 * @return {!Interpreter.Object} New data object.
 */
Interpreter.prototype.createObject = function (constructor) {
  return this.createObjectProto(constructor && constructor.properties["prototype"]);
};

/**
 * Create a new data object based on a prototype.
 * @param {Interpreter.Object} proto Prototype object.
 * @return {!Interpreter.Object} New data object.
 */
Interpreter.prototype.createObjectProto = function (proto) {
  if (typeof proto !== "object") {
    throw Error("Non object prototype");
  }
  var obj = new Interpreter.Object(proto);
  // Functions have prototype objects.
  if (this.isa(obj, this.FUNCTION)) {
    this.setProperty(obj, "prototype", this.createObjectProto(this.OBJECT_PROTO || null));
    obj.class = "Function";
  }
  // Arrays have length.
  if (this.isa(obj, this.ARRAY)) {
    this.setProperty(obj, "length", 0, {
      configurable: false,
      enumerable: false,
      writable: true,
    });
    obj.class = "Array";
  }
  if (this.isa(obj, this.ERROR)) {
    obj.class = "Error";
  }
  return obj;
};

/**
 * Initialize a pseudo regular expression object based on a native regular
 * expression object.
 * @param {!Interpreter.Object} pseudoRegexp The existing object to set.
 * @param {!RegExp} nativeRegexp The native regular expression.
 */
Interpreter.prototype.populateRegExp = function (pseudoRegexp, nativeRegexp) {
  pseudoRegexp.data = nativeRegexp;
  // lastIndex is settable, all others are read-only attributes
  this.setProperty(pseudoRegexp, "lastIndex", nativeRegexp.lastIndex, Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.setProperty(pseudoRegexp, "source", nativeRegexp.source, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  this.setProperty(pseudoRegexp, "global", nativeRegexp.global, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  this.setProperty(pseudoRegexp, "ignoreCase", nativeRegexp.ignoreCase, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  this.setProperty(pseudoRegexp, "multiline", nativeRegexp.multiline, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
};

/**
 * Create a new function.
 * @param {!Object} node AST node defining the function.
 * @param {!Object} scope Parent scope.
 * @return {!Interpreter.Object} New function.
 */
Interpreter.prototype.createFunction = function (node, scope) {
  var func = this.createObjectProto(this.FUNCTION_PROTO);
  func.parentScope = scope;
  func.node = node;
  this.setProperty(func, "length", func.node["params"].length, Interpreter.READONLY_DESCRIPTOR);
  return func;
};

/**
 * Create a new native function.
 * @param {!Function} nativeFunc JavaScript function.
 * @param {boolean=} opt_constructor If true, the function's
 * prototype will have its constructor property set to the function.
 * If false, the function cannot be called as a constructor (e.g. escape).
 * Defaults to undefined.
 * @return {!Interpreter.Object} New function.
 */
Interpreter.prototype.createNativeFunction = function (nativeFunc, opt_constructor) {
  var func = this.createObjectProto(this.FUNCTION_PROTO);
  func.nativeFunc = nativeFunc;
  nativeFunc.id = this.functionCounter_++;
  this.setProperty(func, "length", nativeFunc.length, Interpreter.READONLY_DESCRIPTOR);
  if (opt_constructor) {
    this.setProperty(func.properties["prototype"], "constructor", func, Interpreter.NONENUMERABLE_DESCRIPTOR);
  } else if (opt_constructor === false) {
    func.illegalConstructor = true;
    this.setProperty(func, "prototype", undefined);
  }
  return func;
};

/**
 * Create a new native asynchronous function.
 * @param {!Function} asyncFunc JavaScript function.
 * @return {!Interpreter.Object} New function.
 */
Interpreter.prototype.createAsyncFunction = function (asyncFunc) {
  var func = this.createObjectProto(this.FUNCTION_PROTO);
  func.asyncFunc = asyncFunc;
  asyncFunc.id = this.functionCounter_++;
  this.setProperty(func, "length", asyncFunc.length, Interpreter.READONLY_DESCRIPTOR);
  return func;
};

/**
 * Converts from a native JS object or value to a JS interpreter object.
 * Can handle JSON-style values, does NOT handle cycles.
 * @param {*} nativeObj The native JS object to be converted.
 * @return {Interpreter.Value} The equivalent JS interpreter object.
 */
Interpreter.prototype.nativeToPseudo = function (nativeObj) {
  if ((typeof nativeObj !== "object" && typeof nativeObj !== "function") || nativeObj === null) {
    return nativeObj;
  }

  if (nativeObj instanceof RegExp) {
    var pseudoRegexp = this.createObjectProto(this.REGEXP_PROTO);
    this.populateRegExp(pseudoRegexp, nativeObj);
    return pseudoRegexp;
  }

  if (nativeObj instanceof Date) {
    var pseudoDate = this.createObjectProto(this.DATE_PROTO);
    pseudoDate.data = nativeObj;
    return pseudoDate;
  }

  if (nativeObj instanceof Function) {
    var interpreter = this;
    var wrapper = function () {
      return interpreter.nativeToPseudo(
        nativeObj.apply(
          interpreter,
          Array.prototype.slice.call(arguments).map(function (i) {
            return interpreter.pseudoToNative(i);
          }),
        ),
      );
    };
    return this.createNativeFunction(wrapper, undefined);
  }

  var pseudoObj;
  if (Array.isArray(nativeObj)) {
    // Array.
    pseudoObj = this.createObjectProto(this.ARRAY_PROTO);
    for (var i = 0; i < nativeObj.length; i++) {
      if (i in nativeObj) {
        this.setProperty(pseudoObj, i, this.nativeToPseudo(nativeObj[i]));
      }
    }
  } else {
    // Object.
    pseudoObj = this.createObjectProto(this.OBJECT_PROTO);
    for (var key in nativeObj) {
      this.setProperty(pseudoObj, key, this.nativeToPseudo(nativeObj[key]));
    }
  }
  return pseudoObj;
};

/**
 * Converts from a JS interpreter object to native JS object.
 * Can handle JSON-style values, plus cycles.
 * @param {Interpreter.Value} pseudoObj The JS interpreter object to be
 * converted.
 * @param {Object=} opt_cycles Cycle detection (used in recursive calls).
 * @return {*} The equivalent native JS object or value.
 */
Interpreter.prototype.pseudoToNative = function (pseudoObj, opt_cycles) {
  if ((typeof pseudoObj !== "object" && typeof pseudoObj !== "function") || pseudoObj === null) {
    return pseudoObj;
  }

  if (this.isa(pseudoObj, this.REGEXP)) {
    // Regular expression.
    return pseudoObj.data;
  }

  if (this.isa(pseudoObj, this.DATE)) {
    // Date.
    return pseudoObj.data;
  }

  var cycles = opt_cycles || {
    pseudo: [],
    native: [],
  };
  var i = cycles.pseudo.indexOf(pseudoObj);
  if (i !== -1) {
    return cycles.native[i];
  }
  cycles.pseudo.push(pseudoObj);
  var nativeObj;
  if (this.isa(pseudoObj, this.ARRAY)) {
    // Array.
    nativeObj = [];
    cycles.native.push(nativeObj);
    var length = this.getProperty(pseudoObj, "length");
    for (var i = 0; i < length; i++) {
      if (this.hasProperty(pseudoObj, i)) {
        nativeObj[i] = this.pseudoToNative(this.getProperty(pseudoObj, i), cycles);
      }
    }
  } else {
    // Object.
    nativeObj = {};
    cycles.native.push(nativeObj);
    var val;
    for (var key in pseudoObj.properties) {
      val = pseudoObj.properties[key];
      nativeObj[key] = this.pseudoToNative(val, cycles);
    }
  }
  cycles.pseudo.pop();
  cycles.native.pop();
  return nativeObj;
};

/**
 * Converts from a native JS array to a JS interpreter array.
 * Does handle non-numeric properties (like str.match's index prop).
 * Does NOT recurse into the array's contents.
 * @param {!Array} nativeArray The JS array to be converted.
 * @return {!Interpreter.Object} The equivalent JS interpreter array.
 */
Interpreter.prototype.arrayNativeToPseudo = function (nativeArray) {
  var pseudoArray = this.createObjectProto(this.ARRAY_PROTO);
  var props = Object.getOwnPropertyNames(nativeArray);
  for (var i = 0; i < props.length; i++) {
    this.setProperty(pseudoArray, props[i], nativeArray[props[i]]);
  }
  return pseudoArray;
};

/**
 * Converts from a JS interpreter array to native JS array.
 * Does handle non-numeric properties (like str.match's index prop).
 * Does NOT recurse into the array's contents.
 * @param {!Interpreter.Object} pseudoArray The JS interpreter array,
 *     or JS interpreter object pretending to be an array.
 * @return {!Array} The equivalent native JS array.
 */
Interpreter.prototype.arrayPseudoToNative = function (pseudoArray) {
  var nativeArray = [];
  for (var key in pseudoArray.properties) {
    nativeArray[key] = this.getProperty(pseudoArray, key);
  }
  // pseudoArray might be an object pretending to be an array.  In this case
  // it's possible that length is non-existent, invalid, or smaller than the
  // largest defined numeric property.  Set length explicitly here.
  nativeArray.length = Interpreter.legalArrayLength(this.getProperty(pseudoArray, "length")) || 0;
  return nativeArray;
};

/**
 * Look up the prototype for this value.
 * @param {Interpreter.Value} value Data object.
 * @return {Interpreter.Object} Prototype object, null if none.
 */
Interpreter.prototype.getPrototype = function (value) {
  switch (typeof value) {
    case "number":
      return this.NUMBER.properties["prototype"];
    case "boolean":
      return this.BOOLEAN.properties["prototype"];
    case "string":
      return this.STRING.properties["prototype"];
  }
  if (value) {
    return value.proto;
  }
  return null;
};

/**
 * Fetch a property value from a data object.
 * @param {Interpreter.Value} obj Data object.
 * @param {Interpreter.Value} name Name of property.
 * @param {Acorn AST Node} node Node that triggered this function. Used by Bitburner for getting error line numbers
 * @return {Interpreter.Value} Property value (may be undefined).
 */
Interpreter.prototype.getProperty = function (obj, name, node) {
  name = String(name);
  if (obj === undefined || obj === null) {
    let lineNum;
    if (node != null && node.loc != null && node.loc.start != null) {
      lineNum = node.loc.start.line;
    }
    this.throwException(this.TYPE_ERROR, "Cannot read property '" + name + "' of " + obj, lineNum);
  }
  if (name === "length") {
    // Special cases for magic length property.
    if (this.isa(obj, this.STRING)) {
      return String(obj).length;
    }
  } else if (name.charCodeAt(0) < 0x40) {
    // Might have numbers in there?
    // Special cases for string array indexing
    if (this.isa(obj, this.STRING)) {
      var n = Interpreter.legalArrayIndex(name);
      if (!isNaN(n) && n < String(obj).length) {
        return String(obj)[n];
      }
    }
  }
  do {
    if (obj.properties && name in obj.properties) {
      var getter = obj.getter[name];
      if (getter) {
        // Flag this function as being a getter and thus needing immediate
        // execution (rather than being the value of the property).
        getter.isGetter = true;
        return getter;
      }
      return obj.properties[name];
    }
  } while ((obj = this.getPrototype(obj)));
  return undefined;
};

/**
 * Does the named property exist on a data object.
 * @param {Interpreter.Value} obj Data object.
 * @param {Interpreter.Value} name Name of property.
 * @return {boolean} True if property exists.
 */
Interpreter.prototype.hasProperty = function (obj, name) {
  if (!obj.isObject) {
    throw TypeError("Primitive data type has no properties");
  }
  name = String(name);
  if (name === "length" && this.isa(obj, this.STRING)) {
    return true;
  }
  if (this.isa(obj, this.STRING)) {
    var n = Interpreter.legalArrayIndex(name);
    if (!isNaN(n) && n < String(obj).length) {
      return true;
    }
  }
  do {
    if (obj.properties && name in obj.properties) {
      return true;
    }
  } while ((obj = this.getPrototype(obj)));
  return false;
};

/**
 * Set a property value on a data object.
 * @param {!Interpreter.Object} obj Data object.
 * @param {Interpreter.Value} name Name of property.
 * @param {Interpreter.Value} value New property value.
 *     Use Interpreter.VALUE_IN_DESCRIPTOR if value is handled by
 *     descriptor instead.
 * @param {Object=} opt_descriptor Optional descriptor object.
 * @return {!Interpreter.Object|undefined} Returns a setter function if one
 *     needs to be called, otherwise undefined.
 */
Interpreter.prototype.setProperty = function (obj, name, value, opt_descriptor) {
  name = String(name);
  if (obj === undefined || obj === null) {
    this.throwException(this.TYPE_ERROR, "Cannot set property '" + name + "' of " + obj);
  }
  if (
    opt_descriptor &&
    ("get" in opt_descriptor || "set" in opt_descriptor) &&
    ("value" in opt_descriptor || "writable" in opt_descriptor)
  ) {
    this.throwException(
      this.TYPE_ERROR,
      "Invalid property descriptor. " + "Cannot both specify accessors and a value or writable attribute",
    );
  }
  var strict = !this.stateStack || this.getScope().strict;
  if (!obj.isObject) {
    if (strict) {
      this.throwException(this.TYPE_ERROR, "Can't create property '" + name + "' on '" + obj + "'");
    }
    return;
  }
  if (this.isa(obj, this.STRING)) {
    var n = Interpreter.legalArrayIndex(name);
    if (name === "length" || (!isNaN(n) && n < String(obj).length)) {
      // Can't set length or letters on String objects.
      if (strict) {
        this.throwException(
          this.TYPE_ERROR,
          "Cannot assign to read only " + "property '" + name + "' of String '" + obj.data + "'",
        );
      }
      return;
    }
  }
  if (obj.class === "Array") {
    // Arrays have a magic length variable that is bound to the elements.
    var length = obj.properties.length;
    var i;
    if (name === "length") {
      // Delete elements if length is smaller.
      if (opt_descriptor) {
        if (!("value" in opt_descriptor)) {
          return;
        }
        value = opt_descriptor.value;
      }
      value = Interpreter.legalArrayLength(value);
      if (isNaN(value)) {
        this.throwException(this.RANGE_ERROR, "Invalid array length");
      }
      if (value < length) {
        for (i in obj.properties) {
          i = Interpreter.legalArrayIndex(i);
          if (!isNaN(i) && value <= i) {
            delete obj.properties[i];
          }
        }
      }
    } else if (!isNaN((i = Interpreter.legalArrayIndex(name)))) {
      // Increase length if this index is larger.
      obj.properties.length = Math.max(length, i + 1);
    }
  }
  if (obj.preventExtensions && !(name in obj.properties)) {
    if (strict) {
      this.throwException(this.TYPE_ERROR, "Can't add property '" + name + "', object is not extensible");
    }
    return;
  }
  if (opt_descriptor) {
    // Define the property.
    if ("get" in opt_descriptor) {
      if (opt_descriptor.get) {
        obj.getter[name] = opt_descriptor.get;
      } else {
        delete obj.getter[name];
      }
    }
    if ("set" in opt_descriptor) {
      if (opt_descriptor.set) {
        obj.setter[name] = opt_descriptor.set;
      } else {
        delete obj.setter[name];
      }
    }
    var descriptor = {};
    if ("configurable" in opt_descriptor) {
      descriptor.configurable = opt_descriptor.configurable;
    }
    if ("enumerable" in opt_descriptor) {
      descriptor.enumerable = opt_descriptor.enumerable;
    }
    if ("writable" in opt_descriptor) {
      descriptor.writable = opt_descriptor.writable;
      delete obj.getter[name];
      delete obj.setter[name];
    }
    if ("value" in opt_descriptor) {
      descriptor.value = opt_descriptor.value;
      delete obj.getter[name];
      delete obj.setter[name];
    } else if (value !== Interpreter.VALUE_IN_DESCRIPTOR) {
      descriptor.value = value;
      delete obj.getter[name];
      delete obj.setter[name];
    }
    try {
      Object.defineProperty(obj.properties, name, descriptor);
    } catch (e) {
      this.throwException(this.TYPE_ERROR, "Cannot redefine property: " + name);
    }
  } else {
    // Set the property.
    if (value === Interpreter.VALUE_IN_DESCRIPTOR) {
      throw ReferenceError("Value not specified.");
    }
    // Determine the parent (possibly self) where the property is defined.
    var defObj = obj;
    while (!(name in defObj.properties)) {
      defObj = this.getPrototype(defObj);
      if (!defObj) {
        // This is a new property.
        defObj = obj;
        break;
      }
    }
    if (defObj.setter && defObj.setter[name]) {
      return defObj.setter[name];
    }
    if (defObj.getter && defObj.getter[name]) {
      if (strict) {
        this.throwException(
          this.TYPE_ERROR,
          "Cannot set property '" + name + "' of object '" + obj + "' which only has a getter",
        );
      }
    } else {
      // No setter, simple assignment.
      try {
        obj.properties[name] = value;
      } catch (e) {
        if (strict) {
          this.throwException(
            this.TYPE_ERROR,
            "Cannot assign to read only " + "property '" + name + "' of object '" + obj + "'",
          );
        }
      }
    }
  }
};

/**
 * Convenience method for adding a native function as a non-enumerable property
 * onto an object's prototype.
 * @param {!Interpreter.Object} obj Data object.
 * @param {Interpreter.Value} name Name of property.
 * @param {!Function} wrapper Function object.
 */
Interpreter.prototype.setNativeFunctionPrototype = function (obj, name, wrapper) {
  this.setProperty(
    obj.properties["prototype"],
    name,
    this.createNativeFunction(wrapper, false),
    Interpreter.NONENUMERABLE_DESCRIPTOR,
  );
};

/**
 * Returns the current scope from the stateStack.
 * @return {!Interpreter.Object} Current scope dictionary.
 */
Interpreter.prototype.getScope = function () {
  var scope = this.stateStack[this.stateStack.length - 1].scope;
  if (!scope) {
    throw Error("No scope found.");
  }
  return scope;
};

/**
 * Create a new scope dictionary.
 * @param {!Object} node AST node defining the scope container
 *     (e.g. a function).
 * @param {Interpreter.Object} parentScope Scope to link to.
 * @return {!Interpreter.Object} New scope.
 */
Interpreter.prototype.createScope = function (node, parentScope) {
  var scope = this.createObjectProto(null);
  scope.parentScope = parentScope;
  if (!parentScope) {
    this.initGlobalScope(scope);
  }
  this.populateScope_(node, scope);

  // Determine if this scope starts with 'use strict'.
  scope.strict = false;
  if (parentScope && parentScope.strict) {
    scope.strict = true;
  } else {
    var firstNode = node["body"] && node["body"][0];
    if (
      firstNode &&
      firstNode.expression &&
      firstNode.expression["type"] === "Literal" &&
      firstNode.expression.value === "use strict"
    ) {
      scope.strict = true;
    }
  }
  return scope;
};

/**
 * Create a new special scope dictionary. Similar to createScope(), but
 * doesn't assume that the scope is for a function body.
 * This is used for 'catch' clauses and 'with' statements.
 * @param {!Interpreter.Object} parentScope Scope to link to.
 * @param {Interpreter.Object=} opt_scope Optional object to transform into
 *     scope.
 * @return {!Interpreter.Object} New scope.
 */
Interpreter.prototype.createSpecialScope = function (parentScope, opt_scope) {
  if (!parentScope) {
    throw Error("parentScope required");
  }
  var scope = opt_scope || this.createObjectProto(null);
  scope.parentScope = parentScope;
  scope.strict = parentScope.strict;
  return scope;
};

/**
 * Retrieves a value from the scope chain.
 * @param {string} name Name of variable.
 * @param {Acorn AST Node} node Node that triggered this function. Used by Bitburner for getting error line number
 * @return {Interpreter.Value} Any value.
 *   May be flagged as being a getter and thus needing immediate execution
 *   (rather than being the value of the property).
 */
Interpreter.prototype.getValueFromScope = function (name, node) {
  var scope = this.getScope();
  while (scope && scope !== this.global) {
    if (name in scope.properties) {
      return scope.properties[name];
    }
    scope = scope.parentScope;
  }
  // The root scope is also an object which has inherited properties and
  // could also have getters.
  if (scope === this.global && this.hasProperty(scope, name)) {
    return this.getProperty(scope, name);
  }
  // Typeof operator is unique: it can safely look at non-defined variables.
  var prevNode = this.stateStack[this.stateStack.length - 1].node;
  if (prevNode["type"] === "UnaryExpression" && prevNode["operator"] === "typeof") {
    return undefined;
  }

  var lineNum;
  if (node != null && node.loc != null && node.loc.start != null) {
    lineNum = node.loc.start.line;
  }
  this.throwException(this.REFERENCE_ERROR, name + " is not defined", lineNum);
};

/**
 * Sets a value to the current scope.
 * @param {string} name Name of variable.
 * @param {Interpreter.Value} value Value.
 * @return {!Interpreter.Object|undefined} Returns a setter function if one
 *     needs to be called, otherwise undefined.
 */
Interpreter.prototype.setValueToScope = function (name, value) {
  var scope = this.getScope();
  var strict = scope.strict;
  while (scope && scope !== this.global) {
    if (name in scope.properties) {
      scope.properties[name] = value;
      return undefined;
    }
    scope = scope.parentScope;
  }
  // The root scope is also an object which has readonly properties and
  // could also have setters.
  if (scope === this.global && (!strict || this.hasProperty(scope, name))) {
    return this.setProperty(scope, name, value);
  }
  this.throwException(this.REFERENCE_ERROR, name + " is not defined");
};

/**
 * Create a new scope for the given node.
 * @param {!Object} node AST node (program or function).
 * @param {!Interpreter.Object} scope Scope dictionary to populate.
 * @private
 */
Interpreter.prototype.populateScope_ = function (node, scope) {
  if (node["type"] === "VariableDeclaration") {
    for (var i = 0; i < node["declarations"].length; i++) {
      this.setProperty(scope, node["declarations"][i]["id"]["name"], undefined, Interpreter.VARIABLE_DESCRIPTOR);
    }
  } else if (node["type"] === "FunctionDeclaration") {
    this.setProperty(scope, node["id"]["name"], this.createFunction(node, scope), Interpreter.VARIABLE_DESCRIPTOR);
    return; // Do not recurse into function.
  } else if (node["type"] === "FunctionExpression") {
    return; // Do not recurse into function.
  } else if (node["type"] === "ExpressionStatement") {
    return; // Expressions can't contain variable/function declarations.
  }
  var nodeClass = node["constructor"];
  for (var name in node) {
    var prop = node[name];
    if (prop && typeof prop === "object") {
      if (Array.isArray(prop)) {
        for (var i = 0; i < prop.length; i++) {
          if (prop[i] && prop[i].constructor === nodeClass) {
            this.populateScope_(prop[i], scope);
          }
        }
      } else {
        if (prop.constructor === nodeClass) {
          this.populateScope_(prop, scope);
        }
      }
    }
  }
};

/**
 * Remove start and end values from AST, or set start and end values to a
 * constant value.  Used to remove highlighting from polyfills and to set
 * highlighting in an eval to cover the entire eval expression.
 * @param {!Object} node AST node.
 * @param {number=} start Starting character of all nodes, or undefined.
 * @param {number=} end Ending character of all nodes, or undefined.
 * @private
 */
Interpreter.prototype.stripLocations_ = function (node, start, end) {
  if (start) {
    node["start"] = start;
  } else {
    delete node["start"];
  }
  if (end) {
    node["end"] = end;
  } else {
    delete node["end"];
  }
  for (var name in node) {
    if (node.hasOwnProperty(name)) {
      var prop = node[name];
      if (prop && typeof prop === "object") {
        this.stripLocations_(prop, start, end);
      }
    }
  }
};

/**
 * Is the current state directly being called with as a construction with 'new'.
 * @return {boolean} True if 'new foo()', false if 'foo()'.
 */
Interpreter.prototype.calledWithNew = function () {
  return this.stateStack[this.stateStack.length - 1].isConstructor;
};

/**
 * Gets a value from the scope chain or from an object property.
 * @param {!Array} ref Name of variable or object/propname tuple.
 * @param {Acorn AST Node} node Node that triggered this function. Used by Bitburner for getting error line number
 * @return {Interpreter.Value} Any value.
 *   May be flagged as being a getter and thus needing immediate execution
 *   (rather than being the value of the property).
 */
Interpreter.prototype.getValue = function (ref, node) {
  if (ref[0] === Interpreter.SCOPE_REFERENCE) {
    // A null/varname variable lookup.
    return this.getValueFromScope(ref[1], node);
  } else {
    // An obj/prop components tuple (foo.bar).
    return this.getProperty(ref[0], ref[1], node);
  }
};

/**
 * Sets a value to the scope chain or to an object property.
 * @param {!Array} ref Name of variable or object/propname tuple.
 * @param {Interpreter.Value} value Value.
 * @return {!Interpreter.Object|undefined} Returns a setter function if one
 *     needs to be called, otherwise undefined.
 */
Interpreter.prototype.setValue = function (ref, value) {
  if (ref[0] === Interpreter.SCOPE_REFERENCE) {
    // A null/varname variable lookup.
    return this.setValueToScope(ref[1], value);
  } else {
    // An obj/prop components tuple (foo.bar).
    return this.setProperty(ref[0], ref[1], value);
  }
};

/**
 * Completion Value Types.
 * @enum {number}
 */
Interpreter.Completion = {
  NORMAL: 0,
  BREAK: 1,
  CONTINUE: 2,
  RETURN: 3,
  THROW: 4,
};

/**
 * Throw an exception in the interpreter that can be handled by an
 * interpreter try/catch statement.  If unhandled, a real exception will
 * be thrown.  Can be called with either an error class and a message, or
 * with an actual object to be thrown.
 * @param {!Interpreter.Object} errorClass Type of error (if message is
 *   provided) or the value to throw (if no message).
 * @param {string=} opt_message Message being thrown.
 */
Interpreter.prototype.throwException = function (errorClass, opt_message, lineNumber) {
  if (opt_message === undefined) {
    var error = errorClass; // This is a value to throw, not an error class.
  } else {
    var error = this.createObject(errorClass);
    this.setProperty(error, "message", opt_message, Interpreter.NONENUMERABLE_DESCRIPTOR);
  }
  var lineNumErrorMsg;
  if (lineNumber != null) {
    lineNumErrorMsg = this.getErrorLineNumberMessage(lineNumber);
  }
  this.unwind(Interpreter.Completion.THROW, error, undefined, lineNumErrorMsg);
  // Abort anything related to the current step.
  throw Interpreter.STEP_ERROR;
};

/**
 * Unwind the stack to the innermost relevant enclosing TryStatement,
 * For/ForIn/WhileStatement or Call/NewExpression.  If this results in
 * the stack being completely unwound the thread will be terminated
 * and the appropriate error being thrown.
 * @param {Interpreter.Completion} type Completion type.
 * @param {Interpreter.Value=} value Value computed, returned or thrown.
 * @param {string=} label Target label for break or return.
 */
Interpreter.prototype.unwind = function (type, value, label, lineNumberMsg = "") {
  if (type === Interpreter.Completion.NORMAL) {
    throw TypeError("Should not unwind for NORMAL completions");
  }

  for (var stack = this.stateStack; stack.length > 0; stack.pop()) {
    var state = stack[stack.length - 1];
    switch (state.node["type"]) {
      case "TryStatement":
        state.cv = { type: type, value: value, label: label };
        return;
      case "CallExpression":
      case "NewExpression":
        if (type === Interpreter.Completion.RETURN) {
          state.value = value;
          return;
        } else if (type !== Interpreter.Completion.THROW) {
          throw Error("Unsynatctic break/continue not rejected by Acorn");
        }
    }
    if (type === Interpreter.Completion.BREAK) {
      if (label ? state.labels && state.labels.indexOf(label) !== -1 : state.isLoop || state.isSwitch) {
        stack.pop();
        return;
      }
    } else if (type === Interpreter.Completion.CONTINUE) {
      if (label ? state.labels && state.labels.indexOf(label) !== -1 : state.isLoop) {
        return;
      }
    }
  }

  // Unhandled completion.  Throw a real error.
  var realError;
  if (this.isa(value, this.ERROR)) {
    var errorTable = {
      EvalError: EvalError,
      RangeError: RangeError,
      ReferenceError: ReferenceError,
      SyntaxError: SyntaxError,
      TypeError: TypeError,
      URIError: URIError,
    };
    var name = this.getProperty(value, "name").toString();
    var message = this.getProperty(value, "message").valueOf();
    var type = errorTable[name] || Error;
    realError = type(message + lineNumberMsg);
  } else {
    realError = String(value) + lineNumberMsg;
  }
  throw realError;
};

/**
 * Create a call to a getter function.
 * @param {!Interpreter.Object} func Function to execute.
 * @param {!Interpreter.Object|!Array} left
 *     Name of variable or object/propname tuple.
 * @private
 */
Interpreter.prototype.createGetter_ = function (func, left) {
  // Normally 'this' will be specified as the object component (o.x).
  // Sometimes 'this' is explicitly provided (o).
  var funcThis = Array.isArray(left) ? left[0] : left;
  var node = new this.nodeConstructor();
  node["type"] = "CallExpression";
  var state = new Interpreter.State(node, this.stateStack[this.stateStack.length - 1].scope);
  state.doneCallee_ = true;
  state.funcThis_ = funcThis;
  state.func_ = func;
  state.doneArgs_ = true;
  state.arguments_ = [];
  return state;
};

/**
 * Create a call to a setter function.
 * @param {!Interpreter.Object} func Function to execute.
 * @param {!Interpreter.Object|!Array} left
 *     Name of variable or object/propname tuple.
 * @param {Interpreter.Value} value Value to set.
 * @private
 */
Interpreter.prototype.createSetter_ = function (func, left, value) {
  // Normally 'this' will be specified as the object component (o.x).
  // Sometimes 'this' is implicitly the global object (x).
  var funcThis = Array.isArray(left) ? left[0] : this.global;
  var node = new this.nodeConstructor();
  node["type"] = "CallExpression";
  var state = new Interpreter.State(node, this.stateStack[this.stateStack.length - 1].scope);
  state.doneCallee_ = true;
  state.funcThis_ = funcThis;
  state.func_ = func;
  state.doneArgs_ = true;
  state.arguments_ = [value];
  return state;
};

/**
 * Class for a state.
 * @param {!Object} node AST node for the state.
 * @param {!Interpreter.Object} scope Scope object for the state.
 * @constructor
 */
Interpreter.State = function (node, scope) {
  this.node = node;
  this.scope = scope;
};

///////////////////////////////////////////////////////////////////////////////
// Functions to handle each node type.
///////////////////////////////////////////////////////////////////////////////

Interpreter.prototype["stepArrayExpression"] = function (stack, state, node) {
  var elements = node["elements"];
  var n = state.n_ || 0;
  if (!state.array_) {
    state.array_ = this.createObjectProto(this.ARRAY_PROTO);
    state.array_.properties.length = elements.length;
  } else {
    this.setProperty(state.array_, n, state.value);
    n++;
  }
  while (n < elements.length) {
    // Skip missing elements - they're not defined, not undefined.
    if (elements[n]) {
      state.n_ = n;
      return new Interpreter.State(elements[n], state.scope);
    }
    n++;
  }
  stack.pop();
  stack[stack.length - 1].value = state.array_;
};

Interpreter.prototype["stepAssignmentExpression"] = function (stack, state, node) {
  if (!state.doneLeft_) {
    state.doneLeft_ = true;
    var nextState = new Interpreter.State(node["left"], state.scope);
    nextState.components = true;
    return nextState;
  }
  if (!state.doneRight_) {
    if (!state.leftReference_) {
      state.leftReference_ = state.value;
    }
    if (state.doneGetter_) {
      state.leftValue_ = state.value;
    }
    if (!state.doneGetter_ && node["operator"] !== "=") {
      var leftValue = this.getValue(state.leftReference_, node);
      state.leftValue_ = leftValue;
      if (leftValue && typeof leftValue === "object" && leftValue.isGetter) {
        // Clear the getter flag and call the getter function.
        leftValue.isGetter = false;
        state.doneGetter_ = true;
        var func = /** @type {!Interpreter.Object} */ (leftValue);
        return this.createGetter_(func, state.leftReference_);
      }
    }
    state.doneRight_ = true;
    return new Interpreter.State(node["right"], state.scope);
  }
  if (state.doneSetter_) {
    // Return if setter function.
    // Setter method on property has completed.
    // Ignore its return value, and use the original set value instead.
    stack.pop();
    stack[stack.length - 1].value = state.setterValue_;
    return;
  }
  var value = state.leftValue_;
  var rightValue = state.value;
  switch (node["operator"]) {
    case "=":
      value = rightValue;
      break;
    case "+=":
      value += rightValue;
      break;
    case "-=":
      value -= rightValue;
      break;
    case "*=":
      value *= rightValue;
      break;
    case "/=":
      value /= rightValue;
      break;
    case "%=":
      value %= rightValue;
      break;
    case "<<=":
      value <<= rightValue;
      break;
    case ">>=":
      value >>= rightValue;
      break;
    case ">>>=":
      value >>>= rightValue;
      break;
    case "&=":
      value &= rightValue;
      break;
    case "^=":
      value ^= rightValue;
      break;
    case "|=":
      value |= rightValue;
      break;
    default:
      throw SyntaxError("Unknown assignment expression: " + node["operator"]);
  }
  var setter = this.setValue(state.leftReference_, value);
  if (setter) {
    state.doneSetter_ = true;
    state.setterValue_ = value;
    return this.createSetter_(setter, state.leftReference_, value);
  }
  // Return if no setter function.
  stack.pop();
  stack[stack.length - 1].value = value;
};

Interpreter.prototype["stepBinaryExpression"] = function (stack, state, node) {
  if (!state.doneLeft_) {
    state.doneLeft_ = true;
    return new Interpreter.State(node["left"], state.scope);
  }
  if (!state.doneRight_) {
    state.doneRight_ = true;
    state.leftValue_ = state.value;
    return new Interpreter.State(node["right"], state.scope);
  }
  stack.pop();
  var leftValue = state.leftValue_;
  var rightValue = state.value;
  var value;
  switch (node["operator"]) {
    case "==":
      value = leftValue == rightValue;
      break;
    case "!=":
      value = leftValue != rightValue;
      break;
    case "===":
      value = leftValue === rightValue;
      break;
    case "!==":
      value = leftValue !== rightValue;
      break;
    case ">":
      value = leftValue > rightValue;
      break;
    case ">=":
      value = leftValue >= rightValue;
      break;
    case "<":
      value = leftValue < rightValue;
      break;
    case "<=":
      value = leftValue <= rightValue;
      break;
    case "+":
      value = leftValue + rightValue;
      break;
    case "-":
      value = leftValue - rightValue;
      break;
    case "*":
      value = leftValue * rightValue;
      break;
    case "/":
      value = leftValue / rightValue;
      break;
    case "%":
      value = leftValue % rightValue;
      break;
    case "&":
      value = leftValue & rightValue;
      break;
    case "|":
      value = leftValue | rightValue;
      break;
    case "^":
      value = leftValue ^ rightValue;
      break;
    case "<<":
      value = leftValue << rightValue;
      break;
    case ">>":
      value = leftValue >> rightValue;
      break;
    case ">>>":
      value = leftValue >>> rightValue;
      break;
    case "in":
      if (!rightValue || !rightValue.isObject) {
        let lineNum = this.getErrorLineNumber(node);
        this.throwException(this.TYPE_ERROR, "'in' expects an object, not '" + rightValue + "'", lineNum);
      }
      value = this.hasProperty(rightValue, leftValue);
      break;
    case "instanceof":
      if (!this.isa(rightValue, this.FUNCTION)) {
        let lineNum = this.getErrorLineNumber(node);
        this.throwException(this.TYPE_ERROR, "Right-hand side of instanceof is not an object", lineNum);
      }
      value = leftValue.isObject ? this.isa(leftValue, rightValue) : false;
      break;
    default:
      throw SyntaxError("Unknown binary operator: " + node["operator"]);
  }
  stack[stack.length - 1].value = value;
};

Interpreter.prototype["stepBlockStatement"] = function (stack, state, node) {
  var n = state.n_ || 0;
  var expression = node["body"][n];
  if (expression) {
    state.n_ = n + 1;
    return new Interpreter.State(expression, state.scope);
  }
  stack.pop();
};

Interpreter.prototype["stepBreakStatement"] = function (stack, state, node) {
  var label = node["label"] && node["label"]["name"];
  this.unwind(Interpreter.Completion.BREAK, undefined, label);
};

Interpreter.prototype["stepCallExpression"] = function (stack, state, node) {
  if (!state.doneCallee_) {
    state.doneCallee_ = 1;
    // Components needed to determine value of 'this'.
    var nextState = new Interpreter.State(node["callee"], state.scope);
    nextState.components = true;
    return nextState;
  }
  if (state.doneCallee_ === 1) {
    // Determine value of the function.
    state.doneCallee_ = 2;
    var func = state.value;
    if (Array.isArray(func)) {
      state.func_ = this.getValue(func, node);
      if (func[0] === Interpreter.SCOPE_REFERENCE) {
        // (Globally or locally) named function.  Is it named 'eval'?
        state.directEval_ = func[1] === "eval";
      } else {
        // Method function, 'this' is object (ignored if invoked as 'new').
        state.funcThis_ = func[0];
      }
      func = state.func_;
      if (func && typeof func === "object" && func.isGetter) {
        // Clear the getter flag and call the getter function.
        func.isGetter = false;
        state.doneCallee_ = 1;
        return this.createGetter_(/** @type {!Interpreter.Object} */ (func), state.value);
      }
    } else {
      // Already evaluated function: (function(){...})();
      state.func_ = func;
    }
    state.arguments_ = [];
    state.n_ = 0;
  }
  var func = state.func_;
  if (!state.doneArgs_) {
    if (state.n_ !== 0) {
      state.arguments_.push(state.value);
    }
    if (node["arguments"][state.n_]) {
      return new Interpreter.State(node["arguments"][state.n_++], state.scope);
    }
    // Determine value of 'this' in function.
    if (node["type"] === "NewExpression") {
      if (func.illegalConstructor) {
        // Illegal: new escape();
        let lineNum = this.getErrorLineNumber(node);
        this.throwException(this.TYPE_ERROR, func + " is not a constructor", lineNum);
      }
      // Constructor, 'this' is new object.
      var proto = func.properties["prototype"];
      if (typeof proto !== "object" || proto === null) {
        // Non-object prototypes default to Object.prototype.
        proto = this.OBJECT_PROTO;
      }
      state.funcThis_ = this.createObjectProto(proto);
      state.isConstructor = true;
    } else if (state.funcThis_ === undefined) {
      // Global function, 'this' is global object (or 'undefined' if strict).
      state.funcThis_ = state.scope.strict ? undefined : this.global;
    }
    state.doneArgs_ = true;
  }
  if (!state.doneExec_) {
    state.doneExec_ = true;
    if (!func || !func.isObject) {
      let lineNum = this.getErrorLineNumber(node);
      this.throwException(this.TYPE_ERROR, func + " is not a function", lineNum);
    }
    var funcNode = func.node;
    if (funcNode) {
      var scope = this.createScope(funcNode["body"], func.parentScope);
      // Add all arguments.
      for (var i = 0; i < funcNode["params"].length; i++) {
        var paramName = funcNode["params"][i]["name"];
        var paramValue = state.arguments_.length > i ? state.arguments_[i] : undefined;
        this.setProperty(scope, paramName, paramValue);
      }
      // Build arguments variable.
      var argsList = this.createObjectProto(this.ARRAY_PROTO);
      for (var i = 0; i < state.arguments_.length; i++) {
        this.setProperty(argsList, i, state.arguments_[i]);
      }
      this.setProperty(scope, "arguments", argsList);
      // Add the function's name (var x = function foo(){};)
      var name = funcNode["id"] && funcNode["id"]["name"];
      if (name) {
        this.setProperty(scope, name, func);
      }
      this.setProperty(scope, "this", state.funcThis_, Interpreter.READONLY_DESCRIPTOR);
      state.value = undefined; // Default value if no explicit return.
      return new Interpreter.State(funcNode["body"], scope);
    } else if (func.eval) {
      var code = state.arguments_[0];
      if (typeof code !== "string") {
        // JS does not parse String objects:
        // eval(new String('1 + 1')) -> '1 + 1'
        state.value = code;
      } else {
        try {
          var ast = acorn.parse(code.toString(), Interpreter.PARSE_OPTIONS);
        } catch (e) {
          // Acorn threw a SyntaxError.  Rethrow as a trappable error.
          let lineNum = this.getErrorLineNumber(node);
          this.throwException(this.SYNTAX_ERROR, "Invalid code: " + e.message, lineNum);
        }
        var evalNode = new this.nodeConstructor();
        evalNode["type"] = "EvalProgram_";
        evalNode["body"] = ast["body"];
        this.stripLocations_(evalNode, node["start"], node["end"]);
        // Create new scope and update it with definitions in eval().
        var scope = state.directEval_ ? state.scope : this.global;
        if (scope.strict) {
          // Strict mode get its own scope in eval.
          scope = this.createScope(ast, scope);
        } else {
          // Non-strict mode pollutes the current scope.
          this.populateScope_(ast, scope);
        }
        this.value = undefined; // Default value if no code.
        return new Interpreter.State(evalNode, scope);
      }
    } else if (func.nativeFunc) {
      state.value = func.nativeFunc.apply(state.funcThis_, state.arguments_);
    } else if (func.asyncFunc) {
      var thisInterpreter = this;
      var callback = function (value) {
        state.value = value;
        thisInterpreter.paused_ = false;
      };
      var argsWithCallback = state.arguments_.concat(callback);
      this.paused_ = true;
      func.asyncFunc.apply(state.funcThis_, argsWithCallback);
      return;
    } else {
      /* A child of a function is a function but is not callable.  For example:
      var F = function() {};
      F.prototype = escape;
      var f = new F();
      f();
      */
      let lineNum = this.getErrorLineNumber(node);
      this.throwException(this.TYPE_ERROR, func.class + " is not a function", lineNum);
    }
  } else {
    // Execution complete.  Put the return value on the stack.
    stack.pop();
    if (state.isConstructor && typeof state.value !== "object") {
      stack[stack.length - 1].value = state.funcThis_;
    } else {
      stack[stack.length - 1].value = state.value;
    }
  }
};

Interpreter.prototype["stepCatchClause"] = function (stack, state, node) {
  if (!state.done_) {
    state.done_ = true;
    // Create an empty scope.
    var scope = this.createSpecialScope(state.scope);
    // Add the argument.
    this.setProperty(scope, node["param"]["name"], state.throwValue);
    // Execute catch clause.
    return new Interpreter.State(node["body"], scope);
  } else {
    stack.pop();
  }
};

Interpreter.prototype["stepConditionalExpression"] = function (stack, state, node) {
  var mode = state.mode_ || 0;
  if (mode === 0) {
    state.mode_ = 1;
    return new Interpreter.State(node["test"], state.scope);
  }
  if (mode === 1) {
    state.mode_ = 2;
    var value = Boolean(state.value);
    if (value && node["consequent"]) {
      // Execute 'if' block.
      return new Interpreter.State(node["consequent"], state.scope);
    } else if (!value && node["alternate"]) {
      // Execute 'else' block.
      return new Interpreter.State(node["alternate"], state.scope);
    }
    // eval('1;if(false){2}') -> undefined
    this.value = undefined;
  }
  stack.pop();
  if (node["type"] === "ConditionalExpression") {
    stack[stack.length - 1].value = state.value;
  }
};

Interpreter.prototype["stepContinueStatement"] = function (stack, state, node) {
  var label = node["label"] && node["label"]["name"];
  this.unwind(Interpreter.Completion.CONTINUE, undefined, label);
};

Interpreter.prototype["stepDebuggerStatement"] = function (stack, state, node) {
  // Do nothing.  May be overridden by developers.
  stack.pop();
};

Interpreter.prototype["stepDoWhileStatement"] = function (stack, state, node) {
  if (node["type"] === "DoWhileStatement" && state.test_ === undefined) {
    // First iteration of do/while executes without checking test.
    state.value = true;
    state.test_ = true;
  }
  if (!state.test_) {
    state.test_ = true;
    return new Interpreter.State(node["test"], state.scope);
  }
  if (!state.value) {
    // Done, exit loop.
    stack.pop();
  } else if (node["body"]) {
    // Execute the body.
    state.test_ = false;
    state.isLoop = true;
    return new Interpreter.State(node["body"], state.scope);
  }
};

Interpreter.prototype["stepEmptyStatement"] = function (stack, state, node) {
  stack.pop();
};

Interpreter.prototype["stepEvalProgram_"] = function (stack, state, node) {
  var n = state.n_ || 0;
  var expression = node["body"][n];
  if (expression) {
    state.n_ = n + 1;
    return new Interpreter.State(expression, state.scope);
  }
  stack.pop();
  stack[stack.length - 1].value = this.value;
};

Interpreter.prototype["stepExpressionStatement"] = function (stack, state, node) {
  if (!state.done_) {
    state.done_ = true;
    return new Interpreter.State(node["expression"], state.scope);
  }
  stack.pop();
  // Save this value to interpreter.value for use as a return value if
  // this code is inside an eval function.
  this.value = state.value;
};

Interpreter.prototype["stepForInStatement"] = function (stack, state, node) {
  // First, initialize a variable if exists.  Only do so once, ever.
  if (!state.doneInit_) {
    state.doneInit_ = true;
    if (node["left"]["declarations"] && node["left"]["declarations"][0]["init"]) {
      if (state.scope.strict) {
        let lineNum = this.getErrorLineNumber(node);
        this.throwException(
          this.SYNTAX_ERROR,
          "for-in loop variable declaration may not have an initializer.",
          lineNum,
        );
      }
      // Variable initialization: for (var x = 4 in y)
      return new Interpreter.State(node["left"], state.scope);
    }
  }
  // Second, look up the object.  Only do so once, ever.
  if (!state.doneObject_) {
    state.doneObject_ = true;
    if (!state.variable_) {
      state.variable_ = state.value;
    }
    return new Interpreter.State(node["right"], state.scope);
  }
  if (!state.isLoop) {
    // First iteration.
    state.isLoop = true;
    state.object_ = state.value;
    state.visited_ = Object.create(null);
  }
  // Third, find the property name for this iteration.
  if (state.name_ === undefined) {
    gotPropName: while (true) {
      if (state.object_ && state.object_.isObject) {
        if (!state.props_) {
          state.props_ = Object.getOwnPropertyNames(state.object_.properties);
        }
        while (true) {
          var prop = state.props_.shift();
          if (prop === undefined) {
            break; // Reached end of this object's properties.
          }
          if (!Object.prototype.hasOwnProperty.call(state.object_.properties, prop)) {
            continue; // Property has been deleted in the loop.
          }
          if (state.visited_[prop]) {
            continue; // Already seen this property on a child.
          }
          state.visited_[prop] = true;
          if (!Object.prototype.propertyIsEnumerable.call(state.object_.properties, prop)) {
            continue; // Skip non-enumerable property.
          }
          state.name_ = prop;
          break gotPropName;
        }
      } else if (state.object_ !== null && state.object_ !== undefined) {
        // Primitive value (other than null or undefined).
        if (!state.props_) {
          state.props_ = Object.getOwnPropertyNames(state.object_);
        }
        while (true) {
          var prop = state.props_.shift();
          if (prop === undefined) {
            break; // Reached end of this value's properties.
          }
          state.visited_[prop] = true;
          if (!Object.prototype.propertyIsEnumerable.call(state.object_, prop)) {
            continue; // Skip non-enumerable property.
          }
          state.name_ = prop;
          break gotPropName;
        }
      }
      state.object_ = this.getPrototype(state.object_);
      state.props_ = null;
      if (state.object_ === null) {
        // Done, exit loop.
        stack.pop();
        return;
      }
    }
  }
  // Fourth, find the variable
  if (!state.doneVariable_) {
    state.doneVariable_ = true;
    var left = node["left"];
    if (left["type"] === "VariableDeclaration") {
      // Inline variable declaration: for (var x in y)
      state.variable_ = [Interpreter.SCOPE_REFERENCE, left["declarations"][0]["id"]["name"]];
    } else {
      // Arbitrary left side: for (foo().bar in y)
      state.variable_ = null;
      var nextState = new Interpreter.State(left, state.scope);
      nextState.components = true;
      return nextState;
    }
  }
  if (!state.variable_) {
    state.variable_ = state.value;
  }
  // Fifth, set the variable.
  if (!state.doneSetter_) {
    state.doneSetter_ = true;
    var value = state.name_;
    var setter = this.setValue(state.variable_, value);
    if (setter) {
      return this.createSetter_(setter, state.variable_, value);
    }
  }
  // Next step will be step three.
  state.name_ = undefined;
  // Reevaluate the variable since it could be a setter on the global object.
  state.doneVariable_ = false;
  state.doneSetter_ = false;
  // Sixth and finally, execute the body if there was one.  this.
  if (node["body"]) {
    return new Interpreter.State(node["body"], state.scope);
  }
};

Interpreter.prototype["stepForStatement"] = function (stack, state, node) {
  var mode = state.mode_ || 0;
  if (mode === 0) {
    state.mode_ = 1;
    if (node["init"]) {
      return new Interpreter.State(node["init"], state.scope);
    }
  } else if (mode === 1) {
    state.mode_ = 2;
    if (node["test"]) {
      return new Interpreter.State(node["test"], state.scope);
    }
  } else if (mode === 2) {
    state.mode_ = 3;
    if (node["test"] && !state.value) {
      // Done, exit loop.
      stack.pop();
    } else {
      // Execute the body.
      state.isLoop = true;
      return new Interpreter.State(node["body"], state.scope);
    }
  } else if (mode === 3) {
    state.mode_ = 1;
    if (node["update"]) {
      return new Interpreter.State(node["update"], state.scope);
    }
  }
};

Interpreter.prototype["stepFunctionDeclaration"] = function (stack, state, node) {
  // This was found and handled when the scope was populated.
  stack.pop();
};

Interpreter.prototype["stepFunctionExpression"] = function (stack, state, node) {
  stack.pop();
  stack[stack.length - 1].value = this.createFunction(node, state.scope);
};

Interpreter.prototype["stepIdentifier"] = function (stack, state, node) {
  stack.pop();
  if (state.components) {
    stack[stack.length - 1].value = [Interpreter.SCOPE_REFERENCE, node["name"]];
    return;
  }
  var value = this.getValueFromScope(node["name"], node);
  // An identifier could be a getter if it's a property on the global object.
  if (value && typeof value === "object" && value.isGetter) {
    // Clear the getter flag and call the getter function.
    value.isGetter = false;
    var scope = state.scope;
    while (!this.hasProperty(scope, node["name"])) {
      scope = scope.parentScope;
    }
    var func = /** @type {!Interpreter.Object} */ (value);
    return this.createGetter_(func, this.global);
  }
  stack[stack.length - 1].value = value;
};

Interpreter.prototype["stepIfStatement"] = Interpreter.prototype["stepConditionalExpression"];

Interpreter.prototype["stepLabeledStatement"] = function (stack, state, node) {
  // No need to hit this node again on the way back up the stack.
  stack.pop();
  // Note that a statement might have multiple labels.
  var labels = state.labels || [];
  labels.push(node["label"]["name"]);
  var nextState = new Interpreter.State(node["body"], state.scope);
  nextState.labels = labels;
  return nextState;
};

Interpreter.prototype["stepLiteral"] = function (stack, state, node) {
  stack.pop();
  var value = node["value"];
  if (value instanceof RegExp) {
    var pseudoRegexp = this.createObjectProto(this.REGEXP_PROTO);
    this.populateRegExp(pseudoRegexp, value);
    value = pseudoRegexp;
  }
  stack[stack.length - 1].value = value;
};

Interpreter.prototype["stepLogicalExpression"] = function (stack, state, node) {
  if (node["operator"] !== "&&" && node["operator"] !== "||") {
    throw SyntaxError("Unknown logical operator: " + node["operator"]);
  }
  if (!state.doneLeft_) {
    state.doneLeft_ = true;
    return new Interpreter.State(node["left"], state.scope);
  }
  if (!state.doneRight_) {
    if ((node["operator"] === "&&" && !state.value) || (node["operator"] === "||" && state.value)) {
      // Shortcut evaluation.
      stack.pop();
      stack[stack.length - 1].value = state.value;
    } else {
      state.doneRight_ = true;
      return new Interpreter.State(node["right"], state.scope);
    }
  } else {
    stack.pop();
    stack[stack.length - 1].value = state.value;
  }
};

Interpreter.prototype["stepMemberExpression"] = function (stack, state, node) {
  if (!state.doneObject_) {
    state.doneObject_ = true;
    return new Interpreter.State(node["object"], state.scope);
  }
  var propName;
  if (!node["computed"]) {
    state.object_ = state.value;
    // obj.foo -- Just access 'foo' directly.
    propName = node["property"]["name"];
  } else if (!state.doneProperty_) {
    state.object_ = state.value;
    // obj[foo] -- Compute value of 'foo'.
    state.doneProperty_ = true;
    return new Interpreter.State(node["property"], state.scope);
  } else {
    propName = state.value;
  }
  stack.pop();
  if (state.components) {
    stack[stack.length - 1].value = [state.object_, propName];
  } else {
    var value = this.getProperty(state.object_, propName);
    if (value && typeof value === "object" && value.isGetter) {
      // Clear the getter flag and call the getter function.
      value.isGetter = false;
      var func = /** @type {!Interpreter.Object} */ (value);
      return this.createGetter_(func, state.object_);
    }
    stack[stack.length - 1].value = value;
  }
};

Interpreter.prototype["stepNewExpression"] = Interpreter.prototype["stepCallExpression"];

Interpreter.prototype["stepObjectExpression"] = function (stack, state, node) {
  var n = state.n_ || 0;
  var property = node["properties"][n];
  if (!state.object_) {
    // First execution.
    state.object_ = this.createObjectProto(this.OBJECT_PROTO);
    state.properties_ = Object.create(null);
  } else {
    // Determine property name.
    var key = property["key"];
    if (key["type"] === "Identifier") {
      var propName = key["name"];
    } else if (key["type"] === "Literal") {
      var propName = key["value"];
    } else {
      throw SyntaxError("Unknown object structure: " + key["type"]);
    }
    // Set the property computed in the previous execution.
    if (!state.properties_[propName]) {
      // Create temp object to collect value, getter, and/or setter.
      state.properties_[propName] = {};
    }
    state.properties_[propName][property["kind"]] = state.value;
    state.n_ = ++n;
    property = node["properties"][n];
  }
  if (property) {
    return new Interpreter.State(property["value"], state.scope);
  }
  for (var key in state.properties_) {
    var kinds = state.properties_[key];
    if ("get" in kinds || "set" in kinds) {
      // Set a property with a getter or setter.
      var descriptor = {
        configurable: true,
        enumerable: true,
        get: kinds["get"],
        set: kinds["set"],
      };
      this.setProperty(state.object_, key, null, descriptor);
    } else {
      // Set a normal property with a value.
      this.setProperty(state.object_, key, kinds["init"]);
    }
  }
  stack.pop();
  stack[stack.length - 1].value = state.object_;
};

Interpreter.prototype["stepProgram"] = function (stack, state, node) {
  var expression = node["body"].shift();
  if (expression) {
    state.done = false;
    return new Interpreter.State(expression, state.scope);
  }
  state.done = true;
  // Don't pop the stateStack.
  // Leave the root scope on the tree in case the program is appended to.
};

Interpreter.prototype["stepReturnStatement"] = function (stack, state, node) {
  if (node["argument"] && !state.done_) {
    state.done_ = true;
    return new Interpreter.State(node["argument"], state.scope);
  }
  this.unwind(Interpreter.Completion.RETURN, state.value, undefined);
};

Interpreter.prototype["stepSequenceExpression"] = function (stack, state, node) {
  var n = state.n_ || 0;
  var expression = node["expressions"][n];
  if (expression) {
    state.n_ = n + 1;
    return new Interpreter.State(expression, state.scope);
  }
  stack.pop();
  stack[stack.length - 1].value = state.value;
};

Interpreter.prototype["stepSwitchStatement"] = function (stack, state, node) {
  if (!state.test_) {
    state.test_ = 1;
    return new Interpreter.State(node["discriminant"], state.scope);
  }
  if (state.test_ === 1) {
    state.test_ = 2;
    // Preserve switch value between case tests.
    state.switchValue_ = state.value;
    state.defaultCase_ = -1;
  }

  while (true) {
    var index = state.index_ || 0;
    var switchCase = node["cases"][index];
    if (!state.matched_ && switchCase && !switchCase["test"]) {
      // Test on the default case is null.
      // Bypass (but store) the default case, and get back to it later.
      state.defaultCase_ = index;
      state.index_ = index + 1;
      continue;
    }
    if (!switchCase && !state.matched_ && state.defaultCase_ !== -1) {
      // Ran through all cases, no match.  Jump to the default.
      state.matched_ = true;
      state.index_ = state.defaultCase_;
      continue;
    }
    if (switchCase) {
      if (!state.matched_ && !state.tested_ && switchCase["test"]) {
        state.tested_ = true;
        return new Interpreter.State(switchCase["test"], state.scope);
      }
      if (state.matched_ || state.value === state.switchValue_) {
        state.matched_ = true;
        var n = state.n_ || 0;
        if (switchCase["consequent"][n]) {
          state.isSwitch = true;
          state.n_ = n + 1;
          return new Interpreter.State(switchCase["consequent"][n], state.scope);
        }
      }
      // Move on to next case.
      state.tested_ = false;
      state.n_ = 0;
      state.index_ = index + 1;
    } else {
      stack.pop();
      return;
    }
  }
};

Interpreter.prototype["stepThisExpression"] = function (stack, state, node) {
  stack.pop();
  stack[stack.length - 1].value = this.getValueFromScope("this", node);
};

Interpreter.prototype["stepThrowStatement"] = function (stack, state, node) {
  if (!state.done_) {
    state.done_ = true;
    return new Interpreter.State(node["argument"], state.scope);
  } else {
    this.throwException(state.value);
  }
};

Interpreter.prototype["stepTryStatement"] = function (stack, state, node) {
  if (!state.doneBlock_) {
    state.doneBlock_ = true;
    return new Interpreter.State(node["block"], state.scope);
  }
  if (state.cv && state.cv.type === Interpreter.Completion.THROW && !state.doneHandler_ && node["handler"]) {
    state.doneHandler_ = true;
    var nextState = new Interpreter.State(node["handler"], state.scope);
    nextState.throwValue = state.cv.value;
    state.cv = undefined; // This error has been handled, don't rethrow.
    return nextState;
  }
  if (!state.doneFinalizer_ && node["finalizer"]) {
    state.doneFinalizer_ = true;
    return new Interpreter.State(node["finalizer"], state.scope);
  }
  stack.pop();
  if (state.cv) {
    // There was no catch handler, or the catch/finally threw an error.
    // Throw the error up to a higher try.
    this.unwind(state.cv.type, state.cv.value, state.cv.label);
  }
};

Interpreter.prototype["stepUnaryExpression"] = function (stack, state, node) {
  if (!state.done_) {
    state.done_ = true;
    var nextState = new Interpreter.State(node["argument"], state.scope);
    nextState.components = node["operator"] === "delete";
    return nextState;
  }
  stack.pop();
  var value = state.value;
  if (node["operator"] === "-") {
    value = -value;
  } else if (node["operator"] === "+") {
    value = +value;
  } else if (node["operator"] === "!") {
    value = !value;
  } else if (node["operator"] === "~") {
    value = ~value;
  } else if (node["operator"] === "delete") {
    var result = true;
    // If value is not an array, then it is a primitive, or some other value.
    // If so, skip the delete and return true.
    if (Array.isArray(value)) {
      var obj = value[0];
      if (obj === Interpreter.SCOPE_REFERENCE) {
        // 'delete foo;' is the same as 'delete window.foo'.
        obj = state.scope;
      }
      var name = String(value[1]);
      try {
        delete obj.properties[name];
      } catch (e) {
        if (state.scope.strict) {
          this.throwException(this.TYPE_ERROR, "Cannot delete property '" + name + "' of '" + obj + "'");
        } else {
          result = false;
        }
      }
    }
    value = result;
  } else if (node["operator"] === "typeof") {
    value = value && value.class === "Function" ? "function" : typeof value;
  } else if (node["operator"] === "void") {
    value = undefined;
  } else {
    throw SyntaxError("Unknown unary operator: " + node["operator"]);
  }
  stack[stack.length - 1].value = value;
};

Interpreter.prototype["stepUpdateExpression"] = function (stack, state, node) {
  if (!state.doneLeft_) {
    state.doneLeft_ = true;
    var nextState = new Interpreter.State(node["argument"], state.scope);
    nextState.components = true;
    return nextState;
  }
  if (!state.leftSide_) {
    state.leftSide_ = state.value;
  }
  if (state.doneGetter_) {
    state.leftValue_ = state.value;
  }
  if (!state.doneGetter_) {
    var leftValue = this.getValue(state.leftSide_, node);
    state.leftValue_ = leftValue;
    if (leftValue && typeof leftValue === "object" && leftValue.isGetter) {
      // Clear the getter flag and call the getter function.
      leftValue.isGetter = false;
      state.doneGetter_ = true;
      var func = /** @type {!Interpreter.Object} */ (leftValue);
      return this.createGetter_(func, state.leftSide_);
    }
  }
  if (state.doneSetter_) {
    // Return if setter function.
    // Setter method on property has completed.
    // Ignore its return value, and use the original set value instead.
    stack.pop();
    stack[stack.length - 1].value = state.setterValue_;
    return;
  }
  var leftValue = Number(state.leftValue_);
  var changeValue;
  if (node["operator"] === "++") {
    changeValue = leftValue + 1;
  } else if (node["operator"] === "--") {
    changeValue = leftValue - 1;
  } else {
    throw SyntaxError("Unknown update expression: " + node["operator"]);
  }
  var returnValue = node["prefix"] ? changeValue : leftValue;
  var setter = this.setValue(state.leftSide_, changeValue);
  if (setter) {
    state.doneSetter_ = true;
    state.setterValue_ = returnValue;
    return this.createSetter_(setter, state.leftSide_, changeValue);
  }
  // Return if no setter function.
  stack.pop();
  stack[stack.length - 1].value = returnValue;
};

Interpreter.prototype["stepVariableDeclaration"] = function (stack, state, node) {
  var declarations = node["declarations"];
  var n = state.n_ || 0;
  var declarationNode = declarations[n];
  if (state.init_ && declarationNode) {
    // This setValue call never needs to deal with calling a setter function.
    // Note that this is setting the init value, not defining the variable.
    // Variable definition is done when scope is populated.
    this.setValueToScope(declarationNode["id"]["name"], state.value);
    state.init_ = false;
    declarationNode = declarations[++n];
  }
  while (declarationNode) {
    // Skip any declarations that are not initialized.  They have already
    // been defined as undefined in populateScope_.
    if (declarationNode["init"]) {
      state.n_ = n;
      state.init_ = true;
      return new Interpreter.State(declarationNode["init"], state.scope);
    }
    declarationNode = declarations[++n];
  }
  stack.pop();
};

Interpreter.prototype["stepWithStatement"] = function (stack, state, node) {
  if (!state.doneObject_) {
    state.doneObject_ = true;
    return new Interpreter.State(node["object"], state.scope);
  } else if (!state.doneBody_) {
    state.doneBody_ = true;
    var scope = this.createSpecialScope(state.scope, state.value);
    return new Interpreter.State(node["body"], scope);
  } else {
    stack.pop();
  }
};

Interpreter.prototype["stepWhileStatement"] = Interpreter.prototype["stepDoWhileStatement"];

// Preserve top-level API functions from being pruned/renamed by JS compilers.
// Add others as needed.
// The global object ('window' in a browser, 'global' in node.js) is 'this'.
//this['Interpreter'] = Interpreter;
Interpreter.prototype["step"] = Interpreter.prototype.step;
Interpreter.prototype["run"] = Interpreter.prototype.run;
Interpreter.prototype["appendCode"] = Interpreter.prototype.appendCode;
Interpreter.prototype["createObject"] = Interpreter.prototype.createObject;
Interpreter.prototype["createObjectProto"] = Interpreter.prototype.createObjectProto;
Interpreter.prototype["createAsyncFunction"] = Interpreter.prototype.createAsyncFunction;
Interpreter.prototype["createNativeFunction"] = Interpreter.prototype.createNativeFunction;
Interpreter.prototype["getProperty"] = Interpreter.prototype.getProperty;
Interpreter.prototype["setProperty"] = Interpreter.prototype.setProperty;
Interpreter.prototype["nativeToPseudo"] = Interpreter.prototype.nativeToPseudo;
Interpreter.prototype["pseudoToNative"] = Interpreter.prototype.pseudoToNative;
// Obsolete.  Do not use.
Interpreter.prototype["createPrimitive"] = function (x) {
  return x;
};

export { Interpreter };

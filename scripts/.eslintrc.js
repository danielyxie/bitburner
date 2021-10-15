const numSpaces = 4;
const maxLineLength = 160;

module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        },
        "ecmaVersion": 8,
        "sourceType": "module"
    },
    "rules": {
        "accessor-pairs": [
            "error",
            {
                "getWithoutSet": false,
                "setWithoutGet": true
            }
        ],
        "array-bracket-newline": ["error"],
        "array-bracket-spacing": ["error"],
        "array-callback-return": ["error"],
        "array-element-newline": ["error"],
        "arrow-body-style": ["error"],
        "arrow-parens": ["error"],
        "arrow-spacing": ["error"],
        "block-scoped-var": ["error"],
        "block-spacing": ["error"],
        "brace-style": ["error"],
        "callback-return": ["error"],
        "camelcase": ["error"],
        "capitalized-comments": ["error"],
        "class-methods-use-this": ["error"],
        "comma-dangle": ["error"],
        "comma-spacing": ["error"],
        "comma-style": [
            "error",
            "last"
        ],
        "complexity": ["error"],
        "computed-property-spacing": [
            "error",
            "never"
        ],
        "consistent-return": ["error"],
        "consistent-this": ["error"],
        "constructor-super": ["error"],
        "curly": ["error"],
        "default-case": ["error"],
        "dot-location": [
            "error",
            "property"
        ],
        "dot-notation": ["error"],
        "eol-last": ["error"],
        "eqeqeq": ["error"],
        "for-direction": ["error"],
        "func-call-spacing": ["error"],
        "func-name-matching": ["error"],
        "func-names": [
            "error",
            "never"
        ],
        "func-style": ["error"],
        "function-paren-newline": ["error"],
        "generator-star-spacing": [
            "error",
            "before"
        ],
        "getter-return": [
            "error",
            {
                "allowImplicit": false
            }
        ],
        "global-require": ["error"],
        "guard-for-in": ["error"],
        "handle-callback-err": ["error"],
        "id-blacklist": ["error"],
        "id-length": ["error"],
        "id-match": ["error"],
        "implicit-arrow-linebreak": [
            "error",
            "beside"
        ],
        "indent": [
            "error",
            numSpaces,
            {
                "SwitchCase": 1
            }
        ],
        "init-declarations": ["error"],
        "jsx-quotes": ["error"],
        "key-spacing": ["error"],
        "keyword-spacing": ["error"],
        "line-comment-position": ["error"],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "lines-around-comment": ["error"],
        "lines-between-class-members": ["error"],
        "max-depth": ["error"],
        "max-len": [
            "error",
            maxLineLength
        ],
        "max-lines": [
            "error",
            {
                "skipBlankLines": true,
                "skipComments": true
            }
        ],
        "max-nested-callbacks": ["error"],
        "max-params": ["error"],
        "max-statements": ["error"],
        "max-statements-per-line": ["error"],
        "multiline-comment-style": [
            "off",
            "starred-block"
        ],
        "multiline-ternary": [
            "error",
            "never"
        ],
        "new-cap": ["error"],
        "new-parens": ["error"],
        // TODO: configure this...
        "newline-before-return": ["error"],
        "newline-per-chained-call": ["error"],
        "no-alert": ["error"],
        "no-array-constructor": ["error"],
        "no-await-in-loop": ["error"],
        "no-bitwise": ["error"],
        "no-buffer-constructor": ["error"],
        "no-caller": ["error"],
        "no-case-declarations": ["error"],
        "no-catch-shadow": ["error"],
        "no-class-assign": ["error"],
        "no-compare-neg-zero": ["error"],
        "no-cond-assign": [
            "error",
            "except-parens"
        ],
        "no-confusing-arrow": ["error"],
        "no-console": ["error"],
        "no-const-assign": ["error"],
        "no-constant-condition": [
            "error",
            {
                "checkLoops": false
            }
        ],
        "no-continue": ["off"],
        "no-control-regex": ["error"],
        "no-debugger": ["error"],
        "no-delete-var": ["error"],
        "no-div-regex": ["error"],
        "no-dupe-args": ["error"],
        "no-dupe-class-members": ["error"],
        "no-dupe-keys": ["error"],
        "no-duplicate-case": ["error"],
        "no-duplicate-imports": [
            "error",
            {
                "includeExports": true
            }
        ],
        "no-else-return": ["error"],
        "no-empty": [
            "error",
            {
                "allowEmptyCatch": false
            }
        ],
        "no-empty-character-class": ["error"],
        "no-empty-function": ["error"],
        "no-empty-pattern": ["error"],
        "no-eq-null": ["error"],
        "no-eval": ["error"],
        "no-ex-assign": ["error"],
        "no-extend-native": ["error"],
        "no-extra-bind": ["error"],
        "no-extra-boolean-cast": ["error"],
        "no-extra-label": ["error"],
        "no-extra-parens": [
            "error",
            "all",
            {
                "conditionalAssign": false
            }
        ],
        "no-extra-semi": ["error"],
        "no-fallthrough": ["error"],
        "no-floating-decimal": ["error"],
        "no-func-assign": ["error"],
        "no-global-assign": ["error"],
        "no-implicit-coercion": ["error"],
        "no-implicit-globals": ["error"],
        "no-implied-eval": ["error"],
        "no-inline-comments": ["error"],
        "no-inner-declarations": [
            "error",
            "both"
        ],
        "no-invalid-regexp": ["error"],
        "no-invalid-this": ["error"],
        "no-irregular-whitespace": [
            "error",
            {
                "skipComments": false,
                "skipRegExps": false,
                "skipStrings": false,
                "skipTemplates": false
            }
        ],
        "no-iterator": ["error"],
        "no-label-var": ["error"],
        "no-labels": ["error"],
        "no-lone-blocks": ["error"],
        "no-lonely-if": ["error"],
        "no-loop-func": ["error"],
        "no-magic-numbers": [
            "error",
            {
                "ignore": [
                    -1,
                    0,
                    1
                ],
                "ignoreArrayIndexes": true
            }
        ],
        "no-mixed-operators": ["error"],
        "no-mixed-requires": ["error"],
        "no-mixed-spaces-and-tabs": ["error"],
        "no-multi-assign": ["error"],
        "no-multi-spaces": ["error"],
        "no-multi-str": ["error"],
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 1
            }
        ],
        "no-native-reassign": ["error"],
        "no-negated-condition": ["error"],
        "no-negated-in-lhs": ["error"],
        "no-nested-ternary": ["error"],
        "no-new": ["error"],
        "no-new-func": ["error"],
        "no-new-object": ["error"],
        "no-new-require": ["error"],
        "no-new-symbol": ["error"],
        "no-new-wrappers": ["error"],
        "no-obj-calls": ["error"],
        "no-octal": ["error"],
        "no-octal-escape": ["error"],
        "no-param-reassign": ["error"],
        "no-path-concat": ["error"],
        "no-plusplus": [
            "error",
            {
                "allowForLoopAfterthoughts": true
            }
        ],
        "no-process-env": ["error"],
        "no-process-exit": ["error"],
        "no-proto": ["error"],
        "no-prototype-builtins": ["error"],
        "no-redeclare": ["error"],
        "no-regex-spaces": ["error"],
        "no-restricted-globals": ["error"],
        "no-restricted-imports": ["error"],
        "no-restricted-modules": ["error"],
        "no-restricted-properties": [
            "error",
            {
                "message": "'log' is too general, use an appropriate level when logging.",
                "object": "console",
                "property": "log"
            }
        ],
        "no-restricted-syntax": ["error"],
        "no-return-assign": ["error"],
        "no-return-await": ["error"],
        "no-script-url": ["error"],
        "no-self-assign": [
            "error",
            {
                "props": false
            }
        ],
        "no-self-compare": ["error"],
        "no-sequences": ["error"],
        "no-shadow": ["error"],
        "no-shadow-restricted-names": ["error"],
        "no-spaced-func": ["error"],
        "no-sparse-arrays": ["error"],
        "no-sync": ["error"],
        "no-tabs": ["error"],
        "no-template-curly-in-string": ["error"],
        "no-ternary": ["off"],
        "no-this-before-super": ["error"],
        "no-throw-literal": ["error"],
        "no-trailing-spaces": ["error"],
        "no-undef": ["error"],
        "no-undef-init": ["error"],
        "no-undefined": ["error"],
        "no-underscore-dangle": ["error"],
        "no-unexpected-multiline": ["error"],
        "no-unmodified-loop-condition": ["error"],
        "no-unneeded-ternary": ["error"],
        "no-unreachable": ["error"],
        "no-unsafe-finally": ["error"],
        "no-unsafe-negation": ["error"],
        "no-unused-expressions": ["error"],
        "no-unused-labels": ["error"],
        "no-unused-vars": ["error"],
        "no-use-before-define": ["error"],
        "no-useless-call": ["error"],
        "no-useless-computed-key": ["error"],
        "no-useless-concat": ["error"],
        "no-useless-constructor": ["error"],
        "no-useless-escape": ["error"],
        "no-useless-rename": [
            "error",
            {
                "ignoreDestructuring": false,
                "ignoreExport": false,
                "ignoreImport": false
            }
        ],
        "no-useless-return": ["error"],
        "no-var": ["error"],
        "no-void": ["error"],
        "no-warning-comments": ["error"],
        "no-whitespace-before-property": ["error"],
        "no-with": ["error"],
        "nonblock-statement-body-position": [
            "error",
            "below"
        ],
        "object-curly-newline": ["error"],
        "object-curly-spacing": ["error"],
        "object-property-newline": ["error"],
        "object-shorthand": ["error"],
        "one-var": ["off"],
        "one-var-declaration-per-line": ["error"],
        "operator-assignment": ["error"],
        "operator-linebreak": [
            "error",
            "none"
        ],
        "padded-blocks": ["off"],
        "padding-line-between-statements": ["error"],
        "prefer-arrow-callback": ["error"],
        "prefer-const": ["error"],
        "prefer-destructuring": ["off"],
        "prefer-numeric-literals": ["error"],
        "prefer-promise-reject-errors": ["off"],
        "prefer-reflect": ["error"],
        "prefer-rest-params": ["error"],
        "prefer-spread": ["error"],
        "prefer-template": ["error"],
        "quote-props": ["error"],
        "quotes": ["error"],
        "radix": [
            "error",
            "as-needed"
        ],
        "require-await": ["error"],
        "require-jsdoc": ["off"],
        "require-yield": ["error"],
        "rest-spread-spacing": [
            "error",
            "never"
        ],
        "semi": ["error"],
        "semi-spacing": ["error"],
        "semi-style": [
            "error",
            "last"
        ],
        "sort-imports": ["error"],
        "sort-keys": ["error"],
        "sort-vars": ["error"],
        "space-before-blocks": ["error"],
        "space-before-function-paren": ["off"],
        "space-in-parens": ["error"],
        "space-infix-ops": ["error"],
        "space-unary-ops": ["error"],
        "spaced-comment": ["error"],
        "strict": ["error"],
        "switch-colon-spacing": [
            "error",
            {
                "after": true,
                "before": false
            }
        ],
        "symbol-description": ["error"],
        "template-curly-spacing": ["error"],
        "template-tag-spacing": ["error"],
        "unicode-bom": [
            "error",
            "never"
        ],
        "use-isnan": ["error"],
        "valid-jsdoc": ["error"],
        "valid-typeof": ["error"],
        "vars-on-top": ["error"],
        "wrap-iife": [
            "error",
            "any"
        ],
        "wrap-regex": ["error"],
        "yield-star-spacing": [
            "error",
            "before"
        ],
        "yoda": [
            "error",
            "never"
        ]
    }
};

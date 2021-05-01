module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": false,
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module",
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
        },
    },
    "plugins": [
        '@typescript-eslint',
    ],
    "rules": {
        "accessor-pairs": [
            "error",
            {
                "setWithoutGet": true,
                "getWithoutSet": false,
            },
        ],
        "array-bracket-newline": [
            "off",
        ],
        "array-bracket-spacing": [
            "off",
        ],
        "array-callback-return": [
            "off",
        ],
        "array-element-newline": [
            "off",
        ],
        "arrow-body-style": [
            "off",
        ],
        "arrow-parens": [
            "off",
        ],
        "arrow-spacing": [
            "off",
        ],
        "block-scoped-var": [
            "off",
        ],
        "block-spacing": [
            "off",
        ],
        "brace-style": [
            "off",
        ],
        "callback-return": [
            "error",
        ],
        "camelcase": [
            "off",
        ],
        "capitalized-comments": [
            "off",
        ],
        "class-methods-use-this": [
            "off",
        ],
        "comma-dangle": [
            "error", {
                "arrays": "always-multiline",
                "objects": "always-multiline",
                "imports": "always-multiline",
                "exports": "always-multiline",
                "functions": "always-multiline",
            },
        ],
        "comma-spacing": [
            "off",
        ],
        "comma-style": [
            "error",
            "last",
        ],
        "complexity": [
            "off",
        ],
        "computed-property-spacing": [
            "off",
            "never",
        ],
        "consistent-return": [
            "off",
        ],
        "consistent-this": [
            "off",
        ],
        "constructor-super": [
            "error",
        ],
        "curly": [
            "off",
        ],
        "default-case": [
            "off",
        ],
        "dot-location": [
            "error",
            "property",
        ],
        "dot-notation": [
            "off",
        ],
        "eol-last": [
            "off",
        ],
        "eqeqeq": [
            "off",
        ],
        "for-direction": [
            "error",
        ],
        "func-call-spacing": [
            "off",
        ],
        "func-name-matching": [
            "error",
        ],
        "func-names": [
            "off",
            "never",
        ],
        "func-style": [
            "off",
        ],
        "function-paren-newline": [
            "off",
        ],
        "generator-star-spacing": [
            "error",
            "before",
        ],
        "getter-return": [
            "error",
            {
                "allowImplicit": false,
            },
        ],
        "global-require": [
            "off",
        ],
        "guard-for-in": [
            "off",
        ],
        "handle-callback-err": [
            "error",
        ],
        "id-blacklist": [
            "error",
        ],
        "id-length": [
            "off",
        ],
        "id-match": [
            "error",
        ],
        "implicit-arrow-linebreak": [
            "error",
            "beside",
        ],
        "indent": [
            "off",
        ],
        "indent-legacy": [
            "off",
        ],
        "init-declarations": [
            "off",
        ],
        "jsx-quotes": [
	    "error",
    	],
        "key-spacing": [
            "off",
        ],
        "keyword-spacing": [
            "off",
        ],
        "line-comment-position": [
            "off",
        ],
        "linebreak-style": [
            "off", // Line endings automatically converted to LF on git commit so probably shouldn't care about it here
        ],
        "lines-around-comment": [
            "off",
        ],
        "lines-around-directive": [
            "error",
        ],
        "lines-between-class-members": [
            "error",
        ],
        "max-depth": [
            "off",
        ],
        "max-len": [
            "off",
        ],
        "max-lines": [
            "off",
        ],
        "max-nested-callbacks": [
            "error",
        ],
        "max-params": [
            "off",
        ],
        "max-statements": [
            "off",
        ],
        "max-statements-per-line": [
            "off",
        ],
        "multiline-comment-style": [
            "off",
            "starred-block",
        ],
        "multiline-ternary": [
            "off",
            "never",
        ],
        "new-cap": [
            "off",
        ],
        "new-parens": [
            "off",
        ],
        "newline-after-var": [
            "off",
        ],
        "newline-before-return": [
            "off",
        ],
        "newline-per-chained-call": [
            "off",
        ],
        "no-alert": [
            "error",
        ],
        "no-array-constructor": [
            "error",
        ],
        "no-await-in-loop": [
            "error",
        ],
        "no-bitwise": [
            "off",
        ],
        "no-buffer-constructor": [
            "error",
        ],
        "no-caller": [
            "error",
        ],
        "no-case-declarations": [
            "error",
        ],
        "no-catch-shadow": [
            "error",
        ],
        "no-class-assign": [
            "error",
        ],
        "no-compare-neg-zero": [
            "error",
        ],
        "no-cond-assign": [
            "off",
            "except-parens",
        ],
        "no-confusing-arrow": [
            "error",
        ],
        "no-console": [
            "off",
        ],
        "no-const-assign": [
            "error",
        ],
        "no-constant-condition": [
            "error",
            {
                "checkLoops": false,
            },
        ],
        "no-continue": [
            "off",
        ],
        "no-control-regex": [
            "error",
        ],
        "no-debugger": [
            "error",
        ],
        "no-delete-var": [
            "error",
        ],
        "no-div-regex": [
            "error",
        ],
        "no-dupe-args": [
            "error",
        ],
        "no-dupe-class-members": [
            "error",
        ],
        "no-dupe-keys": [
            "error",
        ],
        "no-duplicate-case": [
            "error",
        ],
        "no-duplicate-imports": [
            "error",
            {
                "includeExports": true,
            },
        ],
        "no-else-return": [
            "off",
        ],
        "no-empty": [
            "off",
            {
                "allowEmptyCatch": false,
            },
        ],
        "no-empty-character-class": [
            "error",
        ],
        "no-empty-function": [
            "off",
        ],
        "no-empty-pattern": [
            "error",
        ],
        "no-eq-null": [
            "off",
        ],
        "no-ex-assign": [
            "off",
        ],
        "no-extra-boolean-cast": [
            "error",
        ],
        "no-extra-parens": [
            "off",
        ],
        "no-extra-semi": [
            "off",
        ],
        "no-eval": [
            "off",
        ],
        "no-extend-native": [
            "off",
        ],
        "no-extra-bind": [
            "error",
        ],
        "no-extra-label": [
            "error",
        ],
        "no-fallthrough": [
            "off",
        ],
        "no-floating-decimal": [
            "off",
        ],
        "no-func-assign": [
            "error",
        ],
        "no-global-assign": [
            "error",
        ],
        "no-implicit-coercion": [
            "off",
        ],
        "no-implicit-globals": [
            "error",
        ],
        "no-implied-eval": [
            "error",
        ],
        "no-inline-comments": [
            "off",
        ],
        "no-inner-declarations": [
            "off",
            "both",
        ],
        "no-invalid-regexp": [
            "error",
        ],
        "no-invalid-this": [
            "off",
        ],
        "no-irregular-whitespace": [
            "error",
            {
                "skipStrings": false,
                "skipComments": false,
                "skipRegExps": false,
                "skipTemplates": false,
            },
        ],
        "no-iterator": [
            "error",
        ],
        "no-label-var": [
            "error",
        ],
        "no-labels": [
            "off",
        ],
        "no-lone-blocks": [
            "error",
        ],
        "no-lonely-if": [
            "off",
        ],
        "no-loop-func": [
            "off",
        ],
        "no-magic-numbers": [
            "off",
        ],
        "no-mixed-operators": [
            "off",
        ],
        "no-mixed-requires": [
            "error",
        ],
        "no-mixed-spaces-and-tabs": [
            "off",
        ],
        "no-multi-assign": [
            "off",
        ],
        "no-multi-spaces": [
            "off",
        ],
        "no-multi-str": [
            "error",
        ],
        "no-multiple-empty-lines": [
            "off",
            {
                "max": 1,
            },
        ],
        "no-native-reassign": [
            "error",
        ],
        "no-negated-condition": [
            "off",
        ],
        "no-negated-in-lhs": [
            "error",
        ],
        "no-nested-ternary": [
            "off",
        ],
        "no-new": [
            "error",
        ],
        "no-new-func": [
            "error",
        ],
        "no-new-object": [
            "error",
        ],
        "no-new-require": [
            "error",
        ],
        "no-new-symbol": [
            "error",
        ],
        "no-new-wrappers": [
            "error",
        ],
        "no-octal": [
            "error",
        ],
        "no-octal-escape": [
            "error",
        ],
        "no-obj-calls": [
            "error",
        ],
        "no-param-reassign": [
            "off",
        ],
        "no-path-concat": [
            "error",
        ],
        "no-plusplus": [
            "off",
        ],
        "no-process-env": [
            "off",
        ],
        "no-process-exit": [
            "error",
        ],
        "no-proto": [
            "error",
        ],
        "no-prototype-builtins": [
            "off",
        ],
        "no-redeclare": [
            "off",
        ],
        "no-regex-spaces": [
            "error",
        ],
        "no-restricted-globals": [
            "error",
        ],
        "no-restricted-imports": [
            "error",
        ],
        "no-restricted-modules": [
            "error",
        ],
        "no-restricted-properties": [
            "off",
            {
                "object": "console",
                "property": "log",
                "message": "'log' is too general, use an appropriate level when logging.",
            },
        ],
        "no-restricted-syntax": [
            "error",
        ],
        "no-return-assign": [
            "off",
        ],
        "no-return-await": [
            "error",
        ],
        "no-script-url": [
            "error",
        ],
        "no-self-assign": [
            "error",
            {
                "props": false,
            },
        ],
        "no-self-compare": [
            "error",
        ],
        "no-sequences": [
            "error",
        ],
        "no-shadow": [
            "off",
        ],
        "no-shadow-restricted-names": [
            "error",
        ],
        "no-spaced-func": [
            "off",
        ],
        "no-sparse-arrays": [
            "error",
        ],
        "no-sync": [
            "error",
        ],
        "no-tabs": [
            "off",
        ],
        "no-template-curly-in-string": [
            "error",
        ],
        "no-ternary": [
            "off",
        ],
        "no-this-before-super": [
            "off",
        ],
        "no-throw-literal": [
            "error",
        ],
        "no-trailing-spaces": [
            "off",
        ],
        "no-undef": [
            "off",
        ],
        "no-undef-init": [
            "error",
        ],
        "no-undefined": [
            "off",
        ],
        "no-underscore-dangle": [
            "off",
        ],
        "no-unexpected-multiline": [
            "error",
        ],
        "no-unmodified-loop-condition": [
            "error",
        ],
        "no-unneeded-ternary": [
            "off",
        ],
        "no-unreachable": [
            "off",
        ],
        "no-unsafe-finally": [
            "error",
        ],
        "no-unsafe-negation": [
            "error",
        ],
        "no-unused-expressions": [
            "off",
        ],
        "no-unused-labels": [
            "error",
        ],
        "no-unused-vars": [
            "off",
        ],
        "no-use-before-define": [
            "off",
        ],
        "no-useless-call": [
            "off",
        ],
        "no-useless-computed-key": [
            "error",
        ],
        "no-useless-concat": [
            "off",
        ],
        "no-useless-constructor": [
            "error",
        ],
        "no-useless-escape": [
            "off",
        ],
        "no-useless-rename": [
            "error",
            {
                "ignoreDestructuring": false,
                "ignoreExport": false,
                "ignoreImport": false,
            },
        ],
        "no-useless-return": [
            "off",
        ],
        "no-var": [
            "off",
        ],
        "no-void": [
            "off",
        ],
        "no-warning-comments": [
            "off",
        ],
        "no-whitespace-before-property": [
            "error",
        ],
        "no-with": [
            "error",
        ],
        "nonblock-statement-body-position": [
            "off",
            "below",
        ],
        "object-curly-newline": [
            "off",
        ],
        "object-curly-spacing": [
            "off",
        ],
        "object-property-newline": [
            "off",
        ],
        "object-shorthand": [
            "off",
        ],
        "one-var": [
            "off",
        ],
        "one-var-declaration-per-line": [
            "off",
        ],
        "operator-assignment": [
            "off",
        ],
        "operator-linebreak": [
            "off",
            "none",
        ],
        "padded-blocks": [
            "off",
        ],
        "padding-line-between-statements": [
            "error",
        ],
        "prefer-arrow-callback": [
            "off",
        ],
        "prefer-const": [
            "off",
        ],
        "prefer-destructuring": [
            "off",
        ],
        "prefer-numeric-literals": [
            "error",
        ],
        "prefer-promise-reject-errors": [
            "off",
        ],
        "prefer-reflect": [
            "off",
        ],
        "prefer-rest-params": [
            "off",
        ],
        "prefer-spread": [
            "off",
        ],
        "prefer-template": [
            "off",
        ],
        "quote-props": [
            "off",
        ],
        "quotes": [
            "off",
        ],
        "radix": [
            "off",
            "as-needed",
        ],
        "require-await": [
            "off",
        ],
        "require-jsdoc": [
            "off",
        ],
        "require-yield": [
            "error",
        ],
        "rest-spread-spacing": [
            "error",
            "never",
        ],
        "semi": [
            "off",
        ],
        "semi-spacing": [
            "off",
        ],
        "semi-style": [
            "error",
            "last",
        ],
        "sort-imports": [
            "off",
        ],
        "sort-keys": [
            "off",
        ],
        "sort-vars": [
            "off",
        ],
        "space-before-blocks": [
            "off",
        ],
        "space-before-function-paren": [
            "off",
        ],
        "space-in-parens": [
            "off",
        ],
        "space-infix-ops": [
            "off",
        ],
        "space-unary-ops": [
            "off",
        ],
        "spaced-comment": [
            "off",
        ],
        "strict": [
            "off",
        ],
        "switch-colon-spacing": [
            "error",
            {
                "after": true,
                "before": false,
            },
        ],
        "symbol-description": [
            "error",
        ],
        "template-curly-spacing": [
            "error",
        ],
        "template-tag-spacing": [
            "error",
        ],
        "unicode-bom": [
            "error",
            "never",
        ],
        "use-isnan": [
            "error",
        ],
        "valid-jsdoc": [
            "off",
        ],
        "valid-typeof": [
            "error",
        ],
        "vars-on-top": [
            "off",
        ],
        "wrap-iife": [
            "error",
            "any",
        ],
        "wrap-regex": [
            "off",
        ],
        "yield-star-spacing": [
            "error",
            "before",
        ],
        "yoda": [
            "error",
            "never",
        ],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
    },
    "overrides": [
        {
          // enable the rule specifically for TypeScript files
          "files": ["*.ts", "*.tsx"],
          "rules": {
            "@typescript-eslint/explicit-function-return-type": ["error"],
            "@typescript-eslint/explicit-module-boundary-types": ["error"],
          },
        },
        {
            // TypeScript configuration
            "files": [ "**/*.ts", "**/*.tsx" ],
            "parser": "@typescript-eslint/parser",
            "plugins": [ "@typescript-eslint" ],
            "extends": [
                "plugin:@typescript-eslint/recommended",
            ],
            "rules": {
                "lines-between-class-members": "off",
                "no-empty-pattern": "off",
                "no-useless-constructor": [
                    "off", // Valid for typescript due to property ctor shorthand
                ],
                "@typescript-eslint/ban-ts-comment": "off",
                "@typescript-eslint/ban-ts-ignore": "off",
                "@typescript-eslint/camelcase": "off",
                "@typescript-eslint/explicit-function-return-type": ["error", {
                    "allowExpressions": true,
                }],
                "@typescript-eslint/member-delimiter-style": ["error", {
                    "multiline": {
                        "delimiter": "semi",
                        "requireLast": true,
                    },
                    "singleline": {
                        "delimiter": "semi",
                        "requireLast": false,
                    },
                }],
                "@typescript-eslint/member-ordering": ["error", {
                    "default": [
                        "signature",
                        "static-field",
                        "instance-field",
                        "abstract-field",
                        "constructor",
                        "instance-method",
                        "abstract-method",
                        "static-method",
                    ],
                }],
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-use-before-define": "off",
            },
        },
    ],
};
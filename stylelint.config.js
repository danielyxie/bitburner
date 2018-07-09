/* eslint-disable spaced-comment */
module.exports = {
    plugins: [
        "stylelint-declaration-use-variable",
        "stylelint-order" /*,
        "stylelint-scss" */
    ],
    rules: {
        "at-rule-blacklist": [],
//        "at-rule-empty-line-before": [
//            "always",
//            {
//                except: [
//                    "inside-block", "blockless-after-same-name-blockless"
//                ],
//                ignore: [
//                    "after-comment"
//                ]
//            }
//        ],
        "at-rule-name-case": "lower",
        "at-rule-name-newline-after": "always-multi-line",
        "at-rule-name-space-after": "always",
//        "at-rule-no-vendor-prefix": true,
        "at-rule-semicolon-newline-after": "always",
        "at-rule-semicolon-space-before": "never",
//        "at-rule-whitelist": [
//            "content",
//            "else",
//            "function",
//            "if",
//            "import",
//            "include",
//            "keyframes",
//            "mixin",
//            "return"
//        ],
        "block-closing-brace-empty-line-before": "never",
        "block-closing-brace-newline-after": "always",
        "block-closing-brace-newline-before": "always-multi-line",
        "block-no-empty": true,
//        "block-opening-brace-newline-after": "always",
//        "block-opening-brace-newline-before": "never-single-line",
//        "block-opening-brace-space-before": "always",
        "color-hex-case": "lower",
//        "color-hex-length": "short",
        "color-named": "never",
        //"color-no-hex": true,
        "color-no-invalid-hex": true,
//        "comment-empty-line-before": "always",
        "comment-no-empty": true,
//        "comment-whitespace-inside": "always",
        "comment-word-blacklist": [],
        "custom-media-pattern": ".+",
        "custom-property-empty-line-before": "never",
        "custom-property-pattern": "my-.+",
        "declaration-bang-space-after": "never",
//        "declaration-bang-space-before": "always",
//        "declaration-block-no-duplicate-properties": true,
        "declaration-block-no-redundant-longhand-properties": true,
        "declaration-block-no-shorthand-property-overrides": true,
//        "declaration-block-semicolon-newline-after": "always",
        "declaration-block-semicolon-newline-before": "never-multi-line",
        "declaration-block-semicolon-space-before": "never",
//        "declaration-block-single-line-max-declarations": 1,
        "declaration-block-trailing-semicolon": "always",
        "declaration-colon-newline-after": "always-multi-line",
//        "declaration-colon-space-after": "always-single-line",
        "declaration-colon-space-before": "never",
//        "declaration-empty-line-before": "never",
        //"declaration-no-important": true,
        "declaration-property-unit-blacklist": {},
        "declaration-property-unit-whitelist": {},
        "declaration-property-value-blacklist": {},
        "declaration-property-value-whitelist": {},
//        "font-family-name-quotes": "always-where-recommended",
        "font-family-no-duplicate-names": true,
        "font-family-no-missing-generic-family-keyword": true,
//        "font-weight-notation": "numeric",
        "function-blacklist": [],
        "function-calc-no-unspaced-operator": true,
        "function-comma-newline-after": "always-multi-line",
        "function-comma-newline-before": "never-multi-line",
//        "function-comma-space-after": "always-single-line",
        "function-comma-space-before": "never",
        "function-linear-gradient-no-nonstandard-direction": true,
        "function-max-empty-lines": 1,
        "function-name-case": "lower",
        "function-parentheses-newline-inside": "never-multi-line",
        "function-parentheses-space-inside": "never",
        "function-url-no-scheme-relative": true,
        "function-url-quotes": "always",
        "function-url-scheme-blacklist": [],
        "function-url-scheme-whitelist": [],
//        "function-whitelist": [
//            "box-shadow-args",
//            "map-get",
//            "rgba",
//            "skew",
//            "var"
//        ],
        "function-whitespace-after": "always",
//        "indentation": 4,
        "keyframe-declaration-no-important": true,
//        "length-zero-no-unit": true,
//        "max-empty-lines": 1,
        "max-line-length": 160,
        "max-nesting-depth": 99,
        "media-feature-colon-space-after": "always",
        "media-feature-colon-space-before": "never",
        "media-feature-name-blacklist": [],
        "media-feature-name-case": "lower",
        "media-feature-name-no-unknown": true,
        "media-feature-name-no-vendor-prefix": true,
        "media-feature-name-whitelist": [],
        "media-feature-parentheses-space-inside": "never",
        "media-feature-range-operator-space-after": "always",
        "media-feature-range-operator-space-before": "always",
        "media-query-list-comma-newline-after": "always-multi-line",
        "media-query-list-comma-newline-before": "never-multi-line",
        "media-query-list-comma-space-after": "always-single-line",
        "media-query-list-comma-space-before": "never",
//        "no-descending-specificity": true,
        "no-duplicate-at-import-rules": true,
//        "no-duplicate-selectors": true,
        "no-empty-source": true,
        "no-eol-whitespace": true,
//        "no-extra-semicolons": true,
        "no-invalid-double-slash-comments": true,
//        "no-missing-end-of-source-newline": true,
        "no-unknown-animations": true,
        "number-leading-zero": "always",
        "number-max-precision": [3, { ignoreUnits: [ "%" ] }],
//        "number-no-trailing-zeros": true,
        "order/order": [
            [
                "dollar-variables",
                "at-variables",
                "custom-properties",
                {
                    type: "at-rule",
                    name: "include"
                },
                "declarations",
                "rules",
                "at-rules",
                "less-mixins"
            ],
            {
                unspecified: "bottom"
            }
        ],
//        "order/properties-order": [
//            []
//        ],
//        "order/properties-alphabetical-order": true,
        "property-blacklist": [
            "grid-area",
            "grid-template",
            "grid-column",
            "grid-row"
        ],
        "property-case": "lower",
        "property-no-unknown": true,
//        "property-no-vendor-prefix": true,

        /*"property-whitelist": [
            "/animation$/",
            "/box-shadow$/",
            "/keyframes$/",
            "/transform$/",
            "display",
            "font-size"
        ], */
//        "rule-empty-line-before": ["always", { except: [ "after-single-line-comment" ] }],
        /*"scss/at-else-closing-brace-newline-after": "always-last-in-chain",
        "scss/at-else-empty-line-before": "never",
        "scss/at-else-if-parentheses-space-before": "always",
        "scss/at-extend-no-missing-placeholder": true,
        "scss/at-function-named-arguments": "never",
        "scss/at-function-parentheses-space-before": "never",
        "scss/at-function-pattern": /.+/,
        "scss/at-if-closing-brace-newline-after": "always-last-in-chain",
        "scss/at-import-no-partial-leading-underscore": true,
        "scss/at-import-partial-extension-blacklist": [
            []
        ],
        "scss/at-import-partial-extension-whitelist": [
            []
        ],
        "scss/at-mixin-argumentless-call-parentheses": "always",
        "scss/at-mixin-named-arguments": "never",
        "scss/at-mixin-parentheses-space-before": "never",
        "scss/at-mixin-pattern": /.+/,
        "scss/at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: []
            }
        ],
        "scss/dollar-variable-colon-newline-after": "always-multi-line",
        "scss/dollar-variable-colon-space-after": "always-single-line",
        "scss/dollar-variable-colon-space-before": "never",
        "scss/dollar-variable-default": [
            true,
            {
                ignore: "local"
            }
        ],
        "scss/dollar-variable-empty-line-before": "never",
        "scss/dollar-variable-no-missing-interpolation": true,
        "scss/dollar-variable-pattern": /.+/,
        "scss/percent-placeholder-pattern": /.+/,
        "scss/double-slash-comment-inline": [
            "always",
            {
                ignore: [
                    "stylelint-commands"
                ]
            }
        ],
        "scss/double-slash-comment-whitespace-inside": "always",
        "scss/declaration-nested-properties": "never",
        "scss/media-feature-value-dollar-variable": "always",
        "scss/operator-no-newline-after": true,
        "scss/operator-no-newline-before": true,
        "scss/operator-no-unspaced": true,
        "scss/partial-no-import": true,
        "scss/selector-no-redundant-nesting-selector": true,*/
        "selector-attribute-brackets-space-inside": "never",
        "selector-attribute-operator-blacklist": [],
//        "selector-attribute-operator-space-after": "always",
//        "selector-attribute-operator-space-before": "always",
        "selector-attribute-operator-whitelist": [
            "="
        ],
        "selector-attribute-quotes": "always",
        "selector-class-pattern": ".+",
        //"selector-combinator-blacklist": [],
//        "selector-combinator-space-after": "always",
//        "selector-combinator-space-before": "always",
        //"selector-combinator-whitelist": [],
        "selector-descendant-combinator-no-non-space": true,
        "selector-id-pattern": ".+",
        "selector-list-comma-newline-after": "always-multi-line",
        "selector-list-comma-newline-before": "never-multi-line",
        "selector-list-comma-space-after": "always-single-line",
        "selector-list-comma-space-before": "never",
        "selector-max-attribute": 99,
        "selector-max-class": 99,
        "selector-max-combinators": 99,
        "selector-max-compound-selectors": 99,
        "selector-max-empty-lines": 1,
        "selector-max-id": 1,
        //"selector-max-specificity": "0,0,0",
        "selector-max-type": 99,
        "selector-max-universal": 1,
        "selector-nested-pattern": ".+",
        "selector-no-qualifying-type": [
            true,
            {
                ignore: [
                    "attribute", "class"
                ]
            }
        ],
        "selector-no-vendor-prefix": true,
        "selector-pseudo-class-blacklist": [],
        "selector-pseudo-class-case": "lower",
        "selector-pseudo-class-no-unknown": true,
        "selector-pseudo-class-parentheses-space-inside": "never",
        "selector-pseudo-class-whitelist": [
            "active",
            "after",
            "before",
            "focus",
            "hover",
            "link",
            "not",
            "last-child",
            "root",
            "visited"
        ],
        //"selector-pseudo-element-blacklist": [],
        "selector-pseudo-element-case": "lower",
//        "selector-pseudo-element-colon-notation": "double",
        "selector-pseudo-element-no-unknown": true,
        //"selector-pseudo-element-whitelist": [],
        "selector-type-case": "lower",
        "selector-type-no-unknown": true,
//        "shorthand-property-no-redundant-values": true,
//        "sh-waqar/declaration-use-variable": [
//            [
//                "color",
//                "background-color",
//                "font-family"
//            ]
//        ],
        "string-no-newline": true,
//        "string-quotes": "double",
        "time-min-milliseconds": 50,
        "unit-blacklist": [],
        "unit-case": "lower",
        "unit-no-unknown": true,
        "unit-whitelist": [
            "deg",
            "fr",
            "px",
            "rem",
            "ms",
            "s",
            "vw",
            "%"
        ],
//        "value-keyword-case": "lower",
        "value-list-comma-newline-after": "always-multi-line",
        "value-list-comma-newline-before": "never-multi-line",
        "value-list-comma-space-after": "always-single-line",
        "value-list-comma-space-before": "never",
        "value-list-max-empty-lines": 0,
        "value-no-vendor-prefix": true
    }
};

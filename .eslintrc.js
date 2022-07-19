module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: false,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    project: ["./tsconfig.json", "./test/tsconfig.json", "./tools/tsconfig.json", "./test/cypress/tsconfig.json"],
  },
  plugins: ["@typescript-eslint"],
  extends: ["plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
      },
    ],
    // "no-constant-condition": [
    //   "error",
    //   {
    //     checkLoops: false,
    //   },
    // ],
    "no-empty": [
      "off",
      {
        allowEmptyCatch: false,
      },
    ],
    "no-inner-declarations": ["off", "both"],
    "no-prototype-builtins": ["off"],
    "no-useless-escape": ["off"],
    "@typescript-eslint/no-explicit-any": "off",
  },
};

/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "vue"
    ],
    parser: "babel-eslint",
    parserOptions: {
        ecmaVersion: 12,
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
        sourceType: 'module',
    },
    plugins: [
        "html",
        "flowtype-errors",
        "vue"
    ],
    rules: {
        "flowtype-errors/show-errors": 2
    }
};

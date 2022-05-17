module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  // parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    useJSXTextNode: true,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
};

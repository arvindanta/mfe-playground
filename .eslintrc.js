module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'standard',
  ],
  rules: {
    'comma-dangle': ['error', 'only-multiline'],
    'default-case': 'error',
    'import/extensions': ['warn'],
    'import/no-extraneous-dependencies': ['error'],
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true,
        MemberExpression: 1,
        VariableDeclarator: 1,
        ignoredNodes: ['ConditionalExpression'],
      },
    ],
    'jsx-a11y/anchor-is-valid': 'error',
    'linebreak-style': 'warn',
    'multiline-ternary': ['off', 'always-multiline'],
    'new-cap': 'off',
    'no-console': [
      'error',
      { allow: ['clear', 'info', 'error', 'dir', 'trace'] },
    ],
    'no-debugger': 'error',
    'no-implicit-globals': 'error',
    'no-restricted-globals': 'error',
    'no-var': 'error',
    'prettier/prettier': 'error',
    'quotes': [1, 'single', { avoidEscape: true }],
    'quote-props': ['error', 'consistent'],
    'react/jsx-uses-vars': 'error',
    'react/require-default-props': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-no-literals': ['off'],
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'semi': ['error', 'always'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'ignore',
        named: 'ignore',
        asyncArrow: 'always',
      },
    ],
  },
  plugins: ['react', 'react-hooks', 'import', 'jsx-a11y', 'prettier'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  //  parser: '@babel/eslint-parser',
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
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        useJSXTextNode: true,
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      env: {
        browser: true,
        jest: true,
        node: true,
      },
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
      ],
      plugins: ['@typescript-eslint', 'jsx-a11y'],
      rules: {
        '@typescript-eslint/no-unused-vars': 0,
        'react/no-jsx-bind': 0,
        'jsx-quotes': [1, 'prefer-single'],
        'eqeqeq': 2,
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': ['off'],
        'react/jsx-filename-extension': [
          1,
          { extensions: ['.js', '.jsx', '.tsx', '.ts'] },
        ],
        'react/no-unescaped-entities': ['off'],
        'react/no-unknown-property': ['off'],
      },
    },
  ],
};

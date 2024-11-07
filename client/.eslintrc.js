module.exports = {
  plugins: ['prettier', 'react', 'import'],
  root: true,
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like `it` etc.
    node: true, // Defines things like process.env when generating through node
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
  ],
  settings: {
    react: {
      version: 'detect', // Detect react version
    },
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  ignorePatterns: ['/*.*', '*.js'],
  rules: {
    'prettier/prettier': 'error',
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'react/react-in-jsx-scope': 'off',
    'no-plusplus': 0,
    'class-methods-use-this': 0,
    '@typescript-eslint/no-throw-literal': 0,
    '@typescript-eslint/lines-between-class-members': 0,
    '@typescript-eslint/no-unused-vars': [1, { args: 'none' }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.spec.ts'] }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        types: ['function'],
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase'],
        filter: {
          regex: '^use[A-Z].*',
          match: true,
        },
      },
      {
        selector: 'variable',
        format: ['PascalCase'],
        filter: {
          regex: 'Context$',
          match: true,
        },
      },
      {
        selector: 'variable',
        modifiers: ['global', 'const'],
        types: ['boolean', 'number', 'string', 'array'],
        format: ['UPPER_CASE'],
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
    ],
  },
};

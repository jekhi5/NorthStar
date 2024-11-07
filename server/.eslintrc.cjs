module.exports = {
  plugins: ['prettier', 'import', 'react'],
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  ignorePatterns: ['coverage/', 'node_modules/', '/*.*'],
  rules: {
    'prettier/prettier': 'error',
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
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
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'variable',
        format: ['PascalCase'],
        filter: {
          regex: 'Model$',
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

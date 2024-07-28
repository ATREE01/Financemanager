const { typescript } = require("./apps/next-frontend/next.config");

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": "latest",
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
        'import',
        'prettier',
        'simple-import-sort',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
        'prettier',
        'next'
    ],
    env: {
        browser: true,
        node: true,
        es2021: true
    },
    settings: {
        "import/resolver": {
            "typescript": {
                "project": [
                    "apps/nest-backend/tsconfig.json",
                    "apps/next-frontend/tsconfig.json"
                ]
            }
        },
        react: {
            version: 'detect'
        }
    },
    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "error",
        'prettier/prettier': 'error',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'import/order': [
            'error',
            {
                groups: [
                    ['builtin', 'external'],
                    ['internal', 'parent', 'sibling', 'index']
                ],
                'newlines-between': 'always'
            }
        ],
        "@typescript-eslint/no-unused-vars": ["error", { 
            "ignoreRestSiblings": true
        }]
    },
};
module.exports = {
	env: {
	  es6: true,
	  node: true
	},
	extends: ['eslint:recommended','airbnb-base', 'prettier',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript'
	],
	plugins: ['prettier'],
	globals: {
	  Atomics: 'readonly',
	  SharedArrayBuffer: 'readonly'
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
	  ecmaVersion: 2018,
	  sourceType: 'module'
	},
	settings: {
		"import/resolver": {
		  "node": {
			"extensions": [".js", ".jsx", ".ts", ".tsx"]
		  }
		}
	  },
	rules: {
	  'prettier/prettier': 'error',
	  'class-methods-use-this': 'off',
	  'no-param-reassign': 'off',
	  camelcase: 'off',
	  'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
	  "import/extensions": [
		"error",
		"ignorePackages",
		{
		  "js": "never",
		  "jsx": "never",
		  "ts": "never",
		  "tsx": "never"
		}
	 ]
	}
  };
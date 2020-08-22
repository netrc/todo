module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2020': true,
  },
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 11,
  },
  'rules': {
    "semi": ["error", "never"],
    "arrow-parens": ["error", "as-needed"],
    "comma-dangle": ["error", "never"],
    "array-bracket-spacing": ["error", "always"]
  },
};

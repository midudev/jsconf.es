import eslintPluginAstro from 'eslint-plugin-astro'
import neostandard from 'neostandard'

export default [
  ...neostandard(),
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: ['.astro/**/*.*'],
    files: ['**/*.astro', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/jsx-indent': 'off',
      '@stylistic/space-before-function-paren': 'off',
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      'react/self-closing-comp': 'off',
      'react/jsx-key': 'off',
      '@stylistic/jsx-closing-tag-location': 'off',
      '@stylistic/jsx-closing-bracket-location': 'off',
    },
  },
]

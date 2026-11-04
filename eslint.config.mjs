import js from '@eslint/js'
import globals from 'globals'

/**
 * JS lint. TypeScript is covered by `tsc --noEmit` (strict +
 * noUnusedLocals/noUnusedParameters) because typescript-eslint does not
 * support the TS 7 native port (verified: typescript-eslint@8 errors
 * "does not support TS 7.0"). React-hooks rules need a TS-aware parser,
 * so they are covered by code review + the exhaustive-deps discipline in
 * `src/hooks/*`. Revisit when typescript-eslint supports TS >= 7.1.
 */
export default [
  { ignores: ['dist/**', 'dist-dev/**', 'node_modules/**', 'src/**', 'coverage/**'] },
  js.configs.recommended,
  {
    files: ['scripts/**/*.mjs', 'eslint.config.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['scripts/sw-template.js'],
    languageOptions: {
      globals: { ...globals.node, ...globals.serviceworker, __PRECACHE__: 'readonly', __VERSION__: 'readonly' },
    },
  },
  {
    files: ['scripts/prerender.mjs', 'scripts/proof-local.mjs', 'scripts/perf-check.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    files: ['scripts/**/*.mjs'],
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-regex-spaces': 'off',
    },
  },
]

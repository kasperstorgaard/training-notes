// rollup.config.js
import alias from 'rollup-plugin-alias';
import resolve from 'rollup-plugin-node-resolve';

export default {
  experimentalCodeSplitting: true,
  input: {
    'main': './client/main.js',
    'components/nav': './client/components/nav/index.js'
  },
  output: [
  // ES module version, for modern browsers
  {
    dir: 'public/js/module',
    format: 'esm',
    sourcemap: true
  },
  // SystemJS version, for older browsers
  {
    dir: 'public/js/nomodule',
    format: 'system',
    sourcemap: true
  }],
  name: 'TrainingNotes',
  plugins: [
    alias({
      '@components': './client/components',
    }),
    resolve()
  ]
}
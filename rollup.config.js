import alias from 'rollup-plugin-alias';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';

export default {
  experimentalCodeSplitting: true,
  input: {
    'main': './client/main.js',
    'components/nav': './client/components/nav/nav.js',
    'components/calendar': './client/components/calendar.js'
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
    resolve(),
    postcss({
      inject: false,
      use: ['sass']
    })
  ],
  watch: {
    include: 'client/**',
    exclude: 'node_modules/**'
  }
}

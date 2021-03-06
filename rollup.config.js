const glob = require('glob');
const alias = require('rollup-plugin-alias');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const cleanup = require('rollup-plugin-cleanup');

const buildLookup = (lookup, filePath) => {
  const key = filePath.replace(/(^\.\/(app\/)?|\.js$)/g, '');
  lookup[key] = filePath;
  return lookup;
}

const app = glob.sync('./app/**/*.js').reduce(buildLookup, {});
const components = glob.sync('./components/**/index.js').reduce(buildLookup, {});

export default {
  experimentalCodeSplitting: true,
  input: {
    'components/calendar': './components/calendar/calendar.js',
    'components/nav': './components/nav/nav.js',
    'components/router': './components/router/router.js'
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
      '@components': './components',
    }),
    resolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    postcss({
      inject: false
    }),
    cleanup()
  ],
  watch: {
    exclude: 'node_modules/**'
  }
}

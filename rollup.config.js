const glob = require('glob');
const alias = require('rollup-plugin-alias');
const resolve = require('rollup-plugin-node-resolve');
const postcss = require('rollup-plugin-postcss');
const cssImports = require('postcss-import');

const buildLookup = (lookup, filePath) => {
  const key = filePath.replace(/(^\.\/|\.js$)/g, '');
  lookup[key] = filePath;
  return lookup;
}

const views = glob.sync('./views/**/*.js').reduce(buildLookup, {});
const components = glob.sync('./components/**/*.js').reduce(buildLookup, {});

export default {
  experimentalCodeSplitting: true,
  input: {
    ...views,
    ...components
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
    postcss({
      inject: false
    })
  ],
  watch: {
    exclude: 'node_modules/**'
  }
}

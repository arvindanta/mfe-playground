// import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
// import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

// import * as path from 'path';

const inputFileName = './src/root.js';

export default {
  input: inputFileName,
  output: [
    {
      format: 'system',
      file: 'dist/main.esm.js',
    },
  ],

  plugins: [
    babel({
      babelHelpers: 'bundled',
      plugins: ['@babel/plugin-proposal-class-properties'],
      presets: ['@babel/preset-env', '@babel/preset-flow'],
    }),
    // dynamicImportVars({}),
    // pluginCommonjs({
    //   extensions: ['.js', '.ts'],
    // }),
    // babel({
    //   babelHelpers: 'bundled',
    //   configFile: path.resolve(__dirname, '.babelrc.js'),
    // }),
    pluginNodeResolve({}),
  ],
};

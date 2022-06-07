import pluginNodeResolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

const inputFileName = './src/index.js';

export default {
  input: inputFileName,
  output: [
    {
      format: 'iife',
      file: 'dist/main.esm.js',
    },
  ],

  plugins: [
    babel({
      babelHelpers: 'bundled',
      plugins: ['@babel/plugin-proposal-class-properties'],
      presets: ['@babel/preset-env', '@babel/preset-flow'],
    }),

    pluginNodeResolve({}),
  ],
};

import pluginNodeResolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import pluginTypescript from '@rollup/plugin-typescript';

const inputFileName = './index.ts';
export default {
  input: inputFileName,
  output: [
    {
      format: 'iife',
      file: 'dist/main.esm.js',
      name: 'test',
    },
  ],
  plugins: [
    pluginTypescript(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
    }),
    pluginNodeResolve({}),
  ],
};

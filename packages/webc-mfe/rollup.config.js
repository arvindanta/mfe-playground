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
      presets: ['@babel/preset-env'],
    }),
  ],
};

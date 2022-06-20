import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
export const config: Config = {
  namespace: 'stencil-mfe',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  buildEs5: true,
  plugins: [
    sass({
      injectGlobalPaths: ['src/styles/index.scss'],
    }),
  ],
  // globalScript: 'src/wrapper.ts',
};

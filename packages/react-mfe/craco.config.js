const path = require('path');

module.exports = function () {
  return {
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        webpackConfig.output = {
          ...webpackConfig.output,
          ...{
            filename: 'main.esm.js',
            path: path.resolve(__dirname, 'build'),
            library: {
              type: 'system',
            },
          },
        };
        return webpackConfig;
      },
    },
  };
};

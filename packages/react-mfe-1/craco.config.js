const path = require('path');
module.exports = function () {
  return {
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        webpackConfig.output = {
          ...{
            filename: 'static/js/main.esm.js',
            path: path.join(__dirname, 'build'),
            publicPath: process.env.PUBLIC_URL
          },
        };
        return webpackConfig;
      },
    },
  };
};

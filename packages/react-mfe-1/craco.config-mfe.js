const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function () {
  return {
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        webpackConfig.output = {
          ...{
            filename: 'static/js/main.js',
            path: path.join(__dirname, 'build'),
            publicPath: process.env.PUBLIC_URL,
            libraryTarget: 'system',
          },
        };
        const htmlWebpackPluginInstance = webpackConfig.plugins.find(
          (webpackPlugin) => webpackPlugin instanceof HtmlWebpackPlugin
        );
        if (htmlWebpackPluginInstance) {
          htmlWebpackPluginInstance.userOptions.inject = false;
        }
        return webpackConfig;
      },
    },
  };
};

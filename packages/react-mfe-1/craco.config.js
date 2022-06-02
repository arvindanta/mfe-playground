module.exports = function () {
  return {
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        return webpackConfig;
      },
    },
  };
};

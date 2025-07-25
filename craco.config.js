const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        util: require.resolve("util/"),
        zlib: require.resolve("browserify-zlib"),
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        assert: require.resolve("assert/"),
        url: require.resolve("url/"),
      };
      return webpackConfig;
    },
  },
};

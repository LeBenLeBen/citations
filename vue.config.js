const path = require('path');

module.exports = {
  devServer: {
    port: 3000,
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '~kanbasu/src/scss/tools/functions';
          @import '~kanbasu/src/scss/tools/mixins';
          @import '@/assets/scss/settings/_settings.scss';
        `,
      },
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.svg$/,
          include: path.resolve('./src/assets/icons'),
          use: ['vue-svg-icon-loader'],
        },
      ],
    },
  },
  chainWebpack: config => {
    // Prevent generic SVG loader from taking care of SVG icons going in the sprite
    config.module.rule('svg').exclude.add(path.resolve('./src/assets/icons'));
  },
};

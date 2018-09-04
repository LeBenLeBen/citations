module.exports = {
  devServer: {
    port: 3000,
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import '~kanbasu/src/scss/tools/functions';
          @import '~kanbasu/src/scss/tools/mixins';
          @import '@/assets/scss/settings/_settings.scss';
        `,
      },
    },
  },
};

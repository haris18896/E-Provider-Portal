const path = require('path')

module.exports = {
  reactScriptsVersion: 'react-scripts',
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: ['node_modules', 'src/assets']
        }
      }
    },
    postcss: {
      plugins: [require('postcss-rtl')()]
    }
  },
  webpack: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/@core/assets'),
      '@components': path.resolve(__dirname, 'src/@core/components'),
      '@layouts': path.resolve(__dirname, 'src/@core/layouts'),
      '@customComponents': path.resolve(__dirname, 'src/components'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@store': path.resolve(__dirname, 'src/redux'),
      '@styles': path.resolve(__dirname, 'src/@core/scss'),
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@utils': path.resolve(__dirname, 'src/utility/Utils'),
      '@hooks': path.resolve(__dirname, 'src/utility/hooks'),
      '@ScreenComponent': path.resolve(__dirname, 'src/components/screen.components'),
      '@FormGroupElement': path.resolve(__dirname, 'src/components/formGroup/FormGroupElement'),
      '@FormIconField': path.resolve(__dirname, 'src/components/formGroup/FormIconField.js'),
      '@ReactSelectStyles': path.resolve(__dirname, 'src/components/formGroup/select-styling'),
      '@select': path.resolve(__dirname, 'src/components/formGroup/Select.js'),
      '@badgeColors' : path.resolve(__dirname, 'src/components/colors/BadgeColors'),
      '@search' : path.resolve(__dirname, 'src/components/search'),
      '@popover' : path.resolve(__dirname, 'src/components/popover'),
      '@pagination': path.resolve(__dirname, 'src/components/pagination/Pagination.js'),
      '@spinner' : path.resolve(__dirname, 'src/components/spinner/Spinner.js'),
      '@fullSpinner' : path.resolve(__dirname, 'src/components/spinner/FullSpinner.js'),
      '@FileUploader' : path.resolve(__dirname, 'src/components/fileUploader'),
      '@editor' : path.resolve(__dirname, 'src/components/editor')

    }
  }
}

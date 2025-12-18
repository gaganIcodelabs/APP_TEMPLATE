const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);
const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  resolver: {
    alias: {
      //   '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@context': path.resolve(__dirname, 'src/context'),
      //   '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@locales': path.resolve(__dirname, 'src/locales'),
      '@navigators': path.resolve(__dirname, 'src/navigators'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      //   '@scripts': path.resolve(__dirname, 'src/scripts'),
      '@transactions': path.resolve(__dirname, 'src/transactions'),
      '@appTypes': path.resolve(__dirname, 'src/types'),
      '@util': path.resolve(__dirname, 'src/util'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);

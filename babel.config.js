module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          // '@assets': './src/assets',
          '@components': './src/components',
          '@config': './src/config',
          '@constants': './src/constants',
          '@context': './src/context',
          // '@hooks': './src/hooks',
          '@locales': './src/locales',
          '@navigators': './src/navigators',
          '@redux': './src/redux',
          '@screens': './src/screens',
          // '@scripts': './src/scripts',
          '@transactions': './src/transactions',
          '@appTypes': './src/types',
          '@util': './src/util',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};

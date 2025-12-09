export const colors = {
  marketplaceColor: '#d29d27',
  marketplaceColorLight: '',
  marketplaceColorDark: '',
  colorPrimaryButton: '',
  colorPrimaryButtonLight: '',
  colorPrimaryButtonDark: '',
  transparent: 'transparent',
  black: '#000000',
  lightblack: '#161616',
  white: '#FFFFFF',
  grey: '#6C7278',
  lightGrey: '#F5F5F5',
  placeholder: '#949494',
  red: '#FF0000',
  errorRed: '#D03739',
};

export type AppColors = typeof colors;

export const mergeColors = (appColors: Partial<AppColors>) => ({
  ...colors,
  marketplaceColor: appColors.marketplaceColor,
  marketplaceColorLight: appColors.marketplaceColorLight,
  marketplaceColorDark: appColors.marketplaceColorDark,
});

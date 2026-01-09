import { RouteProp, useRoute } from '@react-navigation/native';
import { EDIT_LISTING_SCREENS } from './screens.constant';
import { EditListingWizardParamList } from './types/navigation.types';
import { createImageVariantConfig } from '@util/sdkLoader';
import { ListingImageLayout } from '@appTypes/config/configLayoutAndBranding';

export const useEditListingWizardRoute = () => {
  return useRoute<
    RouteProp<
      EditListingWizardParamList,
      typeof EDIT_LISTING_SCREENS.EDIT_LISTING_PAGE
    >
  >();
};

export const getImageVariantInfo = (listingImageConfig: ListingImageLayout) => {
  const {
    aspectWidth = 1,
    aspectHeight = 1,
    variantPrefix = 'listing-card',
  } = listingImageConfig;
  const aspectRatio = aspectHeight / aspectWidth;
  const fieldsImage = [
    `variants.${variantPrefix}`,
    `variants.${variantPrefix}-2x`,
  ];

  return {
    fieldsImage,
    imageVariants: {
      ...createImageVariantConfig(`${variantPrefix}`, 400, aspectRatio),
      ...createImageVariantConfig(`${variantPrefix}-2x`, 800, aspectRatio),
    },
  };
};

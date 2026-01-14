import { RouteProp, useRoute } from '@react-navigation/native';
import { EDIT_LISTING_SCREENS } from './screens.constant';
import { EditListingWizardParamList } from './types/navigation.types';
import { createImageVariantConfig } from '@util/sdkLoader';
import { ListingImageLayout } from '@appTypes/config/configLayoutAndBranding';
import { isFieldForCategory, isFieldForListingType } from '@util/fieldHelpers';
import { EXTENDED_DATA_SCHEMA_TYPES } from '@constants/schemaTypes';
import { ListingField, ListingFields } from '@appTypes/config';

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

/**
 * Pick extended data fields from given form data.
 */
export const pickListingFieldsData = (
  data: Record<string, any>,
  targetScope: 'public' | 'private',
  targetListingType: string,
  targetCategories: Record<string, string>,
  listingFieldConfigs: ListingFields,
): Record<string, any> => {
  const targetCategoryIds = Object.values(targetCategories) as string[];

  return listingFieldConfigs.reduce(
    (fields: Record<string, any>, fieldConfig: ListingField) => {
      const { key, scope = 'public', schemaType } = fieldConfig || {};
      const namespacePrefix = scope === 'public' ? `pub_` : `priv_`;
      const namespacedKey = `${namespacePrefix}${key}`;

      const isKnownSchemaType = EXTENDED_DATA_SCHEMA_TYPES.includes(schemaType);
      const isTargetScope = scope === targetScope;
      const isTargetListingType = isFieldForListingType(
        targetListingType,
        fieldConfig as any,
      );
      const isTargetCategory = isFieldForCategory(
        targetCategoryIds,
        fieldConfig as any,
      );

      if (
        isKnownSchemaType &&
        isTargetScope &&
        isTargetListingType &&
        isTargetCategory
      ) {
        const fieldValue = data[namespacedKey] || null;
        return { ...fields, [key]: fieldValue };
      } else if (isKnownSchemaType && isTargetScope) {
        // Note: this clears extra custom fields
        return { ...fields, [key]: null };
      }
      return fields;
    },
    {},
  );
};

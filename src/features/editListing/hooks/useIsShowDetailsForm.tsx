import { useConfiguration } from '@context/configurationContext';
import { useFormContext, useWatch } from 'react-hook-form';
import { EditListingForm } from '../types/editListingForm.type';

export const useIsShowDetailsForm = () => {
  const { control } = useFormContext<EditListingForm>();

  const config = useConfiguration();

  const listingType = useWatch<EditListingForm>({
    control,
    name: 'listingType',
  });

  const hasCategories =
    config?.categoryConfiguration?.categories &&
    config?.categoryConfiguration?.categories?.length > 0;

  const categoryPrefix = config?.categoryConfiguration?.key!;

  const hasDeepestSelectedCategorySubcategory = useWatch({
    control,
    name: 'fields',
    compute: (fields: EditListingForm['fields']) => {
      const categoryKeys = Object.keys(fields).filter(key =>
        key.startsWith(categoryPrefix),
      );
      const maxCategoryLevel = categoryKeys.reduce((max, key) => {
        return Math.max(max, Number(key.slice(-1)));
      }, 0);

      // Navigate through category hierarchy to find the deepest selected category config
      let deepestSelectedLevelSubcategories =
        config?.categoryConfiguration?.categories;

      for (let level = 1; level <= maxCategoryLevel; level++) {
        const categoryKey = `${categoryPrefix}${level}`;
        const categoryValue = fields[categoryKey];

        const selectedCategory = deepestSelectedLevelSubcategories?.find(
          category => category.id === categoryValue,
        );

        deepestSelectedLevelSubcategories = selectedCategory?.subcategories;

        if (
          !deepestSelectedLevelSubcategories ||
          deepestSelectedLevelSubcategories?.length === 0
        ) {
          return false;
        }
      }
      return (
        !!deepestSelectedLevelSubcategories &&
        deepestSelectedLevelSubcategories?.length > 0
      );
    },
  });

  return hasCategories ? !hasDeepestSelectedCategorySubcategory : listingType;
};

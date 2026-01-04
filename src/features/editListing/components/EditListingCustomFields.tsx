import { CustomExtendedDataField } from '@components/CustomExtendedDataField';
import { EXTENDED_DATA_SCHEMA_TYPES } from '@constants/schemaTypes';
import { useConfiguration } from '@context/configurationContext';
import {
  isFieldForCategory,
  isFieldForListingType,
  pickCategoryFields,
} from '@util/fieldHelpers';
import { useFormContext, useWatch } from 'react-hook-form';
import { useEditListingWizardRoute } from '../editListing.helper';
import { useIsCompatibleCurrency } from '../hooks/useIsCompatibleCurrency';
import { useIsShowDetailsForm } from '../hooks/useIsShowDetailsForm';
import { EditListingForm } from '../types/editListingForm.type';

const EditListingCustomFields = () => {
  const listingId = useEditListingWizardRoute().params.listingId;
  const { control } = useFormContext<EditListingForm>();
  const isShowDetailsForm = useIsShowDetailsForm();
  const isCompatibleCurrency = useIsCompatibleCurrency(listingId);

  const listingType = useWatch({
    control,
    name: 'type',
  });

  const config = useConfiguration();
  const categoryKey = config?.categoryConfiguration?.key!;
  const listingCategories = config?.categoryConfiguration?.categories ?? [];
  const listingFieldsConfig = config?.listing.listingFields ?? [];
  const selectedCategories = useWatch({
    control,
    name: 'fields',
    compute: (fields: EditListingForm['fields']) => {
      return pickCategoryFields(fields, categoryKey, 1, listingCategories);
    },
  });
  const targetCategoryIds = Object.values(selectedCategories);

  const fields = listingFieldsConfig.reduce((pickedFields, fieldConfig) => {
    const { key, schemaType, scope } = fieldConfig || {};
    const namespacedKey = scope === 'public' ? `pub_${key}` : `priv_${key}`;

    const isKnownSchemaType = EXTENDED_DATA_SCHEMA_TYPES.includes(schemaType);
    const isProviderScope = ['public', 'private'].includes(scope);
    const isTargetListingType = isFieldForListingType(
      listingType!,
      fieldConfig,
    );
    const isTargetCategory = isFieldForCategory(targetCategoryIds, fieldConfig);

    return isKnownSchemaType &&
      isProviderScope &&
      isTargetListingType &&
      isTargetCategory
      ? [
          ...pickedFields,
          <CustomExtendedDataField
            key={namespacedKey}
            control={control}
            name={namespacedKey}
            fieldConfig={fieldConfig}
            fieldType="listing"
            i18nIsDynamicList
          />,
        ]
      : pickedFields;
  }, [] as Element[]);

  if (!isShowDetailsForm || !isCompatibleCurrency) return null;

  return <>{fields}</>;
};

export default EditListingCustomFields;

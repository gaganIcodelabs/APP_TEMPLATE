import { CategoryNode } from '@appTypes/config/config';
import { CommonText, RadioList } from '@components/index';
import { useConfiguration } from '@context/configurationContext';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { useEditListingWizardRoute } from '../editListing.helper';
import { useIsCompatibleCurrency } from '../hooks/useIsCompatibleCurrency';
import { EditListingForm } from '../types/editListingForm.type';

const CategoryField = ({
  level,
  currentCategoryOptions,
  prefix,
}: {
  level: number;
  currentCategoryOptions: CategoryNode[];
  prefix: string;
}) => {
  const { control, setValue } = useFormContext<EditListingForm>();
  const currentCategoryKey = `${prefix}${level}`;
  const currentCategoryValue = useWatch({
    control,
    name: 'fields',
    compute: (fields: EditListingForm['fields']) => fields[currentCategoryKey],
  });

  const categoryConfig = currentCategoryOptions.find(
    category => category.id === currentCategoryValue,
  );

  return (
    <>
      <RadioList
        options={currentCategoryOptions.map(category => ({
          label: category.name,
          value: category.id,
        }))}
        value={currentCategoryValue?.toString?.()}
        onChange={value => {
          setValue(`fields.${currentCategoryKey}`, value);
        }}
      />
      {categoryConfig?.subcategories?.length &&
      categoryConfig?.subcategories?.length > 0 ? (
        <CategoryField
          level={level + 1}
          currentCategoryOptions={categoryConfig?.subcategories ?? []}
          prefix={prefix}
        />
      ) : null}
    </>
  );
};

// Main component that handles validation and wraps with Controller
const SelectListingCategory = () => {
  const { control } = useFormContext<EditListingForm>();
  const listingId = useEditListingWizardRoute().params.listingId;
  const config = useConfiguration();
  const listingType = useWatch<EditListingForm>({
    control,
    name: 'listingType',
  });
  const isCompatibleCurrency = useIsCompatibleCurrency(listingId);
  const prefix = config?.categoryConfiguration?.key;

  const listingCategories = useMemo(() => {
    return config?.categoryConfiguration?.categories ?? [];
  }, [config]);

  const hasCategories = listingCategories && listingCategories.length > 0;

  if (!prefix || !listingType || !hasCategories || !isCompatibleCurrency)
    return null;

  return (
    <View>
      <CommonText style={styles.label}>Select Listing Category</CommonText>
      <CategoryField
        level={1}
        currentCategoryOptions={listingCategories}
        prefix={prefix}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 12,
  },
});
export default SelectListingCategory;

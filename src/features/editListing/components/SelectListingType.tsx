import { Listing } from '@appTypes/index';
import { RadioList } from '@components/RadioList';
import { useConfiguration } from '@context/configurationContext';
import { useTypedSelector } from '@redux/store';
import { useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useEditListingWizardRoute } from '../editListing.helper';
import { EditListingForm } from '../types/editListingForm.type';

const SelectListingType = () => {
  const { control, watch, setValue } = useFormContext<EditListingForm>();
  const config = useConfiguration();
  const listingId = useEditListingWizardRoute().params.listingId;

  const selectedListingType = watch('listingType');

  const listingTypeConfigMap = useMemo(() => {
    return (
      config?.listing?.listingTypes?.reduce((acc, type) => {
        acc[type.listingType] = type;
        return acc;
      }, {} as Record<string, any>) || {}
    );
  }, [config]);

  useEffect(() => {
    if (!selectedListingType) return;

    const configEntry = listingTypeConfigMap[selectedListingType];
    if (!configEntry?.transactionType) return;

    const { alias, unitType } = configEntry.transactionType;

    setValue('fields.transactionProcessAlias', alias);
    setValue('fields.unitType', unitType);
  }, [selectedListingType, listingTypeConfigMap, setValue]);

  // Transform listing types from config to RadioList options
  const listingTypeOptions = useMemo(
    () =>
      config?.listing?.listingTypes?.map(type => ({
        label: type.label,
        value: type.listingType,
      })) || [],
    [config],
  );

  const hasMultipleListingTypes = listingTypeOptions.length > 1;

  const existingListingType = useTypedSelector(state =>
    listingId
      ? (state.marketplaceData.entities[listingId] as Listing)?.type
      : undefined,
  );

  return (
    <Controller
      control={control}
      name="listingType"
      defaultValue={existingListingType ?? undefined}
      render={({ field }) => (
        <RadioList
          label="What type of listing is this?"
          options={listingTypeOptions}
          value={field.value}
          onChange={field.onChange}
          visible={!existingListingType && hasMultipleListingTypes}
        />
      )}
    />
  );
};

export default SelectListingType;

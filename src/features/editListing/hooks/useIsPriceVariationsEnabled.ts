import { useConfiguration } from '@context/configurationContext';
import { useFormContext, useWatch } from 'react-hook-form';
import { EditListingForm } from '../types/editListingForm.type';

export const useIsPriceVariationsEnabled = () => {
  const config = useConfiguration();
  const { control } = useFormContext<EditListingForm>();
  const listingType = useWatch<EditListingForm>({
    control,
    name: 'type',
  });

  if (!listingType) return false;

  const listingTypeConfig = config?.listing?.listingTypes?.find(
    type => type.listingType === listingType,
  );

  // Check if price variations are enabled in the listing type config
  return listingTypeConfig?.priceVariations?.enabled === true;
};

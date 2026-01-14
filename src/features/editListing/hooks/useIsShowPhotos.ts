import { useConfiguration } from '@context/configurationContext';
import { useFormContext, useWatch } from 'react-hook-form';
import { EditListingForm } from '../types/editListingForm.type';

export const useIsShowPhotos = () => {
  const config = useConfiguration();
  const { control } = useFormContext<EditListingForm>();
  const listingType = useWatch<EditListingForm>({
    control,
    name: 'listingType',
  });

  if (!listingType) return false;

  const listingTypeConfig = config?.listing?.listingTypes?.find(
    type => type.listingType === listingType,
  );

  // Show pricing if listing type has pricing enabled
  return listingTypeConfig?.defaultListingFields?.images !== false;
};

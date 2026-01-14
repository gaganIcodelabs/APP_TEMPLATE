import { useConfiguration } from '@context/configurationContext';
import { useFormContext, useWatch } from 'react-hook-form';
import { EditListingForm } from '../types/editListingForm.type';

export const useIsShowLocation = () => {
  const config = useConfiguration();
  const { control } = useFormContext<EditListingForm>();
  const listingType = useWatch<EditListingForm>({
    control,
    name: 'listingType',
  });
  return (
    listingType &&
    config?.listing?.listingTypes?.find(
      type => type.listingType === listingType,
    )?.defaultListingFields?.location !== false
  );
};

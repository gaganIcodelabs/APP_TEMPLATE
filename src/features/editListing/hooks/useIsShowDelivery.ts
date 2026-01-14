import { useConfiguration } from '@context/configurationContext';
import { useFormContext, useWatch } from 'react-hook-form';
import { EditListingForm } from '../types/editListingForm.type';

export const useIsShowDelivery = () => {
  const config = useConfiguration();
  const { control } = useFormContext<EditListingForm>();
  const listingType = useWatch<EditListingForm>({
    control,
    name: 'listingType',
  });

  const listingTypeConfig = config?.listing?.listingTypes?.find(
    type => type.listingType === listingType,
  );

  const showPickup =
    listingType && listingTypeConfig?.defaultListingFields?.pickup !== false;

  const showShipping =
    listingType && listingTypeConfig?.defaultListingFields?.shipping !== false;

  return {
    showPickup,
    showShipping,
    showDelivery: showPickup || showShipping,
  };
};

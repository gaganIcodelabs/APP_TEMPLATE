import { useConfiguration } from '@context/configurationContext';
import { useFormContext, useWatch } from 'react-hook-form';
import { EditListingForm } from '../types/editListingForm.type';

/**
 * Check if availability field should be shown based on listing type configuration
 * Availability is shown only for listing types that have 'availability' in defaultListingFields
 */
export const useIsShowAvailability = () => {
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

  // Check if availability is in defaultListingFields
  const hasAvailabilityField =
    listingTypeConfig?.defaultListingFields?.availability === true;

  return hasAvailabilityField;
};

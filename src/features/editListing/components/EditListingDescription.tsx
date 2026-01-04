import { CommonTextInput } from '@components/index';
import { useFormContext } from 'react-hook-form';
import { useEditListingWizardRoute } from '../editListing.helper';
import { useIsCompatibleCurrency } from '../hooks/useIsCompatibleCurrency';
import { useIsShowDetailsForm } from '../hooks/useIsShowDetailsForm';
import { EditListingForm } from '../types/editListingForm.type';

const EditListingDescription = () => {
  const listingId = useEditListingWizardRoute().params.listingId;
  const { control } = useFormContext<EditListingForm>();
  const isCompatibleCurrency = useIsCompatibleCurrency(listingId);
  const isShowDetailsForm = useIsShowDetailsForm();

  if (!isShowDetailsForm || !isCompatibleCurrency) return null;

  return (
    <CommonTextInput
      control={control}
      name="description"
      labelKey="Listing Description"
      placeholder="Enter your listing description"
      multiline
    />
  );
};

export default EditListingDescription;
